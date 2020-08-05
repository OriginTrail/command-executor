const winston = require('winston');
require('winston-daily-rotate-file');
const util = require('util');
const colors = require('colors/safe');

const DEFAULT_LOG_LEVEL = 'trace';

class Logger {
    constructor() {
        this._logger = Logger._create();
    }

    /**
     * Create logger
     * @return {Logger|*}
     * @private
     */
    static _create() {
        let logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : DEFAULT_LOG_LEVEL;
        if (process.env.LOGS_LEVEL_DEBUG) {
            logLevel = 'debug';
        }

        try {
            const transports =
                [
                    new (winston.transports.Console)({
                        colorize: 'all',
                        timestamp: true,
                        formatter: args => `${new Date().toISOString()} - ${Logger._colorize(args.level)} - ${Logger._colorize(args.level, args.message)}`,
                        stderrLevels: [
                            'trace',
                            'notify',
                            'debug',
                            'info',
                            'warn',
                            'important',
                            'error',
                            'api',
                        ],
                    }),
                    new (winston.transports.DailyRotateFile)({
                        filename: 'commandexecutor-%DATE%.log',
                        datePattern: 'YYYY-MM-DD-HH',
                        zippedArchive: false,
                        maxSize: '20m',
                        maxFiles: '100',
                        json: false,
                        formatter: args => `${new Date().toISOString()} - ${args.level} - ${args.message}`,
                        dirname: 'logs',
                    }),
                ];

            const logger = new (winston.Logger)({
                level: logLevel,
                levels: {
                    error: 0,
                    important: 1,
                    warn: 2,
                    notify: 3,
                    api: 4,
                    info: 5,
                    trace: 6,
                    debug: 7,
                },
                rewriters: [
                    () => null, // disable metadata, we don't use it
                ],
                transports,
            });

            // Extend logger object to properly log 'Error' types
            const origLog = logger.log;
            logger.log = (level, ...rest) => {
                if (rest[0] instanceof Error) {
                    rest[1] = rest[0].stack;
                    origLog.apply(logger, rest);
                } else {
                    const msg = util.format(...rest);
                    const transformed = Logger.transformLog(level, msg);
                    if (!transformed) {
                        return;
                    }
                    origLog.apply(logger, [transformed.level, transformed.msg]);
                }
            };
            return logger;
        } catch (e) {
            console.error('Failed to create logger', e);
            process.exit(1);
        }
    }

    /**
     * Colorize message based on its level
     * @param level - Logging level
     * @param message - Message
     * @private
     * @return {*}
     */
    static _colorize(level, message) {
        const customColors = {
            trace: 'grey',
            notify: 'green',
            debug: 'yellow',
            info: 'white',
            warn: 'yellow',
            important: 'magenta',
            error: 'red',
            api: 'cyan',
            job: 'cyan',
        };

        if (typeof message === 'undefined') {
            message = level;
        }

        let colorized = message;
        if (customColors[level] instanceof Array) {
            for (let i = 0, l = customColors[level].length; i < l; i += 1) {
                colorized = colors[customColors[level][i]](colorized);
            }
        } else if (customColors[level].match(/\s/)) {
            const colorArr = customColors[level].split(/\s+/);
            for (let i = 0; i < colorArr.length; i += 1) {
                colorized = colors[colorArr[i]](colorized);
            }
            customColors[level] = colorArr;
        } else {
            colorized = colors[customColors[level]](colorized);
        }
        return colorized;
    }

    /**
     * Skips/Transforms third-party logs
     * @return {*}
     */
    static transformLog(level, msg) {
        return {
            level,
            msg,
        };
    }
}

const LOGGER_INSTANCE = new Logger();

// ensure the API is never changed
Object.freeze(LOGGER_INSTANCE);

/**
 * Creates simple proxy to logger underneath
 * @returns {Logger}
 */
const proxy = () => new Proxy(LOGGER_INSTANCE, {
    get(target, propKey) {
        return target._logger[propKey];
    },
});

const LOGGER_PROXY_INSTANCE = proxy();

// create a unique, global symbol name
// -----------------------------------
const LOGGER_KEY = Symbol.for('origintrail.command-executor.logger');

// check if the global object has this symbol
// add it if it does not have the symbol, yet
// ------------------------------------------

const globalSymbols = Object.getOwnPropertySymbols(global);
const hasLogger = (globalSymbols.indexOf(LOGGER_KEY) > -1);

if (!hasLogger) {
    global[LOGGER_KEY] = LOGGER_PROXY_INSTANCE;
}

module.exports = global[LOGGER_KEY];

