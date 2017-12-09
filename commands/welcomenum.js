exports.run = (client, message, args) => {
	if (client.config.ownerId.indexOf(message.author.id) == -1) return message.reply("Sorry you do not have permission to do this!")
	
	let count = parseInt(args[0])
	if (!count) return message.channel.send("Please provide a number for the Welcome Count!")
	client.storage[1].welcomeNum = count
	message.reply("Sucessfully changed the Welcome Counter to " + client.storage[1].welcomeNum)
	
	message.delete()
	client.saveFile("s");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['wnum'],
	cat: "moderation"
};

exports.help = {
  name: 'welcomenum',
  description: 'Change the Welcome number counter.',
  usage: 'welcomenum (welcome count)'
};