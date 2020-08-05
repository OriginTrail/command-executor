/**
 * @constant {number} DEFAULT_COMMAND_CLEANUP_TIME_MILLS - Command cleanup interval time
 */
exports.DEFAULT_COMMAND_CLEANUP_TIME_MILLS = 4 * 24 * 60 * 60 * 1000;

/**
 * @constant {number} EXPORT_COMMAND_CLEANUP_TIME_MILLS -
 * Export command cleanup interval time 1h
 */
exports.EXPORT_COMMAND_CLEANUP_TIME_MILLS = 60 * 60 * 1000;

/**
 * @constant {number} HANDLER_IDS_COMMAND_CLEANUP_TIME_MILLS -
 * Export command cleanup interval time 1h
 */
exports.HANDLER_IDS_COMMAND_CLEANUP_TIME_MILLS = 60 * 60 * 1000;

/**
 * @constant {Array} PERMANENT_COMMANDS - List of all permanent commands
 */
exports.PERMANENT_COMMANDS = [
    'cleanerCommand', 'autoupdaterCommand',
];

/**
 * @constant {number} MAX_COMMAND_DELAY_IN_MILLS - Maximum delay for commands
 */
exports.MAX_COMMAND_DELAY_IN_MILLS = 14400 * 60 * 1000; // 10 days

/**
 * @constant {number} DEFAULT_COMMAND_REPEAT_IN_MILLS - Default repeat interval
 */
exports.DEFAULT_COMMAND_REPEAT_INTERVAL_IN_MILLS = 5000; // 5 seconds
