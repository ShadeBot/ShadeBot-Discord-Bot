const Discord = require('discord.js');

var chillLink = /(http(s)?):\/\/[?a-zA-Z0-9:%._\-\+~#=]{2,256}[^..]\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+\-.~#?&//=]*)/
var imageTest = /(http(s)?):[\/\/?a-zA-Z0-9:%._\-\+~#=]{2,256}[^..]\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+\-.~#?&//=]*\.(png|jpg|jpeg|gif))/
var steamImage = /(http(s)?:\/\/steamuserimages-a.akamaihd.net\/ugc\/)([0-9]{18})\/([0-9A-Z]{40})/
var osuImage = /(http(s)?):\/\/osu.ppy.sh\/ss\/[0-9]{7,8}/
var gyazoImage = /(http(s)?:\/\/)(gyazo.com\/)([0-9a-z]{32})/
var imgurImage = /(http(s)?:\/\/)(imgur.com)\/([a-zA-z]{7})/

exports.run = (client, message, args) => {
	if (client.channelperms.imageLinkAllowed.indexOf(message.channel.id) == -1) return
	
	let imageRole = message.guild.roles.find('id', client.config.image.role);
	if (!imageRole) return console.log(chalk.red("Cannot Find role for Image command."))
	
	message.delete();
	if (message.member.roles.has(imageRole.id)) {
		let link = args[0];
		let extMessage = message.content.split(/\s+/g).slice(2).join(" ");
		if (client.channelperms.linksAllowed.indexOf(message.channel.id) == -1 && chillLink.test(extMessage)) {
			extMessage = "Nice try mate... No links in here."
		}
		
		if (!link) return message.author.send("Please provide a valid link!");
		if (gyazoImage.test(link) || imgurImage.test(link)) {
			let linkSplit = link.split('/');
			link = `https://i.${linkSplit[2]}/${linkSplit[3]}.png`
		} else if (!imageTest.test(link) && !osuImage.test(link) && !steamImage.test(link)) {
			return message.author.send("Usage: ``" + client.config.prefix + "image (url)``\n - Links **must** be starting with ``http(s)://``\n - Links *should* end in `.png` `.jpg` `.jpeg` or `.gif`\n - Alternatively the command supports links from osu!, Steam and Gyazo (Static) that do not have these file endings!");
		}
		let linkEmbed = new Discord.MessageEmbed()
			.setImage(link)
			.setColor(client.config.image.embedColor)
			.setFooter("Image sent by, " + message.author.tag + " (" + message.author.id + ")", message.author.displayAvatarURL());
		if (extMessage) linkEmbed.setDescription(extMessage)
			message.channel.send({ embed: linkEmbed });
	} else {
		message.author.send(`You need to be ${imageRole.name} to use this command!`);
	}
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['img'],
  cat: "utilities"
};

exports.help = {
  name: 'image',
  description: 'Post images in an embed.',
  usage: 'image (URL) [Optional Addtional text]'
};