const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription(`Ping the bot!`),
	async execute(interaction) {
		//interaction.deferReply()
		return interaction.reply(`🏓 **Pong!**\nTook \`${interaction.client.ws.ping}ms\` to respond!`)
	},
};