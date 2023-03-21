import { createReadStream } from 'fs';
import { OpenAIApi } from 'openai';
import openAiConfig from '../config/openAi';
import Logger from './Logger';

const logger = Logger('services:transcriber');

export default function (
    audioFilePaths: string[],
    initialDescription?: string
) {
    logger.debug('Creating OpenAI API instance');
    const api = new OpenAIApi(openAiConfig);

    async function transcribe() {
        logger.info('Starting transcription...');
        const blocks: string[] = [];

        for (const audioFilePath of audioFilePaths) {
            logger.debug(
                `[${blocks.length}] Transcribing file ${audioFilePath}...`
            );

            const response = await api.createTranscription(
                createReadStream(audioFilePath) as any,
                'whisper-1',
                initialDescription + '\n' + blocks.slice(-1).join('\n'),
                'json'
            );

            blocks.push(response.data.text);
        }

        logger.info('Finished transcription');
        return blocks.join('\n\n');
    }

    return {
        transcribe
    };
}
