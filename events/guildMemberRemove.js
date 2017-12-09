const Discord = require('discord.js');

module.exports = (client, member) => {
    if (client.config.log.joinleave) {
		const logChannel = member.guild.channel.find('id', client.config.log.channelId)
		if (!logChannel) return console.log(chalk.redBright("Log Channel doesn't exist!!"));
		let joinEmbed = new Discord.MessageEmbed()
			.setDescription(`📤 **${member.tag}** has \`\`lefted\`\` the server. (${member.id})`)
			.setColor("#00ff00")
			.setFooter(`User joined (${member.guild.memberCount})`, member.displayAvatarURL())
			.setTimestamp(new Date())
		logChannel.send({embed: joinEmbed})
	}
	member.guild.fetchAuditLogs({ type: 20  }).then(logs => {
		// GuildAuditLogsEntry for this user and type
		if (member.id == logs.entries.first().target.id) {
			kickMember = logs.entries.first().target
			client.conlog(`${kickMember.tag} (id: ${kickMember.id}) has been kicked from the server ${member.guild.name}`)
			let modlog = member.guild.channels.find('id', '216661960253636608');
			if (!modlog) return console.log(chalk.redBright("Log Channel doesn't exist!!"));
			var embedKick = new Discord.MessageEmbed()
				.setColor(0x212121)
				.setTimestamp()
				.addField('Action', "Kick", true)
				.addField('Target', `${kickMember.tag} `, true)
				.addField('Moderator', logs.entries.first().executor.tag, true)
				.addField('Reason', 'Please provide a reason for kicking:', false)
				.setFooter(`User Kicked (${kickMember.id})`, kickMember.displayAvatarURL());
			modlog.send({embed: embedKick})
		} 
	});
};