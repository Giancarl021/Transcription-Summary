import { mkdirSync as mkdir } from 'fs';
import multer from 'multer';
import constants from '../util/constants';

mkdir(constants.paths.temp, { recursive: true });

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

export default options;
