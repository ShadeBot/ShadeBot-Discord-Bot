/*global wait*/
const warned = [];
var chillLink = /(http(s)?):\/\/[?a-zA-Z0-9:%._\-\+~#=]{2,256}[^..]\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+\-.~#?&//=]*)/
var invite = /(discord(\.gg|app\.com\/invite)\/([\w]{16}|([\w]+-?){2}))/
const slowmode = new Map();

var reply = require("../jsonStorage/reply.json");

const Discord = require("discord.js");


module.exports = async (client, message) => {
	
  if(message.channel.type === "dm" && message.author.id !== client.user.id) { //Message received by DM
	//Check that the DM was not send by the bot to prevent infinite looping
	if (!message.attachments.first()) {
		return client.conlog(`${message.author.tag} sent a Private Message to ShadeBot:` + chalk.white(`\nMessage: ${message.content}`))
	} else {
		return client.conlog(`${message.author.tag} sent a Private Message to ShadeBot` + chalk.white(`\nMessage: ${message.content} \nAttachment: ${message.attachments.first().url}`))
	}
  }

  else if(message.channel.type === "text") { //Message received on desired text channel
	client.addRoomDatabase(message)
	
	// Discord Invites
	if (invite.test(message.content) && client.channelperms.invitesAllowed.indexOf(message.channel.id) == -1 && !message.author.bot) {
		client.conlog(`${message.author.tag} sent a Discord link in ${message.channel.name}\n` + chalk.white(`Message: ${message.content}`)) // Logs
		message.delete();
		message.reply(`**Server rule: Please do not Advertise other Discords**\nDoing this may cause you to be banned.`) // Sends Message + mentions
		client.messageLog(message, `<@${message.author.id}> posted a Discord link in <#${message.channel.id}>\nMessage: ${message.content}`)
	}
	// Mention spammer - https://github.com/eslachance/nms2/blob/master/events/message.js
	else if(client.config.features.mentionSpammer && !message.author.bot && (message.mentions.users.size > 1 || message.mentions.roles.size > 1)) {
		if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return console.log(chalk.red("Cannot mute user"))
		message.guild.members.fetch(message.author)
		.then(member => {
			if (!member.hasPermission("MANAGE_MESSAGES")) {
				if (!message.mentions.users.size == 1 || !message.mentions.users.first().bot) {
					let entry = slowmode.get(message.author.id);
					if (!entry && entry != 0) {
						entry = 0;
						slowmode.set(message.author.id, entry);
					}
					entry += message.mentions.users.size + message.mentions.roles.size;
					slowmode.set(message.author.id, entry);

					if (entry > (client.config.mentionSpammer.maxMention -1)) {
						message.member.addRole(client.config.roles.mute)
						message.channel.send(`:no_entry_sign: User ${message.author.username} has just been auto-muted for mentionning too many users/roles.\nUsers that have been mentioned, we apologize for the annoyance. Please don't be mad!`);
						client.conlog(`Auto-muted ${message.author.username} [${message.author.id}] from ${message.guild.name} for mentioning too many users (${entry}).`);
						client.messageLog(message, `Auto-muted <@${message.author.id}> for mentioning too many users/roles (${entry}).`, '216661960253636608')
					}
					setTimeout(() => {
						entry -= message.mentions.users.size + message.mentions.roles.size;
						slowmode.set(message.author.id, entry);
						if (entry <= 0) slowmode.delete(message.author.id);
					}, client.config.mentionSpammer.rate);
	}}})}
	// Checks for Links
	else if (chillLink.test(message.content) && client.channelperms.linksAllowed.indexOf(message.channel.id) == -1) {
		
		if (!client.channelperms.imageLinkAllowed.indexOf(message.channel.id) != -1 && !message.content.startsWith(client.config.prefix + "image")) {
			client.conlog(`${message.author.tag} sent a link in #${message.channel.name}`) // Logs
			message.delete();
			message.reply(`**Channel rule: No links in this room.**\nDoing this may cause you to be Muted/Kicked/Banned`) // Sends Message + mentions
		
			let linkEmbed = new Discord.MessageEmbed()
				.setTitle(message.author.tag + " posted link in " + message.channel.name, message.author.displayAvatarURL())
				.setDescription("Message: " + message.content)
				.setColor("#212121")
			client.messageLog(message, {embed: linkEmbed})
		}
	}
	// User Rank room, Welcoming and General Messages
	else if (client.config.features.welcome && message.channel.id === client.config.welcome.passwordRoomId) { 
		message.delete()
		if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return console.log(chalk.red("Cannot add Roles for Welcoming Users, I need Manage Roles!"));
		
		if (message.content.toLowerCase() === client.config.welcome.password.toLowerCase() || message.content.toLowerCase() === `${client.config.welcome.password.toLowerCase()}.`) {
			message.guild.members.fetch(message.author)
				.then(member => {
					if (member.roles.some(r=>client.config.staffRoles.includes(r.id))) {
						return message.author.send("Sorry but staff cannot welcome themselves!")
					}
					welcomeMessage = client.config.welcome.message
					if (welcomeMessage.indexOf("%MENTION%") != -1) welcomeMessage = welcomeMessage.replace("%MENTION%", `<@${message.author.id}>`)
					if (welcomeMessage.indexOf("%USERNAME%") != -1) welcomeMessage = welcomeMessage.replace("%USERNAME%", message.author.username)
					if (welcomeMessage.indexOf("%GUILD%") != -1) welcomeMessage = welcomeMessage.replace("%GUILD%", message.guild.name)
					if (welcomeMessage.indexOf("%EXTRAMSG%") != -1) welcomeMessage = welcomeMessage.replace("%EXTRAMSG%", client.gameswelcome.welcome[Math.floor(Math.random() * client.gameswelcome.welcome.length)])
					
					if (message.author.displayAvatarURL().startsWith('https://cdn.discordapp.com/avatars/')) {
						client.conlog(message.author.tag + " Has joined the server");
						member.addRole(`${client.config.welcome.defaultRoleId}`).catch(console.error);

						if (welcomeMessage.indexOf("%WELCOMENUM%") != -1) welcomeMessage = welcomeMessage.replace("%WELCOMENUM%", client.storage[1].welcomeNum + 1)
						
						if (client.welcomeOption == 0) {
							const welChannel = message.guild.channels.find('id', client.config.welcome.welcomeRoomId);
							client.storage[1].welcomeNum++;
							client.saveFile("s");
							
							welChannel.send(welcomeMessage)
								.then(function (message) { message.react("🎉") })
								.catch(function () { console.log(chalk.redBright("Failed to Add Emojis to Welcoming message")) });
						} else if (client.welcomeOption == 1)
							message.author.send(welcomeMessage)
						
						if (client.config.log.welcomed) {
							let welcomeEmbed = new Discord.MessageEmbed()
								.setDescription(`:tada: **${message.author.tag}** has been \`\`welcomed\`\` to the server. (${message.author.id})`)
								.setColor("#0D47A1")
								.setFooter(`User Welcomed (${client.storage[1].welcomeNum} today)`, message.author.displayAvatarURL())
								.setTimestamp(new Date())
							client.messageLog(message, {embed: welcomeEmbed})
						}
					}  else if (message.author.displayAvatarURL().startsWith('https://discordapp.com/assets/')) { // Checks if it's a Default Discord picutre
						client.conlog(message.author.tag + " | No Avatar"); // Logs
						message.author.send(`Please read the <#${client.config.welcome.passwordRoomId}> room again`); // PMs them what to do.
					
					} else {
						client.conlog(message.author.tag + " | No Avatar / With Avatar"); // Error check?
					}
			});
		} else {
			if (message.author == client.user) return;
			
			message.author.send(`Please Read the <#${client.config.welcome.passwordRoomId}> room again`);
			if (client.config.log.welcomedOther) {
				let welOtherEmbed = new Discord.MessageEmbed()
					.setDescription(`:face_palm: **${message.author.tag} typed a random message in <#${client.config.welcome.passwordRoomId}>**\nMessage: ${message.content}`)
					.setColor("#FAFAFA")
					.setFooter(`Failed Welcome`, message.author.displayAvatarURL())
					.setTimestamp(new Date())
				client.messageLog(message, {embed: welOtherEmbed})
			}
			if (!message.attachments.first()) {
				return client.conlog(`${message.author.tag} sent a random message in user rank room` + chalk.white(`\nMessage: ${message.content}`))
			} else {
				return client.conlog(`${message.author.tag} sent a random message in user rank room` + chalk.white(`\nMessage: ${message.content} \nAttachment: ${message.attachments.first().url}`))
			}
			
		}
	}
	// Role Room
	else if (message.channel.id == client.config.roles.room) {
		if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return console.log(chalk.red("Cannot add roles for self-assignable roles, I need Manage Roles!"));
		
		let clean = message.content.toLowerCase().replace(/[#,\/]/g ,'');

		let cleanSplit = clean.split(' ')
		var completeRoles= "";
		
		if (message.content.toLowerCase().includes("remove")) {
			
			for (i = 0; i < cleanSplit.length; i++) {
				if(client.roles[cleanSplit[i]]) {
					message.member.removeRole(client.roles[cleanSplit[i]]).catch(console.error);
					let roleName = message.guild.roles.find('id', client.roles[cleanSplit[i]]);
					completeRoles +=  roleName.name + ", "
				}
			}
			if (completeRoles == "") { message.author.send("ERROR: Didn't recognise any available roles within message.\nThe bot can recognise some shortened version of the games, such as ``cs go``, but for best experience, please use the full name of the game.")
			} else {
				message.author.send("Successfully removed the following Roles:\n" + completeRoles)
				client.conlog(message.author.tag + " removed roles:")
				client.conlog(chalk.white(completeRoles));
			}
		}
		else {
			for (i = 0; i < cleanSplit.length; i++) {
				if(client.roles[cleanSplit[i]]) {
					let roleName = message.guild.roles.find('id', client.roles[cleanSplit[i]]);
					if (client.banRole(message.author.id, client.roles[cleanSplit[i]])) {
						message.author.send("Sorry but you are banned from being given the role " + roleName.name)
					} else {
						if(!client.rolesCheck[client.roles[cleanSplit[i]]]) {
							message.member.addRole(client.roles[cleanSplit[i]]).catch(console.error);
							completeRoles += roleName.name + ", "
						} else {
							let roleCheck = message.guild.roles.find('name', client.rolesCheck[client.roles[cleanSplit[i]]]);
							if (message.member.roles.has(roleCheck.id)) {
								message.member.addRole(client.roles[cleanSplit[i]]).catch(console.error);
								completeRoles += roleName.name + ", "
							} else {
								message.author.send(`Sorry, but you need to be ${roleCheck.name} to be able to get ${roleName.name} Role!`)
							}
						}
			}}}
				if (completeRoles == "") { message.author.send("ERROR: Didn't recognise any available roles within message.\nThe bot can recognise some shortened version of the games, such as ``cs go``, but for best experience, please use the full name of the game.")
				} else {
					message.author.send("Successfully added the following Roles:\n" + completeRoles);
					client.conlog(message.author.tag + " added roles:");
					client.conlog(chalk.white(completeRoles));
				}
		}
			setTimeout(() => message.delete(), 500)
	}

  	else if (message.content.toLowerCase().indexOf("ily shadebot") != -1 && message.author.id == "183931930935427073") {
		message.channel.send("💬 Love you toooo! <:AliMercyHeart2:326076862503845890> <:AliMercyHeart:306055342490517506>")

  	} else if (client.messageTaken == true && client.channelperms.replyMessagesAllowed.indexOf(message.channel.id) != -1) {
		reply.forEach(function(i) {
			if (message.content.toLowerCase().indexOf(i.trigger) != -1 && client.messageTaken == true) {
				if (i.users.indexOf(message.author.id) != -1) {
					if (i.true) message.channel.send(i.true);
				} else {
					if (i.false) message.channel.send(i.false);
				}
				client.messageTaken = false;
	   	}});
	}
  }

  // Prefix check (Will need to remove for reply messages)
  if(message.content.indexOf(client.config.prefix) !== 0) return;
  const args = message.content.split(/ +/g);
  const command = args.shift().slice(client.config.prefix.length).toLowerCase();

  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (cmd) {
   	message.flags = [];
   	while(args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
	}
	if (cmd.conf.enabled) {
		cmd.run(client, message, args);
	} else {
		message.reply("This command is currently disabled");
	}
  }
}