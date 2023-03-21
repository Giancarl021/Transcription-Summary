import locate from '@giancarl021/locate';
import { gigabytes } from './storageSize';

export default {
    limits: {
        maximumFileSize: gigabytes(1)
    },
    paths: {
        temp: locate('tmp'),
        root: locate('.')
    },
    keys: {
        openAi: process.env.OPEN_AI_KEY
    }
};
