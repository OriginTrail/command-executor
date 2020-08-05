const log = require('./modules/logger');
const Command = require('./modules/command');
const CommandExecutor = require('./modules/command-executor')
const CommandResolver = require('./modules/command-resolver')
const awilix = require('awilix');

class CommandExecutorWrapper {
    constructor(options) {
        this.container = awilix.createContainer({
            injectionMode: awilix.InjectionMode.PROXY,
        });

        this.container.register({
            logger: awilix.asValue(log),
            options: awilix.asValue(options),
            command: awilix.asClass(Command).singleton(),
            commandExecutor: awilix.asClass(CommandExecutor).singleton(),
            commandResolver: awilix.asClass(CommandResolver).singleton(),
        });

        this.commandExecutor = this.container.resolve('commandExecutor');
    }

    /**
     * Starts the command executor
     * @return {Promise<void>}
     */
    async init(commands, commandPatterns) {
        this.container.loadModules(commandPatterns, {
            formatName: 'camelCase',
            resolverOptions: {
                lifetime: awilix.Lifetime.SINGLETON,
                register: awilix.asClass,
            },
        });

        await this.commandExecutor.init(commands);
    }

    async start() {
        await this.commandExecutor.replay();
        await this.commandExecutor.start();
    }

    resolve(name) {
        return this.container.resolve(name);
    }
}

module.exports = CommandExecutorWrapper;