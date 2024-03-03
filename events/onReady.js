const { check } = require("../utils/console");
const { ActivityType } = require('discord.js');
const log = console.log;

module.exports = {
    name: 'ready',
    once: true,

    async execute (client) {
        log(check + `${client.user.username} is now connected`)
    
        client.user.setPresence({
            activities: [{ name: 'Protect 1.5M servers', type: ActivityType.Playing }],
            status: 'online',
        });
    }
}