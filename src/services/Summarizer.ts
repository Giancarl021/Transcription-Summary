import { OpenAIApi } from 'openai';
import openAiConfig from '../config/openAi';
import constants from '../util/constants';
import Logger from '../services/Logger';

const logger = Logger('services:summarizer');

export default function (language: string) {
    logger.debug('Creating OpenAI API instance');

    const api = new OpenAIApi(openAiConfig);

    async function summarize(text: string) {
        logger.info('Starting text summarization...');

        const response = await api.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    content: constants.summarization.systemMessage(language),
                    role: 'system'
                },
                {
                    content:
                        'Can you summarize the following meeting transcription?\n' +
                        text,
                    role: 'user'
                }
            ]
        });

        const { data } = response;

        logger.debug('Filtering and mapping choices...');

        const choices = data.choices
            .filter(
                choice => choice.message && choice.message?.role === 'assistant'
            )
            .map(choice => choice.message!.content);

        const result = choices.shift();

        logger.info('Finished text summarization');

        return result;
    }

    return {
        summarize
    };
}
