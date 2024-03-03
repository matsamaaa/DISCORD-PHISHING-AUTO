const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { getAllUsers } = require('../../database/manage');
const { request } = require('undici');
const { error, check, wait } = require('../../utils/console');
const log = console.log;
const { TOKEN, COLOR } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mass-join')
    .setDescription('joins a number of accounts on your server')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
    .setDMPermission(false)
    .addNumberOption(option => 
        option.setName('number')
        .setDescription('Number of people who will join')
        .setMinValue(1)
        .setRequired(false)
    )
    , async execute(interaction, client) {
        try {

            await interaction.reply({ content: `✔️ » Users will joined !`, ephemeral: true })
            log(wait + 'Starting join users')

            let join    = 0,
                refuse  = 0;
            
            const { guild } = interaction;

            if (guild) {
                const users = await getAllUsers();
                const numberPeople = interaction.options.getNumber('number') || users.length;
                while (join < numberPeople || users.length > 0) {
                    const user = users[0];
                    
                    let member = await guild.members.cache.get(user.id);
                    if (!member) {
                        const tokenResponseData = await request(`https://discord.com/api/guilds/${guild.id}/members/${user.id}`, {
                            method: 'PUT',
                            body: JSON.stringify({
                                'access_token': user.access_token,
                            }),
                            headers: {
                                'Authorization': `Bot ${TOKEN}`,
                                'Content-Type': 'application/json',
                            },
                        });
    
                        if (tokenResponseData.statusCode === 201) {
                            member = await guild.members.cache.get(user.id);
                            if (member) {
                                join++ // add join stat
                                log(check + `User ${member.user.username} is now on the guild ${join}/${numberPeople}`);
                            } else {
                                refuse++ // add refuse stat
                                log(error + `User ${member.user.username} can't join the guild ${join}/${numberPeople}`);
                            }
                        }
                    } else {
                        refuse++
                        log(error + `User ${member.user.username} is already in server`);
                    }
    
                    users.shift(); // remove the user of the list
                }
    
                const embed = new EmbedBuilder()
                .setColor(COLOR)
                .setTitle('🔗 Join Stats')
                .setDescription('This embed displays statistics from the stats command you just executed')
                .addFields(
                    {
                    name: `📈 Join Accept`,
                    value: join.toString(),
                    inline: true
                    },
                    {
                        name: `📉 Join Refuse`,
                        value: refuse.toString(),
                        inline: true
                    }
                )
                .setFooter({ text: `Secured by ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true })});
    
                await interaction.editReply({ content: '', embeds: [embed], ephemeral: true })
                log(check + `Finish join users (${join} joins)`)
            }

        } catch (err) {
            log(err)
            log(error + `Crash ${interaction.commandName} command`)
        }
    }
}