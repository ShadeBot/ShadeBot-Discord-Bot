const Discord = require('discord.js');

module.exports = (client, guild, user) => {
    guild.fetchAuditLogs({ type: 22  }).then(logs => {
		// GuildAuditLogsEntry for this user and type
		if (user.id == logs.entries.first().target.id) {
			banMember = logs.entries.first().target
			client.conlog(`${banMember.tag} (id: ${banMember.id}) has been banned from the server ${guild.name}`)
			let modlog = guild.channels.find('id', '216661960253636608');
			if (!modlog) return console.log(chalk.redBright("Log Channel doesn't exist!!"));
			var embedBan = new Discord.MessageEmbed()
				.setColor(0x212121)
				.setTimestamp()
				.addField('Action', "Ban", true)
				.addField('Target', `${banMember.tag} `, true)
				.addField('Moderator', logs.entries.first().executor.tag, true)
				.addField('Reason', 'Please provide a reason for ban:', false)
				.setFooter(`User banned (${banMember.id})`, banMember.displayAvatarURL());
			modlog.send({embed: embedBan})
		} 
	});

};