const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    access_token: String,
    refresh_token: String,
    email: String,
    locale: String
});

module.exports = mongoose.model('user', userSchema, 'oauth2_users');