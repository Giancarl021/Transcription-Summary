import locate from '@giancarl021/locate';
import LogLevel from '../interfaces/LogLevel';
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
    },
    summarization: {
        systemMessage(lang: string) {
            return (
                'You create summaries of transcriptions from meetings with multiple speakers. If possible, create in list form. If you do not understand the context completely, make this clear when filling in the points. The language of the summary must be: ' +
                lang
            );
        }
    },
    log: {
        level: (String(process.env.LOG_LEVEL).toLowerCase() ||
            'info') as LogLevel
    }
};
