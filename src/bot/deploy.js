const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { discord_bot } = require('../../config.json');

const token = discord_bot.token;

const clientId = discord_bot.clientID;

const guildId = discord_bot.serverID;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(() => {
	try {
		console.log(`[BOT] Registering ${commands.length} command(s)...`);

		rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		//console.error(commands);
		console.log(`[BOT] Successfully registered ${commands.length} command(s)!`);
	} catch (error) {
		console.error(error);
	}
})();