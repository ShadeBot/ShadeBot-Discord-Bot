const Discord = require('discord.js');
const fs = require("fs");
const os = require('os');
const chalk = require('chalk'); //https://www.npmjs.com/package/chalk#styles
const request = require('request');

const client = new Discord.Client({autoReconnect: true});

const config = require('./configbot.json');
var channels = JSON.parse(fs.readFileSync("./jsonStorage/channels.json", "utf8"));
var storage = JSON.parse(fs.readFileSync("./jsonStorage/storage.json", "utf8"));
var roles = JSON.parse(fs.readFileSync("./jsonStorage/roles.json", "utf8"));
var rolesCheck = JSON.parse(fs.readFileSync("./jsonStorage/rolesCheck.json", "utf8"));
var rolesBan = JSON.parse(fs.readFileSync("./jsonStorage/rolesBan.json", "utf8"));
var gameswelcome = JSON.parse(fs.readFileSync("./jsonStorage/games-welcome.json", "utf8"));
var nsfw = JSON.parse(fs.readFileSync("./jsonStorage/nsfw.json", "utf8"));
var reply = JSON.parse(fs.readFileSync("./jsonStorage/reply.json", "utf8"));

const update = "ShadeBot: 2.0.2 (Rework Update)"
const dm_text = `Hey there! I'm ShadeBot, sadly I won't be able to help you with anything in PM! However do \`${config.prefix}help\`in a public channel that I can see, and I'll give you my help.`;
var messageTaken = true                         // Crappy Anti spam of messages
var welcomeOption = 0
var disableRoleRoom = false
const slowmode = new Map();
// var roomReset = new Date()     var messageIDReset = "null"

///////////////////////////////////////////////////////////////////////////////////////////////////

