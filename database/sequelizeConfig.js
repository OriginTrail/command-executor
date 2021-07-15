require('dotenv').config();
const path = require('path');
const homedir = require('os').homedir();
const pjson = require('../package.json');

if (!process.env.ENV) {
    // Environment not set. Use the production.
    process.env.ENV = 'development';
}

const storagePath = path.resolve('database', 'system.db');

module.exports = {
    [process.env.ENV]: {
        dialect: 'sqlite',
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
