const { getAllGuilds } = require("../database/manage");
const { check, error } = require("./console");
const log = console.log;

async function addRank(client, id) {
    try {
        const guilds = await getAllGuilds();

        for (const guildData of guilds) {
            const guild = client.guilds.cache.get(guildData.id);
            const member = guild.members.cache.get(id) || null;
            if (member) {
                const role = await member.roles.add(guildData.role);
                if (role) log(check + `User "${member.user.username}" has received role`)
            }
        }
    } catch {
        log(error + `Error in role adding`)
    }
}

module.exports = { addRank };