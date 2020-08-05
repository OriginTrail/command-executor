const CommandExecutorWrapper = require('./index');

async function main() {
    const wrapper = new CommandExecutorWrapper({ VERBOSE_LOGGING_ENABLED: false });
    await wrapper.init(['testCommand'], ['./modules/commands/*.js']);
    await wrapper.start();
}

main();