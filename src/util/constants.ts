import { LogLevelValues } from './../interfaces/LogLevel';
import locate from '@giancarl021/locate';
import LogLevel from '../interfaces/LogLevel';
import { gigabytes } from './storageSize';
import { minutes } from './timeOperations';
import validate, { required, stringToNumberValidator } from './validate';

export default {
    limits: {
        maximumFileSize: gigabytes(1),
        rateLimit: {
            requestsPerWindow: Number(
                validate(
                    process.env.RATE_LIMIT_REQ_PER_WINDOW,
                    stringToNumberValidator.positives,
                    '2'
                )
            ),
            window: minutes(
                Number(
                    validate(
                        process.env.RATE_LIMIT_WINDOW_MINUTES,
                        stringToNumberValidator.positives,
                        '1'
                    )
                )
            )
        } as const
    } as const,
    paths: {
        temp: locate('tmp'),
        root: locate('.')
    } as const,
    keys: {
        openAi: required(process.env.OPEN_AI_KEY, 'OPEN_AI_KEY')
    } as const,
    summarization: {
        systemMessage(lang: string) {
            return (
                'You create summaries of transcriptions from meetings with multiple speakers. If possible, create in list form. If you do not understand the context completely, make this clear when filling in the points. The language of the summary must be: ' +
                lang
            );
        }
    } as const,
    log: {
        level: validate<string, LogLevel>(
            process.env.LOG_LEVEL,
            l => Boolean(l && Object.keys(LogLevelValues).includes(l)),
            'info'
        )
    } as const,
    port: Number(
        validate(process.env.PORT, stringToNumberValidator.positives, '80')
    )
};
