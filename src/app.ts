import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import rateLimitConfig from './config/rateLimit';
import routes from './routes';
import Logger from './services/Logger';

const limiter = rateLimit(rateLimitConfig);

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
app.use(limiter);
app.use(express.json());

logger.debug('Setting up routes...');

app.use(routes);

export default app;
