import chalk from 'chalk';
import LogLevel, { LogLevelValues } from '../interfaces/LogLevel';
import constants from '../util/constants';

const logLevel = constants.log.level;

type LogFunction = (message: string) => void;

const emptyLogger: LogFunction = _ => {};

const currentLvl = LogLevelValues[logLevel];

export default function (namespace: string) {
    function filter(fn: LogFunction, fnLevel: LogLevel): LogFunction {
        const fnLvl = LogLevelValues[fnLevel];
        if (fnLvl < currentLvl) return emptyLogger;

        return fn;
    }

    function time() {
        return chalk.greenBright(`[${new Date().toISOString()}]`);
    }

    function info(message: string) {
        console.log(
            `${time()} ${chalk.blueBright('INFO')} [${chalk.whiteBright(
                namespace
            )}] ${chalk.white(message)}`
        );
    }

    function warn(message: string) {
        console.log(
            `${time()} ${chalk.yellowBright('WARN')} [${chalk.whiteBright(
                namespace
            )}] ${chalk.white(message)}`
        );
    }

    function error(message: string) {
        console.log(
            `${time()} ${chalk.bgRedBright('ERROR')} [${chalk.whiteBright(
                namespace
            )}] ${chalk.white(message)}`
        );
    }

    function debug(message: string) {
        console.log(
            `${time()} ${chalk.bgGray('DEBUG')} [${chalk.whiteBright(
                namespace
            )}] ${chalk.white(message)}`
        );
    }

    return {
        info: filter(info, 'info'),
        warn: filter(warn, 'warn'),
        error: filter(error, 'error'),
        debug: filter(debug, 'debug')
    };
}
