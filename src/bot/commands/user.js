const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { serverAddress } = require("../../../config.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription(`Get user info!`)
		.addStringOption(string =>
			string.setName("username")
				.setRequired(true)
				.setDescription("the user's unique username")),
	async execute(interaction) {
		const db = process.db.users
		//find the user
		const usr = await db.findOne({ where: {username: interaction.options.getString("username")} })

		if (usr) {
			//expand on this (user icon, etc..)
			const exampleEmbed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle(`${usr.display_name} (@${usr.username})`)
				.addFields(
					{ name: 'Registered on', value: `<t:${Math.floor(new Date(usr.createdAt).getTime()/1000)}:F>`, inline: true },
				)
				.setThumbnail(`${serverAddress}/img/${usr.id}`)
				//.setTimestamp()

			interaction.reply({ embeds: [exampleEmbed] });
		} else {
			interaction.reply({ content: `❌ **The user "${interaction.options.getString("username")}" does not exist!**`, ephemeral: true })
		}
	},
};