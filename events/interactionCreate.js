const { check, error } = require("../utils/console");
const log = console.log;
const { IDS } = process.env;

module.exports = {
    name: 'interactionCreate',
    once: false,

    async execute (interaction) {
        const { client, commandName, member } = interaction;
        if(!interaction) return;

        if (interaction.isChatInputCommand()) {
            try {
                const owners = IDS.toString().trim().split(',');
                if(!owners.includes(member.id)) {
                    log(error + "User can't use this command")
                    return interaction.reply({ content: `❌ » You can't used this command !`, ephemeral: true });
                } 
                const command = await client.slashCommands.get(commandName);
                command.execute(interaction, client)
                log(check + `command ${commandName} execute by ${member.user.username}`)
            } catch {
                log(error + `crash ${commandName} command`)
            }
        }
    }
}