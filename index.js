const chalk = require('chalk')
const Sequelize = require('sequelize');

console.log(`   ${chalk.blue("LunarRec")}\n==============`)

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

    require('./src/server.js').start()
	require('./src/server_WS.js').start()
}

start()