import ffmpegPath from 'ffmpeg-static';
import { path as ffprobePath } from 'ffprobe-static';
import { spawn } from 'child_process';
import constants from '../util/constants';
import { lstat, rm } from 'fs/promises';
import { megabytes } from '../util/storageSize';

const MB25 = megabytes(25);

export default function (inputFile: string) {
    const context = {
        compressedFile: null as string | null,
        splitFilesDir: null as string | null,
        splitFiles: [] as string[]
    };

    async function compress() {
        const outputFile = `${inputFile}.converted.mp3`;

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

        context.compressedFile = outputFile;
    }

    async function split() {
        if (!context.compressedFile)
            throw new Error('No compressed file was found');

        const stat = await lstat(context.compressedFile);

        if (stat.size <= MB25) {
            context.splitFiles = [context.compressedFile];
            return;
        }

        context.splitFilesDir = `${inputFile}-splitted`;
        context.splitFiles = [];
    }

    async function convert(): Promise<string[]> {
        await compress();
        await split();

        return context.splitFiles;
    }

    async function end() {
        const promises = [rm(inputFile, { force: true })];

        if (context.compressedFile) {
            promises.push(rm(context.compressedFile, { force: true }));
        }

        if (context.splitFilesDir) {
            promises.push(
                rm(context.splitFilesDir, { force: true, recursive: true })
            );
        }

        await Promise.all(promises);
    }

    return {
        convert,
        end
    };
}
