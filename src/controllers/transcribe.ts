import { Request, Response } from 'express';
import Logger from '../services/Logger';

const logger = Logger('controllers:transcribe');

export default async function (request: Request, response: Response) {
    logger.info('Processing transcription request');

    if (!request.transcription) {
        logger.error('No transcription found');
        return response.status(404).json({
            error: 'No transcription found'
        });
    }

    logger.info('Finishing transcription request');

    return response.json({
        transcription: request.transcription
    });
}
