const mongoose = require('mongoose');
const { check, error } = require('../utils/console');
require('dotenv').config();
const log = console.log;

module.exports.connect = async () => {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
        log(check + `Server mongodb is now "CONNECTED"`);
    })
    .catch(() => {
        log(error + `"CAN'T CONNECT" to the mongodb server`);
    })
}