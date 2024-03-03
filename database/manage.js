const Guild = require('./models/guildSchema');
const User = require('./models/userSchema');
const log = console.log;

module.exports = class Manager {

    static async createGuild(id, channel, role) {
        const result = new Guild({
            id: id,
            channel: channel,
            role: role
        });

        await result.save();
        return result;
    }

    static async editGuild(id, channel, role) {
        const result = await Guild.findOneAndUpdate(
            {
                id: id
            },
            {
                channel: channel,
                role: role
            },
            {
                new: true
            }
        )

        if (result) {
            await result.save();
        }
        return result;
    }

    static async existGuild(id) {
        const result = await Guild.findOne({ id: id });
        return !!result;
    }

    static async getGuild(id) {
        return Guild.findOne({ id: id });
    }

    static async getAllGuilds() {
        return Guild.find();
    }

    static async createUser(data_token, data) {
        const result = new User({
            id: data.id,
            username: data.username,
            access_token: data_token.access_token,
            refresh_token: data_token.refresh_token,
            email: data.email,
            locale: data.locale
        })

        await result.save();
        return result;
    }

    static async editUser(data_token, data) {
        const result = await User.findOneAndUpdate(
            {
                id: data.id
            },
            {
                access_token: data_token.access_token,
                refresh_token: data_token.refresh_token,
            },
            {
                new: true
            }
        )

        if (result) {
            await result.save();
        }
        return result;
    }

    static async existUser(data) {
        const result = await User.findOne({ id: data.id });
        return !!result;
    }

};