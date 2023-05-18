const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ActivityType, codeBlock } = require('discord.js');
const { discord_bot } = require('../../config.json');
const { LogType, log } = require("../logger.js")

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	log(LogType.Bot, `Bot logged in as ${client.user.tag}!`);

	let stat;
	switch (discord_bot.status.type) {
		case "PLAYING": stat = ActivityType.Playing; break;
		case "WATCHING": stat = ActivityType.Watching; break;
		case "LISTENING": stat = ActivityType.Listening; break;
		case "COMPETING": stat = ActivityType.Competing; break;
		default: stat = null; break;
	}

	if (stat != null) {
		client.user.setActivity(discord_bot.status.activity, { type: stat });
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		log(LogType.Error, e)
		await interaction.reply({ content: `❌ **There was an error while executing this command!**\n${codeBlock("json",error)}`, ephemeral: true });
	}
});

client.login(discord_bot.token);
