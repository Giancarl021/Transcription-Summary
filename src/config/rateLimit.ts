import { Options } from 'express-rate-limit';
import { minutes } from '../util/timeOperations';

const options: Partial<Options> = {
    windowMs: minutes(1),
    max: 2,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests, wait a minute and try again'
    }
};

export default options;
