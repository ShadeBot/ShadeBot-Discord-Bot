const Discord = require('discord.js');
var chillLink = /(http(s)?):\/\/[?a-zA-Z0-9:%._\-\+~#=]{2,256}[^..]\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+\-.~#?&//=]*)/
var invite = /(discord(\.gg|app\.com\/invite)\/([\w]{16}|([\w]+-?){2}))/

module.exports = (client, oldMessage, newMessage) => {
    if (newMessage.channel.type == "dm") {
		return;
	}
		// Invite checker
	if (invite.test(newMessage.content) && client.channelperms.invitesAllowed.indexOf(newMessage.channel.id) == -1 && !newMessage.author.bot) {
        client.conlog(`${newMessage.author.tag} sent a Discord link in ${newMessage.channel.name} (EDIT)\n` + chalk.white(`Message: ${newMessage.content}`)) // Logs
        newMessage.delete();
        newMessage.channel.send(`<:ShadeBotProfile:326817503076679690> Rule #8: Please do not Advertise other Discords <@${newMessage.author.id}>\nDoing this may cause you to be banned.`) // Sends Message + mentions
        const logChannel = newMessage.guild.channels.find('id', client.config.log.channelId);
        if (!logChannel) return;
	    logChannel.send(`<@${newMessage.author.id}> posted a Discord link in <#${newMessage.channel.id}>\nMessage: ${newMessage.content}`);
    }
       // Link checker
    else if (chillLink.test(newMessage.content) && client.channelperms.linksAllowed.indexOf(newMessage.channel.id) == -1) {
		if (oldMessage.content == newMessage.content) return; // Hopefully a fix for random edit problem!
        client.conlog(`${newMessage.author.tag} sent a link in #${newMessage.channel.name} (EDIT)`) // Logs
        newMessage.delete();
		newMessage.channel.send(`<:ShadeBotProfile:326817503076679690> <#${newMessage.channel.id}> rule: No links in this room. <@${newMessage.author.id}>.\nDoing this may cause you to be Muted/Kicked/Banned`) // Sends Message + mentions
        
		const logChannel = newMessage.guild.channels.find('id', client.config.log.channelId);
		if (logChannel == null) return console.log(chalk.redBright("Log Channel doesn't exist!!"));
        let linkEmbed = new Discord.MessageEmbed()
			.setTitle(newMessage.author.tag + " edited message in " + newMessage.channel.name + " with a link", newMessage.author.displayAvatarURL())
			.setDescription("Message: " + newMessage.content)
			.setColor("#212121")
        logChannel.send({ embed: linkEmbed })

    }
};