const { Client, Collection, GatewayIntentBits, Options } = require('discord.js');
const fs = require('fs');
const { error, check } = require('./utils/console');
const log = console.log;
require('dotenv').config();
const db = require('./database/connect');

db.connect();

const client = new Client({
    //Data Cache
	makeCache: Options.cacheWithLimits({
		...Options.DefaultMakeCacheSettings,
		ReactionManager: 0,
		GuildMemberManager: {
			maxSize: 200,
			keepOverLimit: member => member.id === client.user.id,
		},
	}),

	//Data Sweeper
	sweepers: {
		...Options.DefaultSweeperSettings,
		messages: {
			interval: 1800, // Every hour...
			lifetime: 1800,	// Remove messages older than 30 minutes.
		},
		users: {
			interval: 1800, // Every hour...
			filter: () => user => user.bot && user.id !== client.user.id, // Remove all bots.
		},
	},

	intents: [
		GatewayIntentBits.AutoModerationConfiguration,
		GatewayIntentBits.AutoModerationExecution,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent
	],
});

module.exports = client;

// ************* EVENTS *************

const eventFiles = fs
    .readdirSync('./events')
    .filter((file) => file.endsWith('.js'))

    for (const file of eventFiles) {
        const event = require(`./events/${file}`)
        if (event.once) {
			log(check + `Event ${event.name} is now enable`)
            client.once(event.name, (...args) => event.execute(...args, client))
        } else {
			log(check + `Event ${event.name} is now enable`)
            client.on(
                event.name,
                async (...args) => {
                    try {
                        await event.execute(...args, client)
                    } catch(err) {
                        log(err)
                        return log(error + 'Error with event loading')
                    }
                } 
            )
        }
    }

// ************* COMMANDS *************

client.slashCommands = new Collection();
client.globalSlashCommands = new Collection();
client.autoCompleteCommands = new Collection();

const slashCommands = fs.readdirSync('./commands');
for (const module of slashCommands) {

    const commandFiles = fs
    .readdirSync(`./commands/${module}`)
    .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${module}/${file}`);
        if (command.global) {
            client.globalSlashCommands.set(command.data.name, command);
        }
        client.slashCommands.set(command.data.name, command);
		log(check + `Command ${command.data.name} is now enable`)
    }

}

// ************* LOGIN *************

client.login(process.env.TOKEN);

// ************* WEB SERVER *************

const website = require('./website/deploy');
website.deploy(client);