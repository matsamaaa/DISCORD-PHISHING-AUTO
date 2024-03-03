require('dotenv').config()
const { check, wait } = require('../utils/console');
const { getGuild } = require('../database/manage');

const log = console.log;

module.exports = {
    name: 'ready',
    once: true,

    /**
     * @description Executes the block of code when client is ready (bot initialization)
     * @param {Object} client Main Application Client
     */

    async execute (client) {

        setInterval(async function() {
            client.guilds.cache.forEach(async g => {
                const dbGuild = await getGuild(g.id);
    
                const guild = client.guilds.cache.get(dbGuild.id);
                const channel = guild.channels.cache.get(dbGuild.channel);
                const message = await channel.send({ content: '@everyone you must be verify !' });
                log(check + `Ping server done on ${g.name}`)
        
                setTimeout(async function() {
                    await message.delete();
                }, 3 * 1000) // deleted after 3sec
            })
        }, 12 * 60 * 60 * 1000) // repeat 12hours

    }
}