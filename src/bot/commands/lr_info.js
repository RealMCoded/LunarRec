const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { version } = require("../../../package.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lunarrec')
		.setDescription(`LunarRec commands`)
		.addSubcommand(subcommand =>
			subcommand
			.setName("about")
			.setDescription("Learn more about the bot")),
	async execute(interaction) {
		const cmd = interaction.options.getSubcommand()
		
		if(cmd == "about"){
            const embed = new EmbedBuilder()
                .setTitle("LunarRec")
                .setDescription(`Version v${version} ([commit \`${process.commit}\`](https://github.com/RealMCoded/LunarRec/commit/${process.commit}))`)
                .setThumbnail("https://raw.githubusercontent.com/RealMCoded/LunarRec/master/profileImages/__default.png")
            await interaction.reply({embeds: [embed]})
		}
	},
};