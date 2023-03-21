import ffmpegPath from 'ffmpeg-static';
import { path as ffprobePath } from 'ffprobe-static';
import { spawn } from 'child_process';
import constants from '../util/constants';
import { lstat, mkdir, rm } from 'fs/promises';
import { megabytes } from '../util/storageSize';
import Logger from './Logger';
import spawnPromise from '../util/spawnPromise';

type AudioSilenceMessage =
    | {
          type: 'start';
          point: number;
      }
    | {
          type: 'end';
          point: number;
          duration: number;
      };

type AudioSilencePoint = {
    start: number;
    end: number;
    duration: number;
};

const MB25 = megabytes(25);
const logger = Logger('services:audio');

export default function (inputFile: string) {
    logger.info(`Creating audio service for file ${inputFile}`);

    const context = {
        compressedFile: null as string | null,
        splitFilesDir: null as string | null,
        splitFiles: [] as string[]
    };

    async function compress() {
        const outputFile = `${inputFile}.converted.mp3`;

        logger.debug(`Compressing file ${inputFile} to ${outputFile}...`);

        await spawnPromise(
            ffmpegPath!,
            [
                '-i',
                inputFile,
                '-vn',
                '-ar',
                '44100',
                '-ac',
                '1',
                '-b:a',
                '192k',
                outputFile
            ],
            {
                stdio: 'ignore'
            }
        );

        logger.debug(`Compressed file ${inputFile} to ${outputFile}`);

        context.compressedFile = outputFile;
    }

    async function getSilence() {
        if (!context.compressedFile)
            throw new Error('No compressed file was found');

        const [, strerr] = await spawnPromise(ffmpegPath!, [
            '-i',
            context.compressedFile,
            '-af',
            'silencedetect=noise=-30dB:d=0.5',
            '-f',
            'null',
            '-'
        ]);

        const messages = strerr
            .split(/(\n|\r)\r?/)
            .filter(line => line.startsWith('[silencedetect @'))
            .map(line => {
                const [_type, _point, ...rest] = line
                    .replace(/^\[silencedetect\s(.*?)\]/, '')
                    .replace(/(\|\s|\n)/, '')
                    .trim()
                    .split(' ');

                let message: AudioSilenceMessage;
                const point = Number(_point);

                switch (_type) {
                    case 'silence_start:':
                        message = {
                            type: 'start',
                            point
                        };
                        break;
                    case 'silence_end:':
                        const duration = Number(rest.pop());
                        message = {
                            type: 'end',
                            point,
                            duration
                        };
                        break;
                    default:
                        throw new Error(`Unknown type ${_type}`);
                }

                return message;
            });

        const silencePoints: AudioSilencePoint[] = [];
        let currentStart: number | null = null;

        for (const message of messages) {
            if (
                (currentStart === null && message.type !== 'start') ||
                (currentStart !== null && message.type !== 'end')
            )
                throw new Error('First message is not a start');

            if (message.type === 'start') {
                currentStart = message.point;
            } else if (currentStart === null) {
                throw new Error('Current start is null');
            } else {
                silencePoints.push({
                    start: currentStart,
                    end: message.point,
                    duration: message.duration
                });
                currentStart = null;
            }
        }

        return silencePoints;
    }

    async function split() {
        logger.debug(`Splitting file ${context.compressedFile}...`);

        if (!context.compressedFile)
            throw new Error('No compressed file was found');

        const stat = await lstat(context.compressedFile);
        const fileSize = stat.size;

        if (fileSize <= MB25) {
            logger.debug('File smaller than 25MB, no need to split');
            context.splitFiles = [context.compressedFile!];
            return;
        }

        logger.debug('Starting splitting...');

        context.splitFilesDir = `${inputFile}.splitted.d`;

        logger.debug('Creating splitted directory...');

        await mkdir(context.splitFilesDir, { recursive: true });

        const partCount = Math.ceil(fileSize / MB25);

        logger.debug(
            `File size is ${fileSize} bytes, part count is ${partCount}`
        );

        const [_duration] = await spawnPromise(ffprobePath, [
            '-i',
            inputFile,
            '-show_entries',
            'format=duration',
            '-v',
            'quiet'
        ]);

        const duration = Number(
            _duration
                .split('\n')
                .find(line => line.startsWith('duration='))
                ?.replace('duration=', '') ?? '0'
        );

        if (duration === 0) throw new Error('Could not get duration of file');

        logger.debug(`Duration is ${duration} seconds`);

        const silencePoints = (await getSilence()).reverse();

        const partDuration = duration / partCount;

        logger.debug(
            `Each splitted part has a duration of ${partDuration} seconds`
        );

        let currentPoint = 0;

        const partitioningPromises: Promise<[string, string]>[] = [];

        let index = 0;

        logger.debug('Starting partitioning...');

        while (currentPoint < duration) {
            const target = currentPoint + partDuration;

            logger.debug(
                `Current point is ${currentPoint}, ideal target is ${target}`
            );

            let endCut: number;

            if (target >= duration) {
                endCut = duration;
            } else {
                const silencePoint = silencePoints.find(
                    point => point.start >= currentPoint && point.end <= target
                );

                endCut = silencePoint?.start ?? target;
            }

            logger.debug(
                `Ideal target at ${target}, actual target at ${endCut}`
            );

            const partFile = `${context.splitFilesDir}/${index++}.mp3`;

            partitioningPromises.push(
                spawnPromise(ffmpegPath!, [
                    '-i',
                    context.compressedFile,
                    '-ss',
                    currentPoint.toString(),
                    '-to',
                    endCut.toString(),
                    '-c',
                    'copy',
                    partFile
                ])
            );

            logger.debug(
                `Partitioning file ${context.compressedFile} to ${partFile}...`
            );

            context.splitFiles.push(partFile);

            currentPoint = endCut;
        }

        await Promise.all(partitioningPromises);
    }

    async function convert(): Promise<string[]> {
        logger.info(`Converting file ${inputFile}...`);

        await compress();
        await split();

        logger.info(
            `Converted file ${inputFile} info ${context.splitFiles.join(', ')}`
        );

        return context.splitFiles;
    }

    async function end() {
        logger.info('Removing temporary files...');

        logger.debug('Removing input file');
        const promises = [rm(inputFile, { force: true })];

        if (context.compressedFile) {
            logger.debug('Removing compressed file');
            promises.push(rm(context.compressedFile, { force: true }));
        }

        if (context.splitFilesDir) {
            logger.debug('Removing split files directory');
            promises.push(
                rm(context.splitFilesDir, { force: true, recursive: true })
            );
        }

        await Promise.all(promises);

        logger.info('Removed temporary files');
    }

    return {
        convert,
        end
    };
}
