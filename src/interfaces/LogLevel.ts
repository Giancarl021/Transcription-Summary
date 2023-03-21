type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const LogLevelValues = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
} as const;

export default LogLevel;
