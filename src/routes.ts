import { Router } from 'express';
import multer from 'multer';
import multerOptions from './config/multer';
import controllers from './controllers';
import middlewares from './middlewares';
import Logger from './services/Logger';

const logger = Logger('routes');

logger.debug('Initializing routes...');

const routes = Router();

logger.debug('Setting up file handler (`multer`) middleware...');

const upload = multer(multerOptions);

logger.debug('Setting up routes...');

routes.post(
    '/transcribe',
    upload.single('audio-file'),
    middlewares.transcribe,
    controllers.transcribe
);

routes.post(
    '/summarize',
    upload.single('audio-file'),
    middlewares.transcribe,
    controllers.summarize
);

export default routes;
