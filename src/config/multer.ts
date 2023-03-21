import { mkdirSync as mkdir, existsSync as exists, rmSync as rm } from 'fs';
import multer from 'multer';
import constants from '../util/constants';
import Logger from '../services/Logger';

const logger = Logger('config:multer');

logger.debug('Initializing multer options...');

logger.debug('Cleaning up temporary directory...');

if (exists(constants.paths.temp))
    rm(constants.paths.temp, { recursive: true, force: true });

mkdir(constants.paths.temp, { recursive: true });

logger.debug('Generating multer options');

const options: multer.Options = {
    storage: multer.diskStorage({
        destination: constants.paths.temp,
        filename(_, file, callback) {
            const suffix = `${Date.now()}.${Math.round(Math.random() * 1e5)}`;

            const extension = file.originalname.split('.').pop();

            callback(null, `audio.${suffix}.${extension}`);
        }
    }),
    limits: {
        fileSize: constants.limits.maximumFileSize
    }
};

logger.debug('Finished initializing multer options');

export default options;
