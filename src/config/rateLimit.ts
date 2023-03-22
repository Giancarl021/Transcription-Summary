import { Options } from 'express-rate-limit';
import { minutes } from '../util/timeOperations';
import Logger from '../services/Logger';
import constants from '../util/constants';

const logger = Logger('config:rateLimit');

logger.debug(
    `Generating rate limit options with windowSize=${constants.limits.rateLimit.window}ms, maxRequests=${constants.limits.rateLimit.requestsPerWindow}/window`
);

const options: Partial<Options> = {
    windowMs: constants.limits.rateLimit.window,
    max: constants.limits.rateLimit.requestsPerWindow,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests, wait a minute and try again'
    }
};

logger.debug('Finished generating rate limit options');

export default options;
