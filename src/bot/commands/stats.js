const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { instance_info, targetVersion } = require("../../../config.json")
const { version } = require("../../../package.json")
const {getPlayerTotal, getOnlinePlayers} = require("../../players.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription(`Get stats about this LunarRec instance!`),
	async execute(interaction) {
		var users = {
			registered: await getPlayerTotal(),
			online: await getOnlinePlayers()
		}

		const exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(`${instance_info.name} Stats`)
			.setURL(instance_info.website)
			.setDescription(`*"${instance_info.description}"*`)
			.addFields(
				{ name: 'Owner', value: `${instance_info.owner}`, inline: true },
				{ name: 'Target Version', value: `${targetVersion ?? "any build (pre-December 2018)"}`, inline: true },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Users Registered', value: `${users.registered}`, inline: true },
				{ name: 'Users Online', value: `${users.online}`, inline: true },
			)
			//.setTimestamp()
			.setFooter({ text: `Running LunarRec v${version} (commit ${process.commit})`, iconURL: 'https://raw.githubusercontent.com/RealMCoded/LunarRec/master/profileImages/__default.png' });

		interaction.reply({ embeds: [exampleEmbed] });
	},
};