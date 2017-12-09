module.exports = async (client, member) => {
    if (client.config.log.joinleave) {
		const logChannel = member.guild.channel.find('id', client.config.log.channelId)
		if (!logChannel) return console.log(chalk.redBright("Log Channel doesn't exist!!"));
		let joinEmbed = new Discord.RichEmbed()
			.setDescription(`📥 **${member.tag}** has \`\`joined\`\` the server. (${member.id})`)
			.setColor("#00ff00")
			.setFooter(`User joined (${member.guild.memberCount})`, member.displayAvatarURL)
			.setTimestamp(new Date())
		logChannel.send({embed: joinEmbed})
	}

};