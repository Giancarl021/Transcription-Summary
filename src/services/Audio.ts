import ffmpegPath from 'ffmpeg-static';
import { path as ffprobePath } from 'ffprobe-static';
import { spawn } from 'child_process';
import constants from '../util/constants';
import { lstat, rm } from 'fs/promises';
import { megabytes } from '../util/storageSize';
import Logger from './Logger';

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

        await new Promise((resolve, reject) => {
            const process = spawn(
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

            process.on('close', () => resolve(null));
            process.on('error', reject);
        });

        logger.debug(`Compressed file ${inputFile} to ${outputFile}`);

        context.compressedFile = outputFile;
    }

    async function split() {
        logger.debug(`Splitting file ${context.compressedFile}...`);

        if (!context.compressedFile)
            throw new Error('No compressed file was found');

        const stat = await lstat(context.compressedFile);

        if (stat.size <= MB25) {
            logger.debug('File smaller than 25MB, no need to split');
            context.splitFiles = [context.compressedFile];
            return;
        }

        logger.debug('Starting splitting...');

        context.splitFilesDir = `${inputFile}-splitted`;
        context.splitFiles = [];
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
