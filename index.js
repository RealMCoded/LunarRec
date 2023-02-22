#!/usr/bin/env node
const chalk = require('chalk')
const Sequelize = require('sequelize');
const child_process = require('child_process')
const { sendWebhook } = require("./webhook.js")
const { version } = require("./package.json")

try{process.commit = child_process.execSync('git rev-parse HEAD').toString().substring(0, 7)} catch(e) {process.commit = "[git not installed]"}

let versionStr = ` Version ${version} (commit ${process.commit})`

console.log(`${" ".repeat((versionStr.length-"lunarrec".length)/2)}${chalk.blue("LunarRec")}\n${versionStr}\n${"=".repeat(versionStr.length+1)}`)

//Init DB
const sequelize = new Sequelize('database', "", "", {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
process.db = require('./database.js')

async function start() {
    await process.db.users.sync()

	sendWebhook("✅ **This LunarRec instance has started!**")

    require('./src/server.js').start()
	require('./src/server_WS.js').start()
	require('./src/server_CDN.js').start()
}

start()