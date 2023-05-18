const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription(`Get the bots ping!`),
	async execute(interaction) {
		return interaction.reply(`🏓 **Pong!**\nTook \`${interaction.client.ws.ping}ms\` to respond!`)
	},
};