var chillLink = /(http(s)?):\/\/[?a-zA-Z0-9:%._\-\+~#=]{2,256}[^..]\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+\-.~#?&//=]*)/
var invite = /(discord(\.gg|app\.com\/invite)\/([\w]{16}|([\w]+-?){2}))/
var imageTest = /(http(s)?):[\/\/?a-zA-Z0-9:%._\-\+~#=]{2,256}[^..]\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+\-.~#?&//=]*\.(png|jpg|jpeg|gif))/
var steamImage = /(http(s)?:\/\/steamuserimages-a.akamaihd.net\/ugc\/)([0-9]{18})\/([0-9A-Z]{40})/
var osuImage = /(http(s)?):\/\/osu.ppy.sh\/ss\/[0-9]{7,8}/
var gyazoImage = /(http(s)?:\/\/)(gyazo.com\/)([0-9a-z]{32})/
var imgurImage = /(http(s)?:\/\/)(imgur.com)\/([a-zA-z]{7})/

///////////////////////////////////////////////////////////////////////////////////////////////////


var commands = [
	
	{ // image		Legendary + Image Link
        command: "image",
        description: "Allows specific users to post images from a link.",
        parameters: ["url to image"],
        execute: function (message, params) {
			let imageRole = message.guild.roles.find('id', config.image.role);
			if (!imageRole) return;
			
			message.delete();
			if (message.member.roles.has(imageRole.id)) {
				let link = params[1]
				let extMessage = message.content.split(/\s+/g).slice(2).join(" ");
				if (!link) return message.author.send("Please provide a valid link!");

				if (gyazoImage.test(link) || imgurImage.test(link)) {
					let linkSplit = link.split('/');
					link = `https://i.${linkSplit[2]}/${linkSplit[3]}.png`
				} else if (!imageTest.test(link) && !osuImage.test(link) && !steamImage.test(link)) {
					return message.author.send("Usage: ``" + config.prefix + "image (url)``\n - Links **must** be starting with ``http(s)://``\n - Links *should* end in `.png` `.jpg` `.jpeg` or `.gif`\n - Alternatively the command supports links from osu!, Steam and Gyazo (Static) that do not have these file endings!");
				}
				let linkEmbed = new Discord.RichEmbed()
					.setImage(link)
					.setColor(config.image.embedColor)
					.setFooter("Image sent by, " + message.author.tag + " (" + message.author.id + ")", message.author.displayAvatarURL);
				if (extMessage) linkEmbed.setDescription(extMessage)
				message.channel.send({ embed: linkEmbed });
			}  else {
				message.author.send(`You need to be ${imageRole.name} to use this command!`);
        	}
		}
    },

	{ // daily		Bot Commands
		command: "daily",
		description: "Allows a user to claim their free daily 100 Shadebucks every 24 hours.",
		parameters: [],
		execute: function(message, params) {
			if (channels.botCommandsAllowed.indexOf(message.channel.id) == -1) return;
			addToDatabase(message.author.id);
			let userData = storage[message.author.id];	// user's data			
			let currentDate = new Date()
			let resetDate = new Date(userData.reset)
			
			if (resetDate < currentDate) {	// checks if cooldown is over.
				dailyAmount = 100
				addMoney(dailyAmount, userData);
				let dailyEmbed = new Discord.RichEmbed()
					.setDescription(`💵 Sucessfully added \`${dailyAmount}\` ShadeBucks to your account!`)
                    .setColor("#f58390")
                    .setFooter(message.author.tag, message.author.displayAvatarURL)
				message.channel.send({ embed: dailyEmbed })
				let resetDate = addDays(currentDate, 1);
                userData.reset = resetDate;
				fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => { if (err) console.error(err) });
			
			// Before cooldown
			} else {
				let timeLeft = new Date(resetDate - currentDate);
                message.channel.send(`<@${message.author.id}>, Sorry but you still need to wait: **${timeLeft.getHours() }** hour(*s*), and **${timeLeft.getMinutes() }** minute(*s*)`)
			}
		}
	},
	
	{ // bal		Bot Commands
		command: "bal",
		description: "Allows a user to check their own or another user's Shadebucks balance.",
		parameters: [],
		execute: function(message, params) {
			if (channels.botCommandsAllowed.indexOf(message.channel.id) == -1) return;
			// Might Crash on mentioning an external user
			let mentionedUser = message.mentions.users.first();
			if (!mentionedUser) { 
				var balID = message.author.id
				var balTag = message.author.tag
				var balPFP = message.author.displayAvatarURL
			} else {
				var balID = mentionedUser.id
				var balTag = mentionedUser.tag
				var balPFP = mentionedUser.displayAvatarURL
			}
			addToDatabase(balID);
			let userData = storage[balID];
			
			let balEmbed = new Discord.RichEmbed()
                .setDescription(`💰 You currently have ${userData.money} ShadeBucks\n*You have had a total of ${userData.total} ShadeBucks in your account*`)
                .setColor("#4CAF50")
                .setFooter(balTag, balPFP);
			message.channel.send({ embed: balEmbed })
		}
	},
	
	{ // send		Bot Commands
		command: "send",
		description: "Allows a user to send Shadebucks to another user (a fee of 10% is applied on the Shadebucks sent)",
		parameters: ["user", "sum of money"],
		execute: function(message, params) {
			if (channels.botCommandsAllowed.indexOf(message.channel.id) == -1) return;
			let mentionedUser = message.mentions.users.first();
			let numMoney = parseInt(params[2]);
			addToDatabase(message.author.id);
			let userDataS = storage[message.author.id]
			
			if (!numMoney)
				return message.reply("At the moment I can only send money by doing a mention of the user. ``" + config.prefix + "send @USER 100``")
					.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
					.catch(console.log("Error in deleting message"));
			else if (!mentionedUser)
				return message.reply("At the moment I can only send money by doing a mention of the user. ``" + config.prefix + "send @USER 100``")
					.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
					.catch(function () { messagefail});
			else if (userDataS.money < numMoney)
				return message.reply("Sorry. You don't have enough money in your account to give!")
				.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
				.catch(function () { messagefail});
			
			loseMoney(numMoney, userDataS)
			let send1Embed = new Discord.RichEmbed()
                .setDescription(`💵 Removed \`${numMoney}\` ShadeBucks to your account!`)
                .setColor("#9a1d18")
                .setFooter(message.author.tag, message.author.displayAvatarURL);
			message.channel.send({ embed: send1Embed })
			
			let userDataR = storage[mentionedUser.id];
			addMoney(parseInt(numMoney * 0.9), userDataR);
			
			let send2Embed = new Discord.RichEmbed()
                .setDescription(`💵 Sucessfully added \`${parseInt(numMoney * 0.9)}\` ShadeBucks to your account!\n*10% Tax has been removed from the money*`)
                .setColor("#FAA61A")
                .setFooter(mentionedUser.tag, mentionedUser.displayAvatarURL);
			message.channel.send({ embed: send2Embed })
			
			fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => { if (err) console.error(err) });
		}
	},
	
	{ // roulette	Bot Commands
		command: "roulette",
		description: "Allows you to spend your Shadebucks on a game of Roulette.",
		parameters: ["black/red/green", "sum of money"],
		execute: function(message, params) {
			if (channels.botCommandsAllowed.indexOf(message.channel.id) == -1) return;
			let colour = params[1];
			let money = parseInt(params[2]);
			
			addToDatabase(message.author.id);
			let userData = storage[message.author.id];
			
			if (!money) return message.author.send("Usage ``" + config.prefix + "roulette (black, red, green) (amount)``\nPick any of the colours you want... but some are more likely than others...\n**Black is for Even numbers**... **and Red is for odd**... both of these will provide you with **1.5x your original amount**.\nTake a risk and pick **Green** and you can get **14x the amount of money**... however it's one in 37."); //help
			if (money > 500) money = 500;
			if (money > userData.money) return message.channel.send("Sorry, you are betting more than you have!");
			
			if (colour == "b" || colour.includes("black")) colour = 0;
			else if (colour == "r" || colour.includes("red")) colour = 1;
			else if (colour == "g" || colour.includes("green")) colour = 2;
			else return message.channel.send("You can only bet on Black (1.5x), Red (1.5x), or Green (14x).");
			
			let random = Math.floor(Math.random() * 37);
			
			if (random == 0 && colour == 2) { // Green
				money *= 14
				addMoney(money, userData)
				message.channel.send(`💚 **JACKPOT** You won ${money} ShadeBucks 💚 | The Number was ${random}`)
				console.log(`${message.author.tag} Won the jackpot`)
			} else if (isOdd(random) && colour == 1) { // Red
				money = parseInt(money * 1.5)
				addMoney(money, userData)
				message.channel.send(`🔴 You won ${money} ShadeBucks 🔴 | The Number was ${random}`)
			} else if (!isOdd(random) && colour == 0) { // Black
				money = parseInt(money * 1.5)
				addMoney(money, userData)
				message.channel.send(`⚫ You won ${money} ShadeBucks ⚫ | The Number was ${random}`)
			} else { // Wrong
				loseMoney(money, userData)
				message.channel.send(`You sadly lost ${money} ShadeBucks | The Number was ${random}`)
			}
			
			fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => { if (err) console.error(err) });
		}
	},

    { // osu		Videogames
        command: "osu",
        description: "Allows a user to see information about their osu account.",
        parameters: ["username"],
        execute: function (message, params) {
			if (!config.features.osu || config.osu.channels.indexOf(message.channel.id) == -1) return;
			
			let account = params[1]
			let mode = params[2]
			
			if (!mode) { mode = 0 } // Default Game
			else if (mode.indexOf("o") == 0) { mode = 0 }
			else if (mode.indexOf("t") == 0) { mode = 1 }
			else if (mode.indexOf("c") == 0) { mode = 2	}
			else if (mode.indexOf("m") == 0) { mode = 3	}
			else { mode = 0 }
			
			request(`https://osu.ppy.sh/api/get_user?k=${config.osu.key}&u=${account}&m=${mode}`, (error, response, body) => {
				var json = JSON.parse(body);
			
				if(json.length == 0) { message.reply("No User found.") }
				else {
					let osu = json[0]
					let osuEmbed = new Discord.RichEmbed()
						.setColor(`#FF66AA`)
						.setTitle(`${osu.username}`)
						.setURL(`https://osu.ppy.sh/u/${osu.user_id}`)
						.addField(`PP `, Math.ceil(osu.pp_raw), true)
						.addField(`Rank`,`#${osu.pp_rank} (${osu.country}: #${osu.pp_country_rank})`, true)
						.addField(`Play Count`, osu.playcount, true)
						.addField(`Accuracy`, `${parseFloat(osu.accuracy).toFixed(2)}%`, true)
						.addField(`Level`, parseFloat(osu.level).toFixed(2), true)
						.addField(`Ranks`, `SS: ${osu.count_rank_ss} | S: ${osu.count_rank_s} | A: ${osu.count_rank_a}`, true)
						/*.addField(`Top Play`, topPlay, false) */
						.setThumbnail(`https://a.ppy.sh/${osu.user_id}`)
					message.channel.send({ embed: osuEmbed })
				}
			});
        }
    },

	{ // roles 		Mod+ / Owner
		command: "roles",
		description: "Add a new Self-Assignable role or Ban/Unban a user from getting a Self-Assignable role",
		parameters: ["add | ban/unban", "trigger | @user", "role id | role name"],
		execute: function(message, params) {
			if (params[1] == "add" && config.ownerId.indexOf(message.author.id) != -1) {
				let roleId = parseInt(params[3])
				if (!roleId) return message.channel.send("Seems like you haven't provided me with a valid Role ID");
				// roles add trigger id
				if (!roles[params[2]]) message.channel.send(`Adding new role with Trigger: "${params[2]}" RoleID: "${params[3]}"`);
				else message.channel.send("Replacing current role id for trigger.");
				
				roles[params[2]] = params[3]
				fs.writeFile("./jsonStorage/roles.json", JSON.stringify(roles), (err) => { if (err) console.error(err) });
			}
			
			else if (params[1] == "ban" && message.member.roles.some(r=>config.staffRoles.includes(r.id))) {
				let mentionedUser = message.mentions.users.first();
				if (!mentionedUser) return message.reply("Currently I can only find people by mentioning them. `" + config.prefix + "roles ban @MENTION role`")
					.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
					.catch(function () { messagefail});
				addRoleBan(mentionedUser.id)
				
				var banRoleId
				for (i = 3; i < params.length; i++) {
					if(roles[params[i].toLowerCase()])
						banRoleId = roles[params[i].toLowerCase()]
				}
				
				if (banRoleId) {
					let roleName = message.guild.roles.find('id', banRoleId);
					if (rolesBan[mentionedUser.id].indexOf(banRoleId) != -1) return message.reply("User is already banned from" + roleName.name)
					
					rolesBan[mentionedUser.id].push(`${banRoleId}`)
					message.reply(`Successfully banned <@${mentionedUser.id}> from adding the role ${roleName.name}`);
					fs.writeFile("./jsonStorage/rolesBan.json", JSON.stringify(rolesBan), (err) => { if (err) console.error(err) });
				} else {
					message.channel.send("Sorry but I could not find a role the role you are looking for!")
						.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
						.catch(function () { messagefail});
				}
			}
			
			else if (params[1] == "unban" && message.member.roles.some(r=>config.staffRoles.includes(r.id))) {
				let mentionedUser = message.mentions.users.first();
				if (!mentionedUser) return message.reply("Currently I can only find people by mentioning them. `" + config.prefix + "roles ban @MENTION role`")
					.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
					.catch(function () { messagefail});
				addRoleBan(mentionedUser.id)
				
				var banRoleId
				for (i = 3; i < params.length; i++) {
					if(roles[params[i].toLowerCase()])
						banRoleId = roles[params[i].toLowerCase()]
				}
				
				if (banRoleId) {
					let roleName = message.guild.roles.find('id', banRoleId);
					if (rolesBan[mentionedUser.id].indexOf(banRoleId) == -1) return message.reply("User isn't banned from " + roleName.name)
					
					rolesBan[mentionedUser.id].splice(rolesBan[mentionedUser.id].indexOf(banRoleId), 1);
					message.reply(`Successfully unbanned <@${mentionedUser.id}> from adding the role ${roleName.name}`);
					fs.writeFile("./jsonStorage/rolesBan.json", JSON.stringify(rolesBan), (err) => { if (err) console.error(err) });
				} else {
					message.channel.send("Sorry but I could not find a role the role you are looking for!")
						.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
						.catch(function () { messagefail});
				}
			}
			
			else {
				message.reply("Seems like one of the Arguments was wrong or you don't have permission to do this command!")
			}
		}
	},
	
	{ // settings	Mod+ / Owner
		command: "settings",
		description: "Allows a Mod/Owner to view/change Shadebot's permissions for a specific room",
		parameters: ["view | edit"],
		execute: function(message, params) {
			if (params[1] == "edit" && config.ownerId.indexOf(message.author.id) != -1) {
				let mentionedChannel = message.mentions.channels.first()
				if (mentionedChannel == null) { var id = message.channel.id	}
				else { var id = mentionedChannel.id }
				
				if (message.content.toLowerCase().indexOf("true") != -1) {
					if (message.content.toLowerCase().indexOf("invite") != -1) {
						if (channels.invitesAllowed.indexOf(id) != -1) message.reply("Invites are already allowed in here")
						else { channels.invitesAllowed.push(id); message.reply("Invites are now allowed in here")}
					} else if (message.content.toLowerCase().indexOf("image") != -1) {
						if (channels.imageLinkAllowed.indexOf(id) != -1) message.reply("Image links are already allowed in here")
						else { channels.imageLinkAllowed.push(id); message.reply("Image Links are are now allowed in here")}
					} else if (message.content.toLowerCase().indexOf("command") != -1) {
						if (channels.botCommandsAllowed.indexOf(id) != -1) message.reply("Bot commands are already allowed in here")
						else { channels.botCommandsAllowed.push(id); message.reply("Bot commands are are now allowed in here")}
					} else if (message.content.toLowerCase().indexOf("reply") != -1) {
						if (channels.replyMessagesAllowed.indexOf(id) != -1) message.reply("Reply message are already allowed in here")
						else { channels.replyMessagesAllowed.push(id); message.reply("Reply message are are now allowed in here")}
					} else if (message.content.toLowerCase().indexOf("link") != -1) {
						if (channels.linksAllowed.indexOf(id) != -1) message.reply("Links are already allowed in here")
						else { channels.linksAllowed.push(id); message.reply("Links are are now allowed in here")}
					}
				} else if (message.content.toLowerCase().indexOf("false") != -1) {
					if (message.content.toLowerCase().indexOf("invite") != -1) {
						if (channels.invitesAllowed.indexOf(id) == -1) message.reply("Invites are already disabled in here")
						else { channels.invitesAllowed.splice(channels.invitesAllowed.indexOf(id), 1); message.reply("Invites are now disabled in here")}
					} else if (message.content.toLowerCase().indexOf("image") != -1) {
						if (channels.imageLinkAllowed.indexOf(id) == -1) message.reply("Image links are already disabled in here")
						else { channels.imageLinkAllowed.splice(channels.imageLinkAllowed.indexOf(id), 1); message.reply("Image Links are now disabled in here")}
					} else if (message.content.toLowerCase().indexOf("command") != -1) {
						if (channels.botCommandsAllowed.indexOf(id) == -1) message.reply("Bot commands are already allowed in here")
						else { channels.botCommandsAllowed.splice(channels.botCommandsAllowed.indexOf(id), 1); message.reply("Bot commands are now allowed in here")}
					} else if (message.content.toLowerCase().indexOf("reply") != -1) {
						if (channels.replyMessagesAllowed.indexOf(id) == -1) message.reply("Reply message are already disabled in here")
						else { channels.replyMessagesAllowed.splice(channels.replyMessagesAllowed.indexOf(id), 1); message.reply("Reply message are now disabled in here")}
					} else if (message.content.toLowerCase().indexOf("link") != -1) {
						if (channels.linksAllowed.indexOf(id) == -1) message.reply("Links are already disabled in here")
						else { channels.linksAllowed.splice(channels.linksAllowed.indexOf(id), 1); message.reply("Links are now disabled in here")}
					}
				}
				fs.writeFile("./jsonStorage/channels.json", JSON.stringify(channels), (err) => { if (err) console.error(err) });
				
			}
			
			else if (params[1] == "view" && message.member.roles.some(r=>config.staffRoles.includes(r.id))) {
				let mentionedChannel = message.mentions.channels.first()
				if (mentionedChannel == null) { var chanid = message.channel.id	}
				else { var chanid = mentionedChannel.id }
				
				var mess = `Permissions for channel <#${chanid}>:`;
				for (var key in channels) {
					if (channels.hasOwnProperty(key)) {
						if (channels[key].indexOf(chanid) != -1) mess += `\n${key}: true`
						else mess += `\n${key}: false`
					}
				}
				message.channel.send(mess)
			}
		}
	},

	/*{ // help - Probably will crash due to limit in embed size
		command: "help", // Probably will crash due to limit in embed size
		description: "Displays this message, duh!",
		parameters: [],
		execute: function(message, params) {
			var response = "";
			var commandEmbed = new Discord.RichEmbed()
				.setTitle("Available commands:")
				.setColor("#546E7A")
				
			for(var i = 0; i < commands.length; i++) {
				var c = commands[i];
				response = "#" + c.command;
				
				for(var j = 0; j < c.parameters.length; j++) {
					response += " <" + c.parameters[j] + ">";
				}
				
				commandEmbed.addField(response + ": ", c.description);
			}
			message.reply({ embed: commandEmbed });
		}
	},*/

	{ // clear		Owner
		command: "clear",
		description: "Allows a owner to bulk delete messages in a room. The number can be set anywhere from 2 to 100.",
		parameters: ["messages to delete"],
		execute: function(message, params) {
			if (config.ownerId.indexOf(message.author.id) == -1) return message.reply("Sorry you do not have permission to do this!")
			
			let deleteCount = parseInt(params[1], 10)
			if(!deleteCount || deleteCount < 2 || deleteCount > 100) return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
			if(!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) return message.channel.send("Error, i do not have manage message permissions");
			
			message.channel.bulkDelete(deleteCount).catch(console.error)
			.then(function () {
				message.channel.send(`:wastebasket: Removed ${deleteCount} messages`)
					.then(function (message) { setTimeout(() => message.delete(), 2000)})
					.catch(function () { messagefail})
			})
			
		}
	},

	{ // welcomeNum	Owner
		command: "welcomenum",
		description: "Allows a owner to change the current number displayed on the welcoming counter.",
		parameters: ["welcome count"],
		execute: function(message, params) {
			if (config.ownerId.indexOf(message.author.id) == -1) return message.reply("Sorry you do not have permission to do this!")
				
			let count = parseInt(params[1])
			if (!count) return message.channel.send("Please provide a number for the Welcome Count!")
			storage[1].welcomeNum = count
			message.reply("Sucessfully changed the Welcome Counter to " + storage[1].welcomeNum)
			
			message.delete()
			fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => { if (err) console.error(err) });
		}
	},
	
	{ // welcome	Mod+
        command: "welcome",
        description: "Allows a moderator to toggle welcome messages to a Direct Message instead.",
        parameters: [],
        execute: function (message, params) {
			if(!message.member.roles.some(r=>config.staffRoles.includes(r.id)) ) return message.reply("Sorry, you don't have permissions to use this!")
				.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
				.catch(function () { messagefail});
			
			if (welcomeOption == 0) {
				welcomeOption = 1
				message.channel.send("Changing to welcoming in Private Messages!")
			} else if (welcomeOption == 1) {
				welcomeOption = 0
				message.channel.send("Changing to welcoming in Default Room!")
			}
		}
    },

	{ // botinfo	Owner
		command: "botinfo",
		description: "Shows information about the bot.",
		parameters: [],
		execute: function(message, params) {
			if (config.ownerId.indexOf(message.author.id) == -1) return message.reply("Sorry you do not have permission to do this!")
				
			let systemUptime = format(os.uptime())
			let processUptime = format(process.uptime())
			
			const embed = new Discord.RichEmbed()
				.setColor(`#0D47A1`)
				.setTitle(update)
				.setURL('https://github.com/ShadeBot/ShadeBot-Discord-Bot')
				.addField('Guilds', client.guilds.size, true)
				.addField('Channels', client.channels.size, true)
				.addField('Members', client.users.size, true)
				.addField('Ping', `${client.ping.toFixed(0)} ms`, true)
				.addField('Users in Database', storage[1].users, true)
				.addField('RAM Usage', `${(process.memoryUsage().rss / 1048576).toFixed()}MB/${(os.totalmem() > 1073741824 ? `${(os.totalmem() / 1073741824).toFixed(1)} GB` : `${(os.totalmem() / 1048576).toFixed()} MB`)} (${(process.memoryUsage().rss / os.totalmem() * 100).toFixed(2)}%)`, true)
				.addField('System Time', getTime(), true)
				.addField('System Uptime', `${systemUptime}`, true)
				.addField('Process Uptime', `${processUptime}`, true)
				.setFooter('Created by Alipoodle#5025', 'https://alipoodle.me/small.gif');

			message.channel.send({ embed });
		}
	},
  
	{ // mute		Mod+
		command: "mute",
		description: "Allows a moderator to mute a specific user (by preventing the user from using chat or voice)",
		parameters: ["user"],
		execute: function(message, params) {
			if(!config.features.mute) return
			if(!message.member.roles.some(r=>config.staffRoles.includes(r.id))) return message.reply("Sorry you do not have permission to do this!")
			
			let mentionedUser = message.mentions.users.first();
			let muteUser = message.guild.member(mentionedUser);
			let time = params[2];
			let amount = parseInt(time);
			if (!muteUser) return message.reply("At the moment I can only mute people by doing a mention of the user. ``" + config.prefix + "mute @USER (amount of time)``");
			
			if (!time) {
				muteUser.addRole(`${config.roles.mute}`).catch(console.error);
				message.channel.send("Successfully added Mute to: " + muteUser.user.tag)
				messageLog(message, `Successfully added Mute to: <@${muteUser.user.id}>\nPlease provide reason for mute:`, "216661960253636608")
			}
			else {	// May Crash on the new Date().get / set
				time = time.toLowerCase()
				var timeMode = "";
				if (time.indexOf('h') != -1) {
					resetTime = new Date(new Date().setHours(new Date().getHours() + amount))
					setTimeout(() => muteUser.removeRole(`${config.roles.mute}`).catch(console.error), 3600000 * amount)
					timeMode = "Hour(s)"
				} else if (time.indexOf('m') != -1) {
					resetTime = new Date(new Date().setMinutes(new Date().getMinutes() + amount))
					setTimeout(() => muteUser.removeRole(`${config.roles.mute}`).catch(console.error), 60000 * amount)
					timeMode = "Minute(s)"
				} else {
					return message.reply("Sorry but i didn't understand the amount of time you wanted please do ``1hour`` or ``10m``")
				}
				muteUser.addRole(`${config.roles.mute}`).catch(console.error);
				message.channel.send("Successfully added Mute to: " + muteUser.user.tag)
				messageLog(message, `Successfully added Mute to: <@${muteUser.user.id}>\nMuted for: ${amount} ${timeMode} | UTC Time: ${resetTime.getHours()}:${resetTime.getMinutes()}\nPlease provide reason for mute:`, "216661960253636608")
				
			}
		}
	},

	{ // library	Mod+		Need to complete room
        command: "library",
        description: "Allows a moderator to save links to a library",
        parameters: ["add | room", "library name", "link or -n | room"],
        execute: function (message, params) {
			if (params[1] == "add" && message.member.roles.some(r=>config.staffRoles.includes(r.id))) {
				let library = params[2].toLowerCase()
				let image = params[3]
				
				if (!nsfw[library]) {
					if (image == "-n") {
						// Create new storage
						nsfw[library] = {"image":[], "room":["208311597284720640"]} 
						fs.writeFile("./jsonStorage/nsfw.json", JSON.stringify(nsfw), (err) => { if (err) console.error(err) });
						message.channel.send(`Successfully added library **${library}** to the database, you can now add links to this collection.`)
					} else
						message.channel.send("There is no storage for this library. Are you sure you have put it in correctly?\nIf you would like to create it please add **-n** after the name. `" + config.prefix + "library add (library) -n`")
							.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
							.catch(function () { messagefail});
				
				} else if (chillLink.test(image)) {
					if (nsfw[library].image.indexOf(image) == -1) {
						nsfw[library].image.push(image)
						message.channel.send(`Successfully added <${image}> to the library of ${library}`)
						fs.writeFile("./jsonStorage/nsfw.json", JSON.stringify(nsfw), (err) => { if (err) console.error(err) });
					} else
						message.channel.send("It seems that this link is already in this library! I don't want to have duplicates, so I won't add it!")
							.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
							.catch(function () { messagefail});
					
				} else
					message.channel.send("Error, it seems that the you haven't provided a link or the link is invalid somehow.\nIf you are trying to create a new Library, this one already exist otherwise try adding **http(s)://** to your link")
						.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
						.catch(function () { messagefail});
			}
			
			else if (params[1] == "room" && message.member.roles.some(r=>config.staffRoles.includes(r.id))) {
				let library = params[2].toLowerCase()
				let image = params[3]
				
				if (!nsfw[library]) {
					
				}
			} else {
				// Can't complete command / no perms
				// message.channel.send("")
			}
		}
    },
	
	{ // post		Channel specific
        command: "post",
        description: "Allows a user to post an image from a library.",
        parameters: ["library"],
        execute: function (message, params) {
			let library = params[1]
			let location = parseInt(params[2])
			
			if (nsfw[library]) {
				if (nsfw[library].room.indexOf(message.channel.id) == -1) return message.reply("Sorry this Library is not avalible in this room.")
				if (!location || location < 0 || nsfw[library].image.length < location) location = Math.floor(Math.random() * nsfw[library].image.length);
				
				message.channel.send(`${location}: ${nsfw[library].image[location]}`)
			} else
				message.channel.send("It seems you are trying to post from a library that doesn't exist!")
					.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
					.catch(function () { messagefail});
			
		}
    },
	
	{ // points		Event team / Event rooms
        command: "points",
        description: "Allows Users/Event team to view/give users points.",
        parameters: ["bal | add"],
        execute: function (message, params) {
			if (!message.guild.channels.some(r=>config.points.channels.includes(r.id))) return;
			if (params[1] == "add" && message.member.roles.some(r=>config.points.addRoles.includes(r.id))) {
				let mentionedUser = message.mentions.users.first();
				let numPoints = parseInt(params[3], 10)
				let reasonPoints = message.content.split(/\s+/g).slice(4).join(" ");
			
				if (!mentionedUser) 
					return message.reply("At the moment I can only add points to people by doing a mention of the user. ``#points add @USER (amount) (reason)``")
						.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
						.catch(function () { messagefail});
				if (!numPoints)
					return message.channel.send("Please provide a valid amount of points.")
						.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
						.catch(function () { messagefail});
				if (!reasonPoints) 
					return message.channel.send("Please provide a reason for adding of points...\n**DO NOT ADD POINTS RANDOMLY.** This may lead to being removed from the team, and stripped of all points")
						.then(function (message) { setTimeout(() => message.delete(), config.messageTimeout)})
						.catch(function () { messagefail});
				if (numPoints > 100 && message.author.id != config.ownerId)
					return message.channel.send("Sorry you seem to be trying to add more than 100 points. Only the Owner of the Bot can do this!") 
			
				addToDatabase(mentionedUser.id);
				let userData = storage[mentionedUser.id];
			
				userData.points += numPoints
				let pointsEmbed = new Discord.RichEmbed()
						.setDescription(`💡 Sucessfully added \`${numPoints}\` Points to ${mentionedUser.tag}'s account!`)
                    	.setColor("#99f610")
                    	.setFooter(message.author.tag, message.author.displayAvatarURL)
            	message.channel.send({ embed: pointsEmbed });
			
				messageLog(message, `<@${message.author.id}> has added ${numPoints} points to <@${mentionedUser.id}>'s Account\nReason: ${reasonPoints}`)
				fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => { if (err) console.error(err) });
			}

			else if (params[1] == "bal") {
				let balAccount = message.mentions.users.first();
				if (!balAccount) var balinfo = [message.author.id, message.author.tag, message.author.displayAvatarURL]
				else var balinfo = [balAccount.id, balAccount.tag, balAccount.displayAvatarURL]
				
				addToDatabase(balinfo[0]);
				let userData = storage[balinfo[0]];

				let balEmbed = new Discord.RichEmbed()
                	.setDescription(`💰 You currently have ${userData.points} points`)
                	.setColor("#004D40")
	                .setFooter(balinfo[1], balinfo[2]);
		        message.channel.send({ embed: balEmbed })
			}
		}
    },
	
	{ // DUMMY ONE FOR COPYING
        command: "dummy",
        description: "this is a dummy command",
        parameters: ["paramater 1"],
        execute: function (message, params) {
			// It does nothing
		}
    }
];

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

client.on("disconnect", event => {
	console.log("Disconnected: " + event.reason + " (" + event.code + ")");
});

client.on("message", message => {
	if(message.channel.type === "dm" && message.author.id !== client.user.id) { //Message received by DM
		//Check that the DM was not send by the bot to prevent infinite looping
		message.channel.send(dm_text);
		if (!message.attachments.first()) {
			return conlog(`${message.author.tag} sent a Private Message to ShadeBot:` + chalk.white(`\nMessage: ${message.content}`))
		} else {
			return conlog(`${message.author.tag} sent a Private Message to ShadeBot` + chalk.white(`\nMessage: ${message.content} \nAttachment: ${message.attachments.first().url}`))
		}
	}
	else if(message.channel.type === "text") { //Message received on desired text channel
		addRoomDatabase(message)
		
		// Discord Invites
		if (invite.test(message.content) && channels.invitesAllowed.indexOf(message.channel.id) == -1 && !message.author.bot) {
			conlog(`${message.author.tag} sent a Discord link in ${message.channel.name}\n` + chalk.white(`Message: ${message.content}`)) // Logs
			message.delete();
			message.reply(`**Server rule: Please do not Advertise other Discords**\nDoing this may cause you to be banned.`) // Sends Message + mentions
			messageLog(message, `<@${message.author.id}> posted a Discord link in <#${message.channel.id}>\nMessage: ${message.content}`)
		}
		// Mention spammer - https://github.com/eslachance/nms2/blob/master/events/message.js
		else if(config.features.mentionSpammer && !message.author.bot && (message.mentions.users.size > 1 || message.mentions.roles.size > 1)) {
			if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return console.log(chalk.red("Cannot mute user"))
			message.guild.fetchMember(message.author)
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

			            if (entry > (config.mentionSpammer.maxMention -1)) {
			                message.member.addRole(config.roles.mute)
			                message.channel.send(`:no_entry_sign: User ${message.author.username} has just been auto-muted for mentionning too many users/roles.\nUsers that have been mentioned, we apologize for the annoyance. Please don't be mad!`);
			                conlog(`Auto-muted ${message.author.username} [${message.author.id}] from ${message.guild.name} for mentioning too many users (${entry}).`);
							messageLog(message, `Auto-muted <@${message.author.id}> for mentioning too many users/roles (${entry}).`, '216661960253636608')
			            }
			            setTimeout(() => {
			                entry -= message.mentions.users.size + message.mentions.roles.size;
			                slowmode.set(message.author.id, entry);
			                if (entry <= 0) slowmode.delete(message.author.id);
			            }, config.mentionSpammer.rate);
		}}})}
		// Checks for Links
		else if (chillLink.test(message.content) && channels.linksAllowed.indexOf(message.channel.id) == -1) {
			
			if (!channels.imageLinkAllowed.indexOf(message.channel.id) != -1 && !message.content.startsWith(config.prefix + "image")) {
				conlog(`${message.author.tag} sent a link in #${message.channel.name}`) // Logs
				message.delete();
				message.channel.send(`<:ShadeBotProfile:326817503076679690> <#${message.channel.id}> rule: No links in this room. <@${message.author.id}>.\nDoing this may cause you to be Muted/Kicked/Banned`) // Sends Message + mentions
			
				let linkEmbed = new Discord.RichEmbed()
					.setTitle(message.author.tag + " posted link in " + message.channel.name, message.author.displayAvatarURL)
					.setDescription("Message: " + message.content)
					.setColor("#212121")
				messageLog(message, {embed: linkEmbed})
			}
		}
		// User Rank room, Welcoming and General Messages
		else if (config.features.welcome && message.channel.id === config.welcome.passwordRoomId) { 
			message.delete()
			if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return console.log(chalk.red("Cannot add Roles for Welcoming Users, I need Manage Roles!"));
			
			if (message.content.toLowerCase() === config.welcome.password.toLowerCase() || message.content.toLowerCase() === `${config.welcome.password.toLowerCase()}.`) {
				message.guild.fetchMember(message.author)
					.then(member => {
						if (member.roles.some(r=>config.staffRoles.includes(r.id))) {
							return message.author.send("Sorry but staff cannot welcome themselves!")
						}
						welcomeMessage = config.welcome.message
						if (welcomeMessage.indexOf("%MENTION%") != -1) welcomeMessage = welcomeMessage.replace("%MENTION%", `<@${message.author.id}>`)
						if (welcomeMessage.indexOf("%USERNAME%") != -1) welcomeMessage = welcomeMessage.replace("%USERNAME%", message.author.username)
						if (welcomeMessage.indexOf("%GUILD%") != -1) welcomeMessage = welcomeMessage.replace("%GUILD%", message.guild.name)
						if (welcomeMessage.indexOf("%EXTRAMSG%") != -1) welcomeMessage = welcomeMessage.replace("%EXTRAMSG%", gameswelcome.welcome[Math.floor(Math.random() * gameswelcome.welcome.length)])
						
						if (message.author.displayAvatarURL.startsWith('https://cdn.discordapp.com/avatars/')) {
							conlog(message.author.tag + " Has joined the server");
							member.addRole(`${config.welcome.defaultRoleId}`).catch(console.error);

							if (welcomeMessage.indexOf("%WELCOMENUM%") != -1) welcomeMessage = welcomeMessage.replace("%WELCOMENUM%", storage[1].welcomeNum + 1)
							
							if (welcomeOption == 0) {
								const welChannel = message.guild.channels.find('id', config.welcome.welcomeRoomId);
								storage[1].welcomeNum++;
								fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => { if (err) console.error(err) });
								
								welChannel.send(welcomeMessage)
									.then(function (message) { message.react("🎉") })
									.catch(function () { console.log(chalk.redBright("Failed to Add Emojis to Welcoming message")) });
							} else if (welcomeOption == 1)
								message.author.send(welcomeMessage)
							
							if (config.log.welcomed) {
								let welcomeEmbed = new Discord.RichEmbed()
									.setDescription(`:tada: **${message.author.tag}** has been \`\`welcomed\`\` to the server. (${message.author.id})`)
									.setColor("#0D47A1")
									.setFooter(`User Welcomed | ${storage[1].welcomeNum} user(s) welcomed today`, message.author.displayAvatarURL)
									.setTimestamp(new Date())
								messageLog(message, {embed: welcomeEmbed})
							}
						}  else if (message.author.displayAvatarURL.startsWith('https://discordapp.com/assets/')) { // Checks if it's a Default Discord picutre
							conlog(message.author.tag + " | No Avatar"); // Logs
							message.author.send(`Please read the <#${config.welcome.passwordRoomId}> room again`); // PMs them what to do.
						
						} else {
							conlog(message.author.tag + " | No Avatar / With Avatar"); // Error check?
						}
				});
			} else {
				if (message.author == client.user) return;
				
				message.author.send(`Please Read the <#${config.welcome.passwordRoomId}> room again`);
				if (config.log.welcomedOther) {
					let welOtherEmbed = new Discord.RichEmbed()
						.setDescription(`:face_palm: **${message.author.tag} typed a random message in <#${config.welcome.passwordRoomId}>**\nMessage: ${message.content}`)
						.setColor("#FAFAFA")
						.setFooter(`Failed Welcome`, message.author.displayAvatarURL)
						.setTimestamp(new Date())
					messageLog(message, {embed: welOtherEmbed})
				}
				if (!message.attachments.first()) {
					return conlog(`${message.author.tag} sent a random message in user rank room` + chalk.white(`\nMessage: ${message.content}`))
				} else {
					return conlog(`${message.author.tag} sent a random message in user rank room` + chalk.white(`\nMessage: ${message.content} \nAttachment: ${message.attachments.first().url}`))
				}
				
			}
		}
		// Role Room
		else if (message.channel.id == config.roles.room && message.content.toLowerCase() != (config.prefix + "roleroom") && disableRoleRoom == false) {
			if (!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return console.log(chalk.red("Cannot add roles for self-assignable roles, I need Manage Roles!"));
			
			let clean = message.content.toLowerCase().replace(/[#,\/]/g ,'');
	
			let cleanSplit = clean.split(' ')
			var completeRoles= "";
			
			if (message.content.toLowerCase().includes("remove")) {
				
				for (i = 0; i < cleanSplit.length; i++) {
					if(roles[cleanSplit[i]]) {
						message.member.removeRole(roles[cleanSplit[i]]).catch(console.error);
						let roleName = message.guild.roles.find('id', roles[cleanSplit[i]]);
						if (completeRoles = "") completeRoles += roleName.name
						else completeRoles += ", " + roleName.name
					}
				}
				if (completeRoles == "") { message.author.send("ERROR: Didn't recognise any available roles within message.\nThe bot can recognise some shortened version of the games, such as ``cs go``, but for best experience, please use the full name of the game.")
				} else {
					message.author.send("Successfully removed the following Roles:\n" + completeRoles)
					conlog(message.author.tag + " removed roles:")
					conlog(chalk.white(completeRoles));
				}
			}
			else {
				for (i = 0; i < cleanSplit.length; i++) {
					if(roles[cleanSplit[i]]) {
						let roleName = message.guild.roles.find('id', roles[cleanSplit[i]]);
						if (banRole(message.author.id, roles[cleanSplit[i]])) {
							message.author.send("Sorry but you are banned from being given the role " + roleName.name)
						} else {
							if(!rolesCheck[roles[cleanSplit[i]]]) {
								message.member.addRole(roles[cleanSplit[i]]).catch(console.error);
								completeRoles += roleName.name + ", "
							} else {
								let roleCheck = message.guild.roles.find('name', rolesCheck[roles[cleanSplit[i]]]);
								if (message.member.roles.has(roleCheck.id)) {
									message.member.addRole(roles[cleanSplit[i]]).catch(console.error);
									completeRoles += roleName.name + ", "
								} else {
									message.author.send(`Sorry, but you need to be ${roleCheck.name} to be able to get ${roleName.name} Role!`)
								}
							}
		}}}
				if (completeRoles == "") { message.author.send("ERROR: Didn't recognise any available roles within message.\nThe bot can recognise some shortened version of the games, such as ``cs go``, but for best experience, please use the full name of the game.")
				} else {
					message.author.send("Successfully added the following Roles:\n" + completeRoles);
					conlog(message.author.tag + " added roles:");
					conlog(chalk.white(completeRoles));
				}
			}
			setTimeout(() => message.delete(), 500)
		}
		// OTHER Commands
		if(message.content.indexOf(config.prefix) == 0) { 
			handle_command(message, message.content.substring(1));
		} else if (message.content.toLowerCase().indexOf("ily shadebot") != -1 && message.author.id == "183931930935427073") {
			message.channel.send("💬 Love you toooo! <:AliMercyHeart2:326076862503845890> <:AliMercyHeart:306055342490517506>")

		} else if (messageTaken == true && channels.replyMessagesAllowed.indexOf(message.channel.id) != -1) {
			reply.forEach(function(i) {
    			if (message.content.toLowerCase().indexOf(i.trigger) != -1 && messageTaken == true) {
        			if (i.users.indexOf(message.author.id) != -1) {
            			if (i.true) message.channel.send(i.true);
        			} else {
            			if (i.false) message.channel.send(i.false);
					}
					messageTaken = false;
   			}});
}}});

client.on("messageUpdate", (oldMessage, newMessage) => {
	if (newMessage.channel.type == "dm") {
		return;
	}
		// Invite checker
	if (invite.test(newMessage.content) && channels.invitesAllowed.indexOf(newMessage.channel.id) == -1 && !newMessage.author.bot) {
        conlog(`${newMessage.author.tag} sent a Discord link in ${newMessage.channel.name} (EDIT)\n` + chalk.white(`Message: ${newMessage.content}`)) // Logs
        newMessage.delete();
        newMessage.channel.send(`<:ShadeBotProfile:326817503076679690> Rule #8: Please do not Advertise other Discords <@${newMessage.author.id}>\nDoing this may cause you to be banned.`) // Sends Message + mentions
        const logChannel = newMessage.guild.channels.find('id', config.log.channelId);
        if (!logChannel) return;
	logChannel.send(`<@${newMessage.author.id}> posted a Discord link in <#${newMessage.channel.id}>\nMessage: ${newMessage.content}`);
    }
       // Link checker
    else if (chillLink.test(newMessage.content) && channels.linksAllowed.indexOf(newMessage.channel.id) == -1) {
		if (oldMessage.content == newMessage.content) return; // Hopefully a fix for random edit problem!
        conlog(`${newMessage.author.tag} sent a link in #${newMessage.channel.name} (EDIT)`) // Logs
        newMessage.delete();
		newMessage.channel.send(`<:ShadeBotProfile:326817503076679690> <#${newMessage.channel.id}> rule: No links in this room. <@${newMessage.author.id}>.\nDoing this may cause you to be Muted/Kicked/Banned`) // Sends Message + mentions
        
		const logChannel = newMessage.guild.channels.find('id', config.log.channelId);
		if (logChannel == null) return console.log(chalk.redBright("Log Channel doesn't exist!!"));
        let linkEmbed = new Discord.RichEmbed()
			.setTitle(newMessage.author.tag + " posted link in " + newMessage.channel.name, newMessage.author.displayAvatarURL)
			.setDescription("Message: " + newMessage.content)
			.setColor("#212121")
        logChannel.send({ embed: linkEmbed })

    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function search_command(command_name) {
	for(var i = 0; i < commands.length; i++) {
		if(commands[i].command == command_name.toLowerCase()) {
			return commands[i];
		}
	}

	return false;
}
function handle_command(message, text) {
	var params = text.split(" ");
	var command = search_command(params[0]);

	if(command) {
		if(params.length - 1 < command.parameters.length) {
			message.reply("Insufficient parameters!");
		} else {
			try {
				command.execute(message, params);
			} catch (err) {
				console.log(`error completing command ${command.command}: ` + err)
				message.channel.send("It done broke somehow. Go Fix!")
				return
			}
		}
	}
}

function conlog(message) {
	if (getTime().length > 7) {
		console.log(chalk.cyan(`${getTime()} : `) + chalk.cyan.bold(message))
	} else {
		console.log(chalk.cyan(` ${getTime()} : `) + chalk.cyan.bold(message))
	}	
}
function messageLog(message, content, room = config.log.channelId) {
	const logChannel = message.guild.channels.find('id', room);
	if (!logChannel) return console.log(chalk.redBright("Log Channel doesn't exist!!"));
	// Need to test if this works for Embed and text.
	logChannel.send(content)
}

function addToDatabase(id) {
	if (!storage[id]) {
		storage[id] = { // Add's info to the database if there's nothing for the user.
			money: 0,
			reset: 0,
			total: 0,
			points: 0
		}
		storage[1].users += 1
		fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => {	// Writes back to file.
			if (err) console.error(err)
		});
	}
}
function addRoomDatabase(message) {
	let id = message.channel.id
	if (!channels.inDatabase.indexOf(id)) {
		channels.inDatabase.push(`${id}`)
		channels.linksAllowed.push(`${id}`)
	
		message.channel.send(`This is the first time I've seen this room! I will apply the automatic configuration for a channel, if you would like to change anything in this channel do \`#settings edit\`:\n"**Invites Allowed:** false | **Image Link Allowed:** false | **Bot commands Allowed:** false\n**Reply Message Allowed:** false | **Links Allowed:** true`)
		
		fs.writeFile("./jsonStorage/channels.json", JSON.stringify(channels), (err) => {	// Writes back to file.
			if (err) console.error(err)
		});
	}
}
function addRoleBan(id) {
	if (!rolesBan[id]) {
		rolesBan[id] = []
		fs.writeFile("./jsonStorage/rolesBan.json", JSON.stringify(rolesBan), (err) => {	// Writes back to file.
			if (err) console.error(err)
		});
	}
}
function banRole(userId, roleId) {
	if (!rolesBan[userId]) { return false;}
	if (rolesBan[userId].indexOf(roleId) == -1) { return false; } 
	else { return true; }
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function getTime() {
	var time = new Date().toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric"});
	return time;
}

function addMoney(money, userData) {
	userData.money += money;
	userData.total += money;
}
function loseMoney(money, userData) {
	userData.money = parseInt(userData.money - money);
}
function isOdd(num) { 
	if ((num % 2) == 0) return false;
	else if ((num % 2) == 1) return true;
}

function format(seconds) {
  function pad(s){ return (s < 10 ? '0' : '') + s; }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);
  if (hours > 0) { return pad(hours) + 'h ' + pad(minutes) + 'm ' + pad(seconds) + 's'; }
  else { return pad(minutes) + 'm ' + pad(seconds) + 's'; } 
}


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


client.on('ready', () => {
	console.log(chalk.greenBright(` Start time: ${getTime()}`))
	console.log(chalk.greenBright(` Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`));
	console.log(chalk.green(" ---------------------------------------------"))
	setInterval(function () {
	    var currentGame = gameswelcome.games[Math.floor(Math.random() * gameswelcome.games.length)];
	    client.user.setPresence({ game: { name: currentGame, type: 0 } }); 	// Sets random game from the Array Games
	    messageTaken = true					// Caps the command every Minute
		
		if (getTime() === "12:01 AM") {
            conlog("Reset Welcome counter")
			storage[1].welcomeNum = 0
			fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => {	// Writes back to file.
				if (err) console.error(err)
			});	
		}
	}.bind(this), 60000);
});

// Ban/Unban
client.on("guildBanAdd", (guild, user) => {
	conlog(`${user.tag} (id: ${user.id}) has been banned from the server ${guild.name}`)
	const logChannel = guild.channels.find('name', 'kick-ban-record');
    if (!logChannel) return console.log(chalk.redBright("Log Channel doesn't exist!!"));
    logChannel.send(`${getTime()}: ${user.tag} (id: ${user.id}) has been banned from the server\nPlease provide needed information for why you have banned the user:`);
	
});
client.on("guildBanRemove", (guild, user) => {
	conlog(`${user.tag} (id: ${user.id}) has been unbanned from the server ${guild.name}`)
	const logChannel = guild.channels.find('name', 'kick-ban-record');
    if (!logChannel) return console.log(chalk.redBright("Log Channel doesn't exist!!"));
    logChannel.send(`${getTime()}: ${user.tag} (id: ${user.id}) has been unbanned from the server!`);
	
});

// Join-Leave

client.on("guildMemberadd", member => {
	if (config.log.joinleave) {
		const logChannel = member.guild.channel.find('id', config.log.channelId)
		if (!logChannel) return console.log(chalk.redBright("Log Channel doesn't exist!!"));
		let joinEmbed = new Discord.RichEmbed()
			.setDescription(`?? **${message.author.tag}** has \`\`joined\`\` the server. (${message.author.id})`)
			.setColor("#00ff00")
			.setFooter(`User joined (${member.guild.memberCount})`, message.author.displayAvatarURL)
			.setTimestamp(new Date())
		logChannel.send(message, {embed: joinEmbed})
	}
});

client.on("guildMemberRemove", member => {
	if (config.log.joinleave) {
		const logChannel = member.guild.channel.find('id', config.log.channelId)
		if (!logChannel) return console.log(chalk.redBright("Log Channel doesn't exist!!"));
		let joinEmbed = new Discord.RichEmbed()
			.setDescription(`?? **${message.author.tag}** has \`\`lefted\`\` the server. (${message.author.id})`)
			.setColor("#FF0000")
			.setFooter(`User joined (${member.guild.memberCount})`, message.author.displayAvatarURL)
			.setTimestamp(new Date())
		logChannel.send({embed: joinEmbed})
	}
});

// Errors
process.on('unhandledRejection', (err) => conlog(chalk.yellow('Promise was rejected but there was no error handler: ' + chalk.white(err))))
client.on("guildCreate", guild => console.log(chalk.magenta(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)));
client.on("guildDelete", guild => console.log(chalk.magenta(`I have been removed from: ${guild.name} (id: ${guild.id})`)));
client.on("error", (e) => console.error(chalk.red("Error: " + e)));
client.on("warn", (e) => console.warn(chalk.yellow("Warning: " + e)));

client.login(config.token);
