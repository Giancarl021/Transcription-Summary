import { Request, Response } from 'express';
import Summarizer from '../services/Summarizer';
import Logger from '../services/Logger';

const logger = Logger('controllers:summarize');

export default async function (request: Request, response: Response) {
    logger.info('Processing summarization request');

    const { transcription } = request;
    const { language = 'en' } = request.body;

    if (!transcription) {
        logger.error('No transcription found');
        return response.status(404).json({
            error: 'No transcription found'
        });
    }

    logger.debug('Creating summarizer');

    const summarizer = Summarizer(language);

    logger.debug('Summarizing transcription');

    const result = await summarizer.summarize(transcription);

    logger.info('Finishing summarization request');

    return response.json({ summary: result });
}
