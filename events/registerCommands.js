const fs = require('fs');
require('dotenv').config()
const { check, wait } = require('../utils/console');

const log = console.log;

module.exports = {
    name: 'ready',
    once: true,

    /**
     * @description Executes the block of code when client is ready (bot initialization)
     * @param {Object} client Main Application Client
     */

    async execute (client) {

        log(wait + 'Starting command registration')
    
        const dir = `${__dirname}/../commands`;
        const commandsFolder = fs.readdirSync(dir)
        let commandsListe = [];
        for(const folder of commandsFolder) {
            fs.readdirSync(`${dir}/${folder}`).filter(file => file.endsWith('.js')).forEach(file => {
                const command = require(`${dir}/${folder}/${file}`)
                commandsListe.push(command.data)
            })
        }
        client.application.commands.set(commandsListe.map(cmd => cmd))

        log(check + 'Updated slash commands')
    }
}