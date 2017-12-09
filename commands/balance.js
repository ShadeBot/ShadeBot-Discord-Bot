const Discord = require('discord.js');

exports.run = (client, message, args) => {
	if (client.channelperms.botCommandsAllowed.indexOf(message.channel.id) == -1) return;

	let mentionedUser = message.mentions.users.first() || message.guild.members.get(args[0])
	if (!mentionedUser) {
		var balID = message.author.id
		var balTag = message.author.tag
		var balPFP = message.author.displayAvatarURL()
	} else {
		var balID = mentionedUser.id
		var balTag = mentionedUser.tag
		var balPFP = mentionedUser.displayAvatarURL()
	}
	client.addToDatabase(balID);
	let userData = client.storage[balID];
	
	let balEmbed = new Discord.MessageEmbed()
    .setDescription(`💰 You currently have ${userData.money} ShadeBucks\n*You have had a total of ${userData.total} ShadeBucks in your account*`)
    .setColor("#4CAF50")
    .setFooter(balTag, balPFP);
	message.channel.send({ embed: balEmbed })
	client.saveFile("s");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["bal", "money"],
  cat: "economy"
};

exports.help = {
  name: 'balance',
  description: 'Check your own or another user\'s Shadebucks balance',
  usage: 'balance [@user]'
};


