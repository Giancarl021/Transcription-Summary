import express from 'express';
import cors from 'express';
import routes from './routes';
import Logger from './services/Logger';

declare module 'express-serve-static-core' {
    interface Request {
        transcription?: string;
    }
}

const logger = Logger('app');

logger.debug('Initializing app...');

const app = express();

logger.debug('Setting up global middlewares...');

app.use(cors());
app.use(express.json());

logger.debug('Setting up routes...');

app.use(routes);

export default app;
