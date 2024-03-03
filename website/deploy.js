const express = require('express');
const { check, error } = require('../utils/console');
const { request } = require('undici');
const { createUser, existUser, editUser } = require('../database/manage');
const { addRank } = require('../utils/rank');
require('dotenv').config();
const log = console.log;
const { PORT, BOT_URL, REDIRECT_URL, SECRET_CLIENT, ID } = process.env;

module.exports.deploy = async (client) => {

    const app = express()
    app.get('/verif', async (req, res) => {

        const code = req.query.code;

        if (code) {
            try {
                const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
                    method: 'POST',
                    body: new URLSearchParams({
                        client_id: ID,
                        client_secret: SECRET_CLIENT,
                        code,
                        grant_type: 'authorization_code',
                        redirect_uri: REDIRECT_URL,
                        scope: 'identify',
                    }).toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                const oauthData = await tokenResponseData.body.json();

                const userResult = await request('https://discord.com/api/users/@me', {
                    headers: {
                        authorization: `${oauthData.token_type} ${oauthData.access_token}`,
                    },
                });

                const data = await userResult.body.json();
                const isUser = await existUser(data);
                if(isUser) {
                    await editUser(oauthData, data);
                } else {
                    await createUser(oauthData, data);
                }

                log(check + `User "${data.username}" has accept conditions`);
                await addRank(client, data.id);
            } catch {
                log(error + `Error with user code`);
            }
        }
        res.redirect(REDIRECT_URL)
    });

    app.get('*', (req, res) => {
        res.redirect(BOT_URL)
        log(error + `User redirect for wrong url`);
    });

    app.listen(PORT, async () => {
        log(check + `Server is now running on port::${PORT}`);
    })
}