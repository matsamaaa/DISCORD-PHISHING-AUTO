const { check, error } = require("../utils/console");
const log = console.log;

module.exports = {
    name: 'interactionCreate',
    once: false,

    async execute (interaction) {
        const { client, commandName, member } = interaction;
        if(!interaction) return;

        if (interaction.isChatInputCommand()) {
            try {
                const command = await client.slashCommands.get(commandName);
                command.execute(interaction, client)
                log(check + `command ${commandName} execute by ${member.user.username}`)
            } catch {
                log(error + `crash ${commandName} command`)
            }
        }
    }
}