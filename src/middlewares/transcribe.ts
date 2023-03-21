import { NextFunction, Request, Response } from 'express';
import Audio from '../services/Audio';
import Transcription from '../services/Transcription';
import Logger from '../services/Logger';

const logger = Logger('middleware:transcribe');

export default async function (
    request: Request,
    response: Response,
    next: NextFunction
) {
    logger.info('Processing transcription request');

    const audioFile = request.file;

    if (!audioFile) {
        logger.error('No audio file was provided');
        return response.status(400).json({
            error: 'No audio file was provided'
        });
    }

    logger.debug('Creating audio service');

    const audio = Audio(audioFile.path);
    const description: string | undefined = request.body.description;

    logger.debug('Converting audio to smaller parts');

    const convertedAudioParts = await audio.convert();

    logger.debug('Transcribing audio');

    const transcription = Transcription(convertedAudioParts, description);

    const result = await transcription.transcribe();

    logger.debug('Finishing audio processing');

    await audio.end();

    logger.debug('Attaching transcription to request');

    request.transcription = result;

    logger.info('Finishing transcription request');

    return next();
}
