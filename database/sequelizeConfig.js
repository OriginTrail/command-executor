require('dotenv').config();
const path = require('path');
const getPath = () => {
    if(process.env.npm_lifecycle_script){
        return path.resolve('database', 'system.db');
    }
    return path.resolve('node_modules','@tracelabs', 'command-executor', 'database', 'system.db')
}

const storagePath = getPath();

module.exports = {
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
};
