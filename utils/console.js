const chalk = require('chalk');

const error = `[${chalk.red.bold('x')}] `;
const check = `[${chalk.green.bold('V')}] `;
const wait = `[${chalk.yellow.bold('~')}] `;

const tab = `\n\n\n`;

module.exports = { error, check, wait, tab };