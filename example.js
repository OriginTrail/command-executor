// const log = require('./modules/logger');
// const Command = require('./modules/command');
// const CommandExecutor = require('./modules/command-executor')
// const CommandResolver = require('./modules/command-resolver')
// const TestCommand = require('./modules/commands/test-command')
// const awilix = require('awilix');
//
// async function main(){
//     // Create the container and set the injectionMode to PROXY (which is also the default).
//     const container = awilix.createContainer({
//         injectionMode: awilix.InjectionMode.PROXY,
//     });
//
//     container.register({
//         logger: awilix.asValue(log),
//         command: awilix.asClass(Command).singleton(),
//         commandExecutor: awilix.asClass(CommandExecutor).singleton(),
//         commandResolver: awilix.asClass(CommandResolver).singleton(),
//         testCommand: awilix.asClass(TestCommand).singleton(),
//     });
//
//     const commandExecutor = container.resolve('commandExecutor');
//     await commandExecutor.init();
//     await commandExecutor.replay();
//     await commandExecutor.start();
// }
//
// main();

const CommandExecutorWrapper = require('./index');

async function main(){
    const wrapper = new CommandExecutorWrapper();
    await wrapper.init(['testCommand'], ['./modules/commands/*.js']);
    await wrapper.start();
}

main();