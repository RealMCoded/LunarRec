#!/usr/bin/env node
const chalk = require('chalk')
const Sequelize = require('sequelize');
const child_process = require('child_process')
const { sendWebhook } = require("./webhook.js")
const { version } = require("./package.json")
const fs = require('fs');

//load colors
process.colors = require('./colors.json')

try{process.commit = child_process.execSync('git rev-parse HEAD').toString().substring(0, 7)} catch(e) {process.commit = "[git not installed]"}

let versionStr = ` Version ${version} (commit ${process.commit})`

console.log(`${" ".repeat((versionStr.length-"lunarrec".length)/2)}${chalk.hex(process.colors.logo)("LunarRec")}\n${versionStr}\n${"=".repeat(versionStr.length+1)}`)

//Reset data command
if (process.argv[2] == "reset"){
	try {
		console.log("Deleting Database...")
		fs.unlinkSync("./database.sqlite")
	} catch(e){
		console.log("Database file never existed to start with!")
	}

	console.log("Deleting Profile Images...")
	let dir = "./profileImages/"
	const files = fs.readdirSync(dir);
	files.forEach((file) => {
		if (file === "__default.png") return;
		fs.unlinkSync(`${dir}/${file}`);
	});

	console.log("Data Reset Complete.")
	process.exit()
}

//Init DB
process.db = require('./database.js')

async function start() {
    await process.db.users.sync()

    require('./src/server.js').start()

	sendWebhook("✅ **This LunarRec instance has started!**")
}

start()