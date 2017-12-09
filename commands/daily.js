const Discord = require('discord.js');

exports.run = (client, message, args) => {
	if (client.channelperms.botCommandsAllowed.indexOf(message.channel.id) == -1) return;
	client.addToDatabase(message.author.id);
	
	let userData = client.storage[message.author.id];	// user's data			
	let currentDate = new Date()
	let resetDate = new Date(userData.reset)
	
	if (resetDate < currentDate) {	// checks if cooldown is over.
		dailyAmount = 100
		client.addMoney(dailyAmount, userData);
		let dailyEmbed = new Discord.MessageEmbed()
			.setDescription(`💵 Sucessfully added \`${dailyAmount}\` ShadeBucks to your account!`)
      .setColor("#f58390")
      .setFooter(message.author.tag, message.author.displayAvatarURL())
		message.channel.send({ embed: dailyEmbed })
		let resetDate = client.addDays(currentDate, 1);
		userData.reset = resetDate;
		client.saveFile("s");
		
	// Before cooldown
	} else {
		let timeLeft = new Date(resetDate - currentDate);
    message.channel.send(`<@${message.author.id}>, Sorry but you still need to wait: **${timeLeft.getHours() }** hour(*s*), and **${timeLeft.getMinutes() }** minute(*s*)`)
	}
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  cat: "economy"
};

exports.help = {
  name: 'daily',
  description: 'Collect some ShadeBucks every 24 hours',
  usage: 'daily'
};