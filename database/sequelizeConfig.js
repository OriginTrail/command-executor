require('dotenv').config();
const path = require('path');
const homedir = require('os').homedir();
const pjson = require('../package.json');

if (!process.env.ENV) {
    // Environment not set. Use the production.
    process.env.ENV = 'development';
}

const storagePath = process.env.DATABASE_COMMAND_EXECUTOR_PATH ?
    process.env.DATABASE_COMMAND_EXECUTOR_PATH :
    path.join(homedir, `${pjson.name.substring(pjson.name.lastIndexOf('/') + 1)}`, 'database', 'system.db');

module.exports = {
    [process.env.ENV]: {
        database: 'main',
        host: '127.0.0.1',
        dialect: 'sqlite',
        password: process.env.DATABASE_COMMAND_EXECUTOR_PASSWORD,
        storage: storagePath,
        migrationStorageTableName: 'sequelize_meta',
        logging: false,
        operatorsAliases: false,
        define: {
            underscored: true,
            timestamps: false,
        },
        retry: {
            match: [
                /SQLITE_BUSY/,
            ],
            name: 'query',
            max: 5,
        },
    },
};
