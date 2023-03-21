import { Request, Response } from 'express';
import Audio from '../services/Audio';
import Transcription from '../services/Transcription';

export default async function (request: Request, response: Response) {
    const audioFile = request.file;

    if (!audioFile) {
        return response.status(400).json({
            error: 'No audio file was provided'
        });
    }

    const audio = Audio(audioFile.path);

    const convertedAudio = await audio.convert();
    const transcription = Transcription(convertedAudio[0]);

    const result = await transcription.transcribe();

    await audio.end();

    return response.send(result);
}
