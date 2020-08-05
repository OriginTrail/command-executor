require('dotenv').config();
const path = require('path');
const homedir = require('os').homedir();
const pjson = require('./package.json');

if (!process.env.NODE_ENV) {
    // Environment not set. Use the production.
    process.env.NODE_ENV = 'development';
}

const storagePath = process.env.SEQUELIZEDB ?
    process.env.SEQUELIZEDB :
    path.join(homedir, `${pjson.name.substring(pjson.name.lastIndexOf('/') + 1)}`, 'system.db');

module.exports = {
    [process.env.NODE_ENV]: {
        database: 'main',
        host: '127.0.0.1',
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
