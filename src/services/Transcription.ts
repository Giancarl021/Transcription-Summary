import { File } from 'buffer';
import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import { OpenAIApi } from 'openai';
import openAiConfig from '../config/openAi';

export default function (audioFilePath: string, initialDescription?: string) {
    const api = new OpenAIApi(openAiConfig);

    async function transcribe() {
        const response = await api.createTranscription(
            createReadStream(audioFilePath) as any,
            'whisper-1',
            initialDescription,
            'verbose_json'
        );

        console.log(response);

        return response.data;
    }

    return {
        transcribe
    };
}
