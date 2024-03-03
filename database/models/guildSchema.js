const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    id: String,
    channel: String,
    role: String
});

module.exports = mongoose.model('guild', guildSchema, 'guilds');