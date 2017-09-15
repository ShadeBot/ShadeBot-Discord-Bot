const Discord = require('discord.js');
const fs = require("fs"); // Reading of Files
const os = require('os');

const client = new Discord.Client();

const config = require('./configbot.json');
var channels = JSON.parse(fs.readFileSync("./jsonStorage/channels.json", "utf8"));
var storage = JSON.parse(fs.readFileSync("./jsonStorage/storage.json", "utf8"));
var roles = JSON.parse(fs.readFileSync("./jsonStorage/roles.json", "utf8"));
var rolesCheck = JSON.parse(fs.readFileSync("./jsonStorage/rolesCheck.json", "utf8"));
var rolesBan = JSON.parse(fs.readFileSync("./jsonStorage/rolesBan.json", "utf8"));

const games = ["with Alipoodle 💖", "with Rizako's 🍆", "with Moo Bot 🐮", "with 42", "404 game not found", "github.com/Alipoodle/ShadeBot-Discord", "with Hot Cold", "with Alipoodle 💙", "with Lenny's Apple 🍏", "playing with Senpai 💞", "with Winter's Santa Hat 🎅", "with Jeff's 9+10 Damn Daniel", "with Jail Bait 👮"];
const welcomeMessage = ["Enjoy your stay ❤", "Enjoy your stay 😊", "Make sure to give us a **Hi**", "😊 Nice to see you!", "Good Morning, Good Afternoon or Good Evening", "404 Welcome message not found...", "Welcome to the party! :tada:", "Whalecome", "I am Shadebot, the Server's servant."]
const tableFlip = ["(╯°□°)╯︵ ┻━┻", "(ノ ゜Д゜)ノ ︵ ┻━┻ ", "‎(ﾉಥ益ಥ）ﾉ﻿ ┻━┻", "(ノ^_^)ノ┻━┻", "(╯°Д°）╯︵ /(.□ . \\)", "(╯'□')╯︵ ┻━┻", "(/ .□.)\\ ︵╰(゜Д゜)╯︵ /(.□. \\)", "ʕノ•ᴥ•ʔノ ︵ ┻━┻", "(._.) ~ ︵ ┻━┻ *magic*", "(/¯◡ ‿ ◡)/¯ ~ ┻━┻ *magic*", "ヽ(ຈل͜ຈ)ﾉ︵ ┻━┻", "_|___|_  ╰(º o º╰)", "┻━┻ ヘ╰( •̀ε•́ ╰)", "(ノ°▽°)ノ︵┻━┻", "(╯ ͝° ͜ʖ͡°)╯︵ ┻━┻", "┻━┻ ︵﻿ ¯\\(ツ)/¯ ︵ ┻━┻"]
const unflip = ["┬─┬﻿ ノ( ゜-゜ノ) ", "┬─┬﻿ ︵ /(.□. \\）", "┬─┬ ノ( ^_^ノ)", "(/ .□.)\\ ︵╰(゜Д゜)╯︵ /(.□. \\)", "┬─┬ノ(ಠ_ಠノ)", "┬──┬﻿ ¯\\_(ツ)", "┬─┬ノ( º _ ºノ)", "┬─┬ノ( ◕◡◕ ノ)", "┏━┓ ︵ /(^.^/)", "┳━┳ ヽ༼ಠل͜ಠ༽ﾉ", "┬━┬﻿ ノ( ゜¸゜ノ)", "ヽ（ ﾟヮﾟ）ﾉ.・ﾟ*｡・+☆ ┳━┳", "┬──┬ ლ(ಠ益ಠლ)"]

var avatar                                      // This is used for Storing of the Profile picture of a user who sends the message
var messageTaken = true                         // Crappy Anti spam of messages
var autoMessageDelete = 15000					// Timeout in ms for when the bot will remove a message.
var welcomeOption = 0
var roomReset = new Date()
var messageIDReset = "null"
const slowmode = new Map();
const ratelimit = 7500


/* Regex */

var chillLink = /(http(s)?):\/\/[?a-zA-Z0-9:%._\-\+~#=]{2,256}[^..]\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+\-.~#?&//=]*)/
var invite = /(discord(\.gg|app\.com\/invite)\/([\w]{16}|([\w]+-?){2}))/
var imageTest = /(http(s)?):[\/\/?a-zA-Z0-9:%._\-\+~#=]{2,256}[^..]\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+\-.~#?&//=]*\.(png|jpg|jpeg|gif))/
var steamImage = /(http(s)?:\/\/steamuserimages-a.akamaihd.net\/ugc\/)([0-9]{18})\/([0-9A-Z]{40})/
var osuImage = /(http(s)?):\/\/osu.ppy.sh\/ss\/[0-9]{7,8}/
var gyazoImage = /(http(s)?:\/\/)(gyazo.com\/)([0-9a-z]{32})/
var imgurImage = /(http(s)?:\/\/)(imgur.com)\/([a-zA-z]{7})/



function isOdd(num) { return num % 2;}
function getTime() {
	var time = new Date().toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric"});
	return time;
}
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
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
	if (!channels[id]) {
		channels[id] = { // Add's info to the database if there's nothing for the user.
			invitesAllowed: "false",
			imageLink: "false",
			botCommandsAllowed: "false",
			allowReplyMessages: "false",
			linksAllowed: "true"
		}
		message.channel.send("This is the first time I've seen this room! I will apply the automatic configuration for a channel:\n" + `**Invites Allowed:** ${channels[id].invitesAllowed} | **Image Link Allowed:** ${channels[id].imageLink} | **Bot commands Allowed:** ${channels[id].botCommandsAllowed}\n**Reply Message Allowed:** ${channels[id].allowReplyMessages} | **Links Allowed:** ${channels[id].linksAllowed}`)
		
		fs.writeFile("./configbot.json", JSON.stringify(config), (err) => {	// Writes back to file.
			if (err) console.error(err)
		});
	}
}
function addMoney(money, userData) {
	userData.money += money;
	userData.total += money;
	fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => {	// Writes back to file.
			if (err) console.error(err)
	});
}
function addRoleBan(id) {
	if (!rolesBan[id]) {
		rolesBan[id] = []
		fs.writeFile("./jsonStorage/rolesBan.json", JSON.stringify(rolesBan), (err) => {	// Writes back to file.
			if (err) console.error(err)
		});
	}
}
function loseMoney(money, userData) {
	userData.money = parseInt(userData.money - money);
	fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => {	// Writes back to file.
			if (err) console.error(err)
	});
}
function format(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  return pad(hours) + 'h ' + pad(minutes) + 'm ' + pad(seconds) + 's';
}
function banRole(userId, roleId) {
	if (!rolesBan[userId]) { return false;}
	if (rolesBan[userId].indexOf(roleId) == -1) { return false; } 
	else { return true; }
}

// What the bot does on start up!
client.on('ready', () => {
	console.log("Start time: " + getTime())
	console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
	console.log("---------------------------------------------")
	setInterval(function () {
	    var currentGame = games[Math.floor(Math.random() * games.length)];
	    client.user.setPresence({ game: { name: currentGame, type: 0 } }); 	// Sets random game from the Array Games
	    messageTaken = true					// Caps the command every Minute
		
		if (getTime() === "12:01 AM") {
            console.log(getTime() + ": Reset Welcome counter")
			storage[1].welcomeNum = 0
			fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => {	// Writes back to file.
				if (err) console.error(err)
			});	
		}
	}.bind(this), 60000);
});

client.on('disconnected', () => {
	console.log(getTime() + "-=-  Bot has Disconnected from Discord server        -=-");
    client.destroy().then(client.login.bind(client));
	console.log(getTime() + "-=-  Bot is trying to reconnect to Discord servers   -=-");
});

client.on('message', message => {
	if (message.channel.type == "dm") {
		if (message.author.id != client.user.id) {
			return console.log(`${getTime()}: ${message.author.tag} sent a Private Message to ShadeBot:\n${message.content}`)
		} else { return }
	}
	addRoomDatabase(message)
	
    // Checks and removes Discord Links
    if (invite.test(message.content) && channels[message.channel.id].invitesAllowed != "true") {
        console.log(getTime() + ": " + message.author.tag + " sent a Discord link") // Logs
        message.delete();
        message.channel.send("<:ShadeBotProfile:326817503076679690> Rule #8: Please do not Advertise other Discords <@" + message.author.id + ">\nDoing this may cause you to be banned.") // Sends Message + mentions
        const logChannel = message.guild.channels.find('id', config.logId);
        if (!logChannel) return;
        logChannel.send("<@" + message.author.id + "> posted a Discord link in <#" + message.channel.id + ">\n" + message.content);

    }
        // Image command
    else if (message.content.toLowerCase().startsWith('#image') && (channels[message.channel.id].imageLink == "true")) {
        let legWeeb = message.guild.roles.find('name', 'Legendary Weeb');
        message.delete();
        if (message.member.roles.has(legWeeb.id)) {
            let args = message.content.split(' ').slice(1);

            try {
                var link = args[0];
            } catch (e) {
                message.author.send("Err: Please provide an image.")
                return;
            }
            if (link === null) return;

            if (imageTest.test(link) || osuImage.test(link) || steamImage.test(link)) {
                let linkEmbed = new Discord.RichEmbed()
					.setImage(link)
					.setColor("#FFEB3B")
					.setFooter("Image sent by, " + message.author.tag + " (" + message.author.id + ")", message.author.displayAvatarURL);
                message.channel.sendEmbed(linkEmbed);
            } else if (gyazoImage.test(link) || imgurImage.test(link)) {
                let linkSplit = link.split('/');
                let newLink = "https://i." + linkSplit[2] + "/" + linkSplit[3] + ".png"

                let linkEmbed = new Discord.RichEmbed()
					.setImage(newLink)
					.setColor("#FFEB3B")
					.setFooter("Image sent by, " + message.author.tag + " (" + message.author.id + ")", message.author.displayAvatarURL);
                message.channel.sendEmbed(linkEmbed);
            } else {
                message.author.send("Usage: ``#image (url)``\n - Links **must** be starting with ``http(s)://``\n - Links *should* end in `.png` `.jpg` `.jpeg` or `.gif`\n - Alternatively the command supports links from osu!, Steam and Gyazo (Static) that do not have these file endings!");
            }
        } else {
            message.author.send("You need to be Legendary Weeb to use this command!");
        }
    }
        // Link checker
    else if (chillLink.test(message.content.toLowerCase()) && channels[message.channel.id].linksAllowed != "true") {
        console.log(getTime() + ": " + message.author.tag + " sent a link in #" + message.channel.name) // Logs
        message.delete();
        message.channel.send("<:ShadeBotProfile:326817503076679690> <#" + message.channel.id +"> rule: No links in this room. <@" + message.author.id + ">.\n*You should post stuff like this in #shitpost or you can level up to Legendary and post images using `#image`*\nDoing this may cause you to be Muted/Kicked/Banned") // Sends Message + mentions
        
		const logChannel = message.guild.channels.find('id', config.logId);
		if (logChannel == null) return console.log("Log Channel doesn't exist!!");
        let linkEmbed = new Discord.RichEmbed()
			.setTitle(message.author.tag + " posted link in " + message.channel.name, message.author.displayAvatarURL)
			.setDescription("Message: " + message.content)
			.setColor("#212121")
        logChannel.sendEmbed(linkEmbed)

    }
		// Mention spammer
	if(!message.author.bot && message.guild.member(client.user).hasPermission("MANAGE_ROLES") && !message.member.hasPermission("MANAGE_MESSAGES") && message.mentions.users.size > 1) {
		if(!message.mentions.users.size == 1 || !message.mentions.users.first().bot) {
			let entry = slowmode.get(message.author.id);
			if(!entry && entry != 0) {
				entry = 0;
				slowmode.set(message.author.id, entry);
			}
			entry += message.mentions.users.size + message.mentions.roles.size;
			slowmode.set(message.author.id, entry);
			
			if(entry > 9) {
				message.member.addRole(config.roles.mute)
				message.channel.send(`:no_entry_sign: User ${message.author.username} has just been auto-muted for mentionning too many users/roles.\nUsers that have been mentioned, we apologize for the annoyance. Please don't be mad!`);
				console.log(`Auto-muted ${message.author.username} [${message.author.id}] from ${message.guild.name} for mentioning too many users (${entry}).`);
				const logChannel = message.guild.channels.find('name', 'kick-ban-record');
				if (!logChannel) return;
				
				logChannel.send(`Auto-muted <@${message.author.id}> for mentioning too many users/roles (${entry}).`);
			}
			setTimeout(()=> {
				entry -= message.mentions.users.size + message.mentions.roles.size;
				slowmode.set(message.author.id, entry);
				if(entry <= 0) slowmode.delete(message.author.id);
			}, ratelimit);
		}
	}
	
    // Checks for Messages in User Rank and it's content is the password
    if (message.channel.id === config.welcome.passwordRoomId && (message.content.toLowerCase() === config.welcome.password.toLowerCase()) || message.content.toLowerCase() === `${config.welcome.password.toLowerCase()}.`) {
		message.guild.fetchMember(message.author)
			.then(member => {
			if (member.roles.has(config.roles.mod) || member.roles.has(config.roles.admin)) {
				message.delete()
				return message.author.send("Sorry but you're Mod / Admin, you cannot welcome yourself!")
			}
		    avatar = message.author.displayAvatarURL;

            if (avatar.startsWith('https://cdn.discordapp.com/avatars/')) {
                console.log(getTime() + ": " + message.author.tag + " Has joined the server");
			
                member.addRole(`${config.welcome.defaultRoleId}`).catch(console.error);
            
			    if (welcomeOption == 0) {
				    const welChannel = message.guild.channels.find('id', config.welcome.welcomeRoomId);
				    storage[1].welcomeNum++;
				    fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => {	// Writes back to file.
					    if (err) console.error(err)
				    });
				    var extraMessage = welcomeMessage[Math.floor(Math.random() * welcomeMessage.length)];
				    welChannel.send(`<:ShadeBotWelcome:326815681540784139> **Welcome to the server <@${message.author.id}>** <:ShadeBotWelcome:326815681540784139>\n${extraMessage}\n*${storage[1].welcomeNum} user(s) have been welcomed today.*`)
					    .then(function (message) {
						    message.react("🎉")
					    }).catch(function () {
						    console.log("Failed to Add Emojis to Welcoming message")
					    });
			    } else if (welcomeOption == 1) {
				    message.author.send(`<:ShadeBotWelcome:326815681540784139> **Welcome to the server <@${message.author.id}>** <:ShadeBotWelcome:326815681540784139>`)
			    }
			
			    if (config.welcome.logging.toLowerCase() == "true") {
			        let welcomeEmbed = new Discord.RichEmbed()
                        .setDescription(":tada: **" + message.author.tag + "** has been ``welcomed`` to the server. (" + message.author.id + ")")
                        .setColor("#0D47A1")
                        .setFooter("User Welcomed | " + storage[1].welcomeNum + " user(s) welcomed today", message.author.displayAvatarURL);

				    const logChannel = message.guild.channels.find('id', config.logId);
				    if (logChannel == null) return console.log("Log Channel doesn't exist!!");
				    logChannel.send({ embed: welcomeEmbed });
			}

            } else if (avatar.startsWith('https://discordapp.com/assets/')) { // Checks if it's a Default Discord picutre
                console.log(getTime() + ": " + message.author.tag + " No Avatar"); // Logs

                message.author.send("Please read the <# " + config.messageRoomId + "> room again"); // PMs them what to do.
            } else {
                console.log(getTime() + ": " + message.author.tag + " No Avatar / With Avatar"); // Error check?
            }
            message.delete()
		});
    }

        // Checks for Random messages in room
    else if (message.channel.id === config.welcome.passwordRoomId) { // Checks just for messages in User Rank
        console.log(getTime() + ": " + message.author.tag + " Sent a random message in User Rank\n" + message.content);
        message.author.send("Please Read the <#" + config.welcome.passwordRoomId + "> room again"); // PMs them what to do
        message.delete();
    }

        // Roles
	if (message.channel.id == config.roles.room) {
		let clean = message.content.toLowerCase().replace(/[#,\/]/g ,'');

		let args = clean.split(' ')
		var completeRoles= "";
		
		if (message.content.toLowerCase().includes("remove")) {
			console.log(getTime() + ": " + message.author.tag + " removed roles:")
			for (i = 0; i < args.length; i++) {
				if(roles[args[i]]) {
					message.member.removeRole(roles[args[i]]).catch(console.error);
					let roleName = message.guild.roles.find('id', roles[args[i]]);
					completeRoles += roleName.name + ", "
				}
			}
			if (completeRoles == "") { message.author.send("ERROR: Didn't recognise any available roles within message.\nThe bot can recognise some shortened version of the games, such as ``cs go``, but for best experience, please use the full name of the game.")
			} else {
				message.author.send("Successfully removed the following Roles:\n" + completeRoles)
				console.log(getTime() + ": " + completeRoles);
			}
		}
		else {
			console.log(getTime() + ": " + message.author.tag + " added roles:")
			for (i = 0; i < args.length; i++) {
				if(roles[args[i]]) {
					let roleName = message.guild.roles.find('id', roles[args[i]]);
					if (banRole(message.author.id, roles[args[i]])) {
						message.author.send("Sorry but you are banned from being given the role " + roleName.name)
					} else {
						if(!rolesCheck[roles[args[i]]]) {
							message.member.addRole(roles[args[i]]).catch(console.error);
							completeRoles += roleName.name + ", "
						} else {
							let roleCheck = message.guild.roles.find('name', rolesCheck[roles[args[i]]]);
							if (message.member.roles.has(roleCheck.id)) {
								message.member.addRole(roles[args[i]]).catch(console.error);
								completeRoles += roleName.name + ", "
							} else {
								message.author.send(`Sorry, but you need to be ${roleCheck.name} to be able to get ${roleName.name} Role!`)
							}
						}
}}}
			if (completeRoles == "") { message.author.send("ERROR: Didn't recognise any available roles within message.\nThe bot can recognise some shortened version of the games, such as ``cs go``, but for best experience, please use the full name of the game.")
			} else {
				message.author.send("Successfully added the following Roles:\n" + completeRoles)
				console.log(getTime() + ": " + completeRoles);
			}
		}
		setTimeout(() => message.delete(), 500)
		
		
	}
    
	/*else if (roomReset < new Date()) {
		let channel = message.guild.channels.find('id', '153951788163137536')
		if (messageIDReset != "null") {
			// Get message
			channel.fetchMessage(messageIDReset)
				.then(message => message.delete())
				.catch(console.error);
		}
		channel.send("🔄 ***Reminder***: *No links or edgy conversations here.*")
			.then(message => messageIDReset = message.id)
			.catch(console.error);
		roomReset = new Date(roomReset.setHours(roomReset.getHours() + 1))
	}*/

    else if (message.content.toLowerCase() === ("#daily") && (channels[message.channel.id].botCommandsAllowed == "true")) {
        addToDatabase(message.author.id);

        let userData = storage[message.author.id];	// makes easier to access

        let currentDate = new Date();
        let resetDate = new Date(userData.reset);
        if (resetDate < currentDate) {	// checks if cooldown is over.
            dailyAmount = 100
            addMoney(dailyAmount, userData);
            let embed = {
                "description": "💵 Sucessfully added `" + dailyAmount + " ` ShadeBucks to your account!",
                "color": 16090000,
                "footer": {
                    "icon_url": `${message.author.displayAvatarURL}`,
                    "text": `${message.author.tag}`
                }
            };
            message.channel.send({ embed });
                    let resetDate = addDays(currentDate, 1);
                    userData.reset = resetDate;
            } else {
                    let timeLeft = new Date(resetDate - currentDate);
                    message.channel.send(`<@${message.author.id}>, Sorry but you still need to wait: **${timeLeft.getHours() }** hour(*s*), and **${timeLeft.getMinutes() }** minute(*s*)`)
            }

                fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => {	// Writes back to file.
                    if (err) console.error(err)
                });
    }
    else if ((message.content.startsWith("#bal") || message.content.startsWith("#balance") || message.content.startsWith("#money")) && (channels[message.channel.id].botCommandsAllowed == "true")) {
        let mentionedUser = message.mentions.users.first();
        let balAccount = message.guild.member(mentionedUser);

        if (balAccount == null) {
            var balID = message.author.id
            var balTag = message.author.tag
			var balPFP = message.author.displayAvatarURL
        } else {
            var balID = balAccount.id
            var balTag = balAccount.user.tag
			var balPFP = balAccount.user.displayAvatarURL
			
        }

        addToDatabase(balID);
        let userData = storage[balID];	// makes easier to access

        let balEmbed = new Discord.RichEmbed()
                .setDescription(`💰 You currently have ${userData.money} ShadeBucks\n*You have had a total of ${userData.total} ShadeBucks in your account*`)
                .setColor("#4CAF50")
                .setFooter(balTag, balPFP);
        message.channel.sendEmbed(balEmbed)
		
		if (userData.money == null) { 
		  message.channel.send("<@&321024631072882688> Error Encountered...")
		}
    }
    else if (message.content.toLowerCase().startsWith("#send") && (channels[message.channel.id].botCommandsAllowed == "true")) {
        addToDatabase(message.author.id);

        let args = message.content.split(' ').slice(1);
        let mentionedUser = message.mentions.users.first();
        let addUser = message.guild.member(mentionedUser);
        let numMoney = parseInt(args[1]);

        if (storage[message.author.id].money < numMoney) {
            message.reply("Sorry. You don't have enough money in your account to give!")
            return;
        } else if (addUser == null) {
            message.reply("At the moment I can only send money by doing a mention of the user. ``#send @USER 100``")
			.then(function (message) {
			    setTimeout(() => message.delete(), autoMessageDelete)
			}).catch(function () {
			    console.log("Failed to auto delete message after time period")
			});
            return;
			
        } else if (!numMoney > 0) {
            message.reply("At the moment I can only send money by doing a mention of the user. ``#send @USER 100``")
			.then(function (message) {
			    setTimeout(() => message.delete(), autoMessageDelete)
			}).catch(function () {
			    console.log("Failed to auto delete message after time period")
			});
            return;
        }


        addToDatabase(addUser.id);
		

        let userDataO = storage[message.author.id]
        loseMoney(numMoney, userDataO)
        let Bembed = {
            "description": "💵 Removed `" + numMoney + "` ShadeBucks from your account!",
            "color": 10099992,
            "footer": {
                "icon_url": `${message.author.displayAvatarURL}`,
                "text": `${message.author.tag}`
            }
        };
        message.channel.sendEmbed(Bembed);
		
		let userData = storage[addUser.id];
		numMoney = parseInt(numMoney * 0.9)

        addMoney(numMoney, userData);
        let Aembed = {
            "description": "💵 Sucessfully added `" + numMoney + " ` ShadeBucks to your account!\n*10% Tax has been removed from the money*",
            "color": 16090000,
            "footer": {
                "icon_url": `${addUser.user.displayAvatarURL}`,
                "text": `${addUser.user.tag}`
            }
        };
        message.channel.sendEmbed(Aembed);
    }
    else if (message.content.toLowerCase().startsWith("#luckydip") || message.content.toLowerCase().startsWith("#ld") && (channels[message.channel.id].botCommandsAllowed == "true")) {
        let args = message.content.split(' ').slice(1);
        let tempMoney = args[0];

        addToDatabase(message.author.id);

        // money check ETC.
        let random = Math.floor(Math.random() * 75);
        let userData = storage[message.author.id];

        /*let currentDate = new Date();
        let delayDate = new Date(userData.reset);
        if (delayDate > currentDate) {
            amount = new Date(delayDate - currentDate)
            message.channel.reply("commands are on cooldown for " + amount.getSeconds + "s")
            setTimeout(() => message.delete(), autoMessageDelete)
            return
        }*/

        if (tempMoney == "help" || tempMoney == null) {
            message.author.send("Usage: ``#luckydip (amount)``\n - You can bet between 1-999\n - You will gain / lose money relative to this chart: ```fix\n💎 OBJECT        |  MONEY BACK\n--------------------------------\n🔎 Nothing       |  0\n💩 Pile of Poo   |  0.1\n🥄 Spoon         |  0.2\n🔑 Old Key       |  0.5\n🔨 Hammer        |  0.75\n🔧 Wrench        |  0.75\n🎉 Party Popper  |  1.1\n🎊 Confetti Ball |  1.2\n🍬 Wrapped Candy |  1.25\n💳 Credit Card   |  1.5\n🎰 Slot Machine  |  2```")
            return;
        }
        else if (tempMoney == "return") {
            message.channel.send("Odds:```fix\n💎 OBJECT        |  MONEY BACK\n--------------------------------\n🔎 Nothing       |  0\n💩 Pile of Poo   |  0.1\n🥄 Spoon         |  0.2\n🔑 Old Key       |  0.5\n🔨 Hammer        |  0.75\n🔧 Wrench        |  0.75\n🎉 Party Popper  |  1.1\n🎊 Confetti Ball |  1.2\n🍬 Wrapped Candy |  1.25\n💳 Credit Card   |  1.5\n🎰 Slot Machine  |  2```")
            return;
        }
        else if (tempMoney > 0) {
            var money = parseInt(tempMoney);
			if (money % 1 != 0) {
				return message.reply("Please don't try and use Deciamls...")
			}
        } else {
            message.author.send("Usage: ``#luckydip (amount)``\n - You can bet between 1-999\n - You will gain / lose money relative to this chart: ```fix\n💎 OBJECT        |  MONEY BACK\n--------------------------------\n🔎 Nothing       |  0\n💩 Pile of Poo   |  0.1\n🥄 Spoon         |  0.2\n🔑 Old Key       |  0.5\n🔨 Hammer        |  0.75\n🔧 Wrench        |  0.75\n🎉 Party Popper  |  1.1\n🎊 Confetti Ball |  1.2\n🍬 Wrapped Candy |  1.25\n💳 Credit Card   |  1.5\n🎰 Slot Machine  |  2```")
            return;
        }
        if (money > storage[message.author.id].money) {
            message.channel.send("Sorry, you are betting more than you have!")
			.then(function (message) {
			    setTimeout(() => message.delete(), autoMessageDelete)
			}).catch(function () {
			    console.log("Failed to auto delete message after time period")
			});
            return;
        } else if (money > 500) {
			message.channel.send("Sorry, but you cant bet more than 500 Shadebucks!")
			.then(function (message) {
			    setTimeout(() => message.delete(), autoMessageDelete)
			}).catch(function () {
			    console.log("Failed to auto delete message after time period")
			});
			return;
		}


        if (random < 5) {
            //🕳 Nothing (space)	0
            message.channel.send("You got 🔎 Nothing. So sadly you **lose all** of your money.\nYour Random Number was: " + random)
            loseMoney(money, userData)
        } else if (random < 10) {
            // 💩 Pile of Poo		0.1
			money *= (1 - 0.1)
			money = parseInt(money)
            message.channel.send("You got a 💩 Pile of Poo. So you only get **10%** of your money back. *and that's good for sh*t\nYour Random Number was: " + random)
            loseMoney(money, userData)
        } else if (random < 15) {
            // 🥄 Spoon				0.2
			money *= (1 - 0.2)
			money = parseInt(money)
            message.channel.send("You got a 🥄 Spoon. Only " + money + " Shadebucks back. Something at least for a web.\nYour Random Number was: " + random)
			money = parseInt(money)
            loseMoney(money, userData)
        } else if (random < 20) {
            // 🔑 Old Key			0.5
			money *= (1 - 0.5)
			money = parseInt(money)
            message.channel.send("You got a 🗝 Old Key. This isn't going to unlock any doors, but at least you keep " + money + " Shadebucks.\nYour Random Number was: " + random)
            loseMoney(money, userData)
        } else if (random < 25) {
            // 🔨 Hammer				0.75
			money *= (1 - 0.75)
			money = parseInt(money)
            message.channel.send("You got a ⚙ Gear. You lose a little, but keep " + money + " Shadebucks still.\nYour Random Number was: " + random)
            loseMoney(money, userData)
        } else if (random < 30) {
            // 🔧 Wrench				0.75
			money *= (1 - 0.75)
			money = parseInt(money)
            message.channel.send("You got 🔧 Wrench. This doesn't fix your problems, but you keep " + money + " Shadebucks.\nYour Random Number was: " + random)
            loseMoney(money, userData)
        } else if (random < 50) {
            // Flower				1
            let flower = ["🌸 Cherry Blossom", "💮 White Flower", "🏵 Rosette", "🌹 Rose", "🌺 Hibiscus", "🌻 Sunflower", "🌼 Blossom", "🌷 Tulip"];
            message.channel.send(`You got a ${flower[Math.floor(Math.random() * flower.length)]}. This nice flower lets you keep your money!\nYour Random Number was: ${random}`);
        } else if (random < 55) {
            // 🎉 Party Popper		1.1
			money *= 0.1
			money = parseInt(money)
            message.channel.send("You got a 🎉 Party Popper. Maybe you can have a party with the the " + money + " Shadebucks Extra.\nYour Random Number was: " + random)
            addMoney(money, userData)
        } else if (random < 60) {
            // 🎊 Confetti Ball		1.2
			money *= 0.2
			money = parseInt(money)
            message.channel.send("You got a 🎊 Confetti Ball. With the extra " + money + " Shadebucks you just won, maybe buy something to clean this mess...\nYour Random Number was: " + random)
            addMoney(money, userData)
        } else if (random < 65) {
            // 🍬 Wrapped Candy		1.25
			money *= 0.25
			money = parseInt(money)
            message.channel.send("You got a 🎁 Wrapped Gift. Enjoy the little gift, it has " + money + " Shadebucks.\nYour Random Number was: " + random)
            addMoney(money, userData)
        } else if (random < 70) {
            // 💳 Credit Card	1.5
			money *= 0.5;
			money = parseInt(money)
            message.channel.send("You got a 💳 *Credit Card*. *Shhh* Ali doesn't need to know <:AliMercyWink:319905027143499776>. It has " + money + " Shadebucks\nYour Random Number was: " + random)
            addMoney(money, userData);
        } else if (random < 75) {
            // 🎰 Slot Machine	2
            message.channel.send("You got a 🎰 **JACKPOT**. :tada: You just Doubled your money :tada:.Keep the original and get " + money + " Shadebucks more!\nYour Random Number was: " + random)
            addMoney(money, userData);
        }

    }
    else if (message.content.toLowerCase().startsWith("#roulette") || (message.content.toLowerCase().startsWith("#r") && !message.content.toLowerCase().startsWith("#role")) && (channels[message.channel.id].botCommandsAllowed == "true")) {
        let args = message.content.split(' ').slice(1);
        let colour = args[0];
        let tempMoney = args[1];

        addToDatabase(message.author.id);

        // money check ETC.
        let userData = storage[message.author.id];

        if (tempMoney == "help" || tempMoney == null) {
            message.author.send("Usage ``#roulette (black, red, green) (amount)``\nPick any of the colours you want... but some are more likely than others...\n**Black is for Even numbers**... **and Red is for odd**... both of these will provide you with **1.5x your original amount**.\nTake a risk and pick **Green** and you can get **14x the amount of money**... however it's one in 37.") //help
            return;
        }
        else if (tempMoney > 0) {
            var money = parseInt(tempMoney);
        } else {
            message.author.send("Usage ``#roulette (black, red, green) (amount)``\nPick any of the colours you want... but some are more likely than others...\n**Black is for Even numbers**... **and Red is for odd**... both of these will provide you with **1.5x your original amount**.\nTake a risk and pick **Green** and you can get **14x the amount of money**... however it's one in 37.") //help
            return;
        }
        if (money > storage[message.author.id].money) {
            message.channel.send("Sorry, you are betting more than you have!")
			
            return;
        } else if (money > 500) {
			message.channel.send("Sorry, but you cant bet more than 500 Shadebucks!")
			return;
		}


        if (colour == "b" || colour.includes("black")) { colour = 1; }
        else if (colour == "r" || colour.includes("red")) { colour = 2; }
        else if (colour == "g" || colour.includes("green")) { colour = 3; }
        else { message.channel.send("You can only bet on Black (2x), Red (2x), or Green (14x)."); }

        let random = Math.floor(Math.random() * 37);
		let random2 = Math.floor(Math.random() * 100);

        // 0 = Green
        if (random == 0) {
            if (colour == 3) {
                money = money * 14
                addMoney(money, userData)
                message.channel.send(`💚 **JACKPOT** You got ${money} ShadeBucks. 💚\nThe Number was ${random}`)
				console.log(`${message.author.tag} Won the jackpot`)
            } else {
                loseMoney(money, userData)
                message.channel.send(`You sadly lost ${money} ShadeBucks.\nThe Number was ${random}`)
            }
        }
            // Odd = Red
        else if (isOdd(random) == 1) {
            if (colour == 2) {
                money *= 1.5
				money = parseInt(money)
                addMoney(money, userData)
                message.channel.send(`🔴 **Woo** You got ${money} ShadeBucks. 🔴\nThe Number was ${random}`)
            } else {
                loseMoney(money, userData)
                message.channel.send(`You sadly lost ${money} ShadeBucks.\nThe Number was ${random}`)
            }
        }
            // Even = Black
        else if (isOdd(random) == 0) {
            if (colour == 1) {
                money *= 1.5
				money = parseInt(money)
                addMoney(money, userData)
                message.channel.send(`⚫ **Woo** You got ${money} ShadeBucks. ⚫\nThe Number was ${random}`)
            } else {
                loseMoney(money, userData)
                message.channel.send(`You sadly lost ${money} ShadeBucks.\nThe Number was ${random}`)
            }
        }
		else {
			message.reply("Error: <@&321024631072882688>... please wait.")
		}
    }

        /* Personal Commands to fix stuff */
    else if (message.content.startsWith("#clear") && message.author.id === config.ownerId) {
        message.delete();
        let args = message.content.split(' ').slice(1);
        let numDelete = args[0];
		console.log(numDelete)
		if (numDelete < 3 || numDelete > 99 || numDelete == null || numDelete == "NaN") {return message.reply("Sorry but you cannot clear less than 2 messages or more than 100!")}
		
		if(!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) return message.channel.send("Error, i do not have manage message permissions");
		message.channel.bulkDelete(numDelete).catch(console.error);
    } else if (message.content.startsWith("#welcomenum") && message.author.id === config.ownerId) {
        message.delete();
        let args = message.content.split(' ').slice(1);
        storage[1].welcomeNum = args[0];
        message.reply("Sucessfully changed the Welcome Counter to " + storage[1].welcomeNum)
        fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => {	// Writes back to file.
            if (err) console.error(err)
        });

    }
	else if (message.content.toLowerCase() == "#botinfo" && message.author.id === config.ownerId) {
		let systemUptime = format(os.uptime())
		let processUptime = format(process.uptime())
		
        const embed = new Discord.RichEmbed()
            .setColor(`#0D47A1`)
            .setTitle(`ShadeBot V1.74 (Open Source update)`)
            .setURL('https://github.com/Alipoodle/shadebot-discord')
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
    else if (message.content.toLowerCase().startsWith("#roles add") && message.author.id === config.ownerId) {
		let args = message.content.split(' ').slice(1);
		
		if (!args[2] > 0) {
            return message.channel.send("Error, seems you haven't provided me with a roleid.")
        }
		if (!roles[args[1].toLowerCase()]) {
			message.channel.send(`Adding new role with Trigger "${args[1].toLowerCase()}" and role id "${args[2]}"`)
			roles[args[1].toLowerCase()] = args[2]
			fs.writeFile("./jsonStorage/roles.json", JSON.stringify(roles), (err) => {	// Writes back to file.
				if (err) console.error(err)
			});
		} else {
			message.channel.send("Replacing current role id for trigger.")
			roles[args[1].toLowerCase()] = args[2]
			fs.writeFile("./jsonStorage/roles.json", JSON.stringify(roles), (err) => {	// Writes back to file.
				if (err) console.error(err)
			});
		}
		
	}
	
    else if (message.content.startsWith("#mute") || message.content.startsWith("#m")) {
		if (!message.member.roles.has(config.roles.mod) && !message.member.roles.has(config.roles.admin)) {
			message.reply("Sorry but you cannot Mute people without the Moderator/Admin Role.")
			.then(function (message) {
				    setTimeout(() => message.delete(), autoMessageDelete)
				}).catch(function () {
				    console.log("Failed to auto delete message after time period")
				});
			return;
		}
		let args = message.content.split(' ').slice(1);
        let mentionedUser = message.mentions.users.first();
        let muteUser = message.guild.member(mentionedUser);
        let time = args[1]
		let logChannel = message.guild.channels.find('name', 'kick-ban-record');
		if (!logChannel) return;
		
        if (muteUser == null) {
            message.reply("At the moment I can only mute people by doing a mention of the user. ``#mute @USER (amount of time)``")
            return;
        }
		let amount = parseInt(time)
		
        if (time == null || time == "") {
            muteUser.addRole(`${config.roles.mute}`).catch(console.error);
			message.channel.send("Successfully added Mute to: " + muteUser.user.tag)
			if (message.channel.id != logChannel.id) {
				logChannel.send(`Successfully added Mute to: <@${muteUser.user.id}>\nPlease provide reason for mute:`)
			}
			return;
        } else {
			if (!amount > 0) {
				return message.reply("Sorry but i didn't understand the amount of time you wanted please do ``1hour`` or ``10m``")
			}
			
			time = time.toLowerCase()
            let currentDate = new Date();
            
			
            if (time.includes("h")) {
                resetTime = new Date(currentDate.setHours(currentDate.getHours() + amount))
				var timeMode = "Hour(s)"
            } else if (time.includes("m")) {
                resetTime = new Date(currentDate.setMinutes(currentDate.getMinutes() + amount))
				var timeMode = "Minute(s)"
            } else {
				return message.reply("Sorry but i didn't understand the amount of time you wanted please do ``1hour`` or ``10m``")
			}
			
			
			muteUser.addRole(`${config.roles.mute}`).catch(console.error);
			
			
			
			if (message.channel.id == logChannel.id) {
				message.channel.send(`Successfully added Mute to: ${muteUser.user.tag}\nMuted for: ${amount} ${timeMode} | UTC Time: ${resetTime.getHours()}:${resetTime.getMinutes()}`)
			} else {
				message.channel.send(`Successfully added Mute to: <@${muteUser.user.id}>`)
				logChannel.send(`Successfully added Mute to: <@${muteUser.user.id}>\nMuted for: ${amount} ${timeMode} | UTC Time: ${resetTime.getHours()}:${resetTime.getMinutes()}\nPlease provide reason for mute:`)
			}
			
			
        }

        //someDate.setHours(someDate.getHours()+1);
        //someDate.setMinutes(someDate.getMinutes()+1);
    }
	else if (message.content.toLowerCase().startsWith("#welcome")) {
		if (!message.member.roles.has(config.roles.mod) && !message.member.roles.has(config.roles.admin)) {
			return message.channel.send("Sorry but you cannot Mute people without the Moderator/Admin Role.")
		}
		
		if (welcomeOption == 1) {
			welcomeOption = 0
			message.author.send("Changing to welcoming in Default Room!")
			return;
		} else if (welcomeOption == 0) {
			welcomeOption = 1
			message.author.send("Changing to welcoming in Private Messages!")
			return;
		}
	}
	else if (message.content.toLowerCase().startsWith("#settings view")) {
		if (!message.member.roles.has(config.roles.mod) && !message.member.roles.has(config.roles.admin)) {
			message.channel.send("Sorry but you cannot view settings without the Moderator/Admin Role.")
				.then(function (message) { setTimeout(() => message.delete(), autoMessageDelete)})
				.catch(function () { console.log("Failed to auto delete message after time period")});
            return;
		}
		let mentionedChannel = message.mentions.channels.first()
		if (mentionedChannel == null){
			let id = message.channel.id
			message.channel.send(`**Current Channel permissions:\nInvites Allowed:** ${channels[id].invitesAllowed} | **Image Link Allowed:** ${channels[id].imageLink} | **Bot commands Allowed:** ${channels[id].botCommandsAllowed}\n**Reply Message Allowed:** ${channels[id].allowReplyMessages} | **Links Allowed:** ${channels[id].linksAllowed}`)
		} else {
			let id = mentionedChannel.id
			message.channel.send(`**<#${id}>'s permissions:\nInvites Allowed:** ${channels[id].invitesAllowed} | **Image Link Allowed:** ${channels[id].imageLink} | **Bot commands Allowed:** ${channels[id].botCommandsAllowed}\n**Reply Message Allowed:** ${channels[id].allowReplyMessages} | **Links Allowed:** ${channels[id].linksAllowed}`)
		}
		
	}
	else if (message.content.toLowerCase().startsWith("#settings edit")) {
		if (!message.member.roles.has(config.roles.mod) && !message.member.roles.has(config.roles.admin)) {
			message.channel.send("Sorry but you cannot edit settings without the Moderator/Admin Role.")
				.then(function (message) { setTimeout(() => message.delete(), autoMessageDelete)})
				.catch(function () { console.log("Failed to auto delete message after time period")});
            return;
		}
		
		let id = message.channel.id
		let args = message.content.toLowerCase().split(' ').slice(2);
		
		let trueFalse
		if (args[1] == "true" || args[1] == "t" || args[2] == "true" || args[2] == "t") {
			trueFalse = "true"
		} else if (args[1] == "false" || args[1] == "f" || args[2] == "false" || args[2] == "f") {
			trueFalse = "false"
		} else {
			message.channel.send("Please use **true / false** to set a channel permission. `#settings edit (Permissions) [true/false]`")
				.then(function (message) { setTimeout(() => message.delete(), autoMessageDelete)})
				.catch(function () { console.log("Failed to auto delete message after time period")});
            return;
		}

		if (args[0].includes("invite") || args[1].includes("invite")) {
			channels[id].inviteAllowed = trueFalse
			message.reply(`Successfully changed **allowing of invites** in <#${message.channel.id}> to **${trueFalse}**`)
		} else if (args[0].includes("image") || args[1].includes("image")) {
			channels[id].imageLink = trueFalse
			message.reply(`Successfully changed **allowing of image Image Links** in <#${message.channel.id}> to **${trueFalse}**`)
		} else if (args[0].includes("command") || args[1].includes("command")) {
			channels[id].imageLink = trueFalse
			message.reply(`Successfully changed **allowing of bot commands** in <#${message.channel.id}> to **${trueFalse}**`)
		} else if (args[0].includes("reply") || args[1].includes("reply")) {
			channels[id].allowReplyMessages = trueFalse
			message.reply(`Successfully changed **allowing of reply messages** in <#${message.channel.id}> to **${trueFalse}**`)
		} else if (args[0].includes("link") || args[1].includes("link")) {
			channels[id].linksAllowed = trueFalse
			message.reply(`Successfully changed **allowing of links** in <#${message.channel.id}> to **${trueFalse}**`)
		} else {
			message.channel.send("Failed to see what permission you are trying to change! `invite` `image` `commands` `reply` `links`")
				.then(function (message) { setTimeout(() => message.delete(), autoMessageDelete)})
				.catch(function () { console.log("Failed to auto delete message after time period")});
		}
	}
	else if (message.content.toLowerCase().startsWith("#roles ban")) {
		// #roles ban @MENTION role
		if (!message.member.roles.has(config.roles.mod) && !message.member.roles.has(config.roles.admin)) {	return message.reply("Sorry but you cannot Mute people without the Moderator/Admin Role.") }
		let args = message.content.toLowerCase().split(' ').slice(2);
        let mentionedUser = message.mentions.users.first();
        //let roleBanUser = message.guild.member(mentionedUser);
		if (mentionedUser == null) {
            message.reply("Currently I can only find people by mentioning them. `#roles ban @MENTION role`")
			.then(function (message) {
			    setTimeout(() => message.delete(), autoMessageDelete)
			}).catch(function () {
			    console.log("Failed to auto delete message after time period")
			});
            return;
			
        }
		addRoleBan(mentionedUser.id)
		
		var banRoleId
		for (i = 1; i < args.length; i++) {
				if(roles[args[i]]) {
					banRoleId = roles[args[i]]
				}
		}
		if (banRoleId) {
			rolesBan[mentionedUser.id].push(`${banRoleId}`)
			let roleName = message.guild.roles.find('id', banRoleId);
			message.reply(`Successfully banned <@${mentionedUser.id}> from adding the role ${roleName.name}`);
		
			fs.writeFile("./jsonStorage/rolesBan.json", JSON.stringify(rolesBan), (err) => {	// Writes back to file.
				if (err) console.error(err)
			});
		} else {
			message.channel.send("Sorry but I could not find a role the role you are looking for!")
			.then(function (message) {
				    setTimeout(() => message.delete(), autoMessageDelete)
				}).catch(function () {
				    console.log("Failed to auto delete message after time period")
				});
		}
	}
	else if (message.content.toLowerCase().startsWith("#roles unban")) {
		// #roles ban @MENTION role
		if (!message.member.roles.has(config.roles.mod) && !message.member.roles.has(config.roles.admin)) {	return message.reply("Sorry but you cannot Mute people without the Moderator/Admin Role.") }
		let args = message.content.toLowerCase().split(' ').slice(2);
        let mentionedUser = message.mentions.users.first();
        //let roleBanUser = message.guild.member(mentionedUser);
		if (mentionedUser == null) {
            message.reply("Currently I can only find people by mentioning them. `#roles ban @MENTION role`")
			.then(function (message) {
			    setTimeout(() => message.delete(), autoMessageDelete)
			}).catch(function () {
			    console.log("Failed to auto delete message after time period")
			});
            return;
			
        }
		addRoleBan(mentionedUser.id)
		
		var banRoleId
		for (i = 1; i < args.length; i++) {
				if(roles[args[i]]) {
					banRoleId = roles[args[i]]
				}
		}
		
		if (banRoleId) {
			let roleName = message.guild.roles.find('id', banRoleId);
			if (rolesBan[mentionedUser.id].indexOf(banRoleId) == -1) {
				message.channel.send(`<@${mentionedUser.id}> is currently not banned from being given the role ${roleName.name}`)
			}
			else {
				rolesBan[mentionedUser.id].splice(rolesBan[mentionedUser.id].indexOf(banRoleId), 1);
				
				message.reply(`Successfully unbanned <@${mentionedUser.id}> from adding the role ${roleName.name}`);
		
				fs.writeFile("./jsonStorage/rolesBan.json", JSON.stringify(rolesBan), (err) => {	// Writes back to file.
					if (err) console.error(err)
				});
			}
		} else {
			message.channel.send("Sorry but I could not find a role the role you are looking for!")
			.then(function (message) {
				    setTimeout(() => message.delete(), autoMessageDelete)
				}).catch(function () {
				    console.log("Failed to auto delete message after time period")
				});
		}
	}
	
	else if (message.content.toLowerCase().startsWith("#points add") || message.content.toLowerCase().startsWith("#p add") && (message.channel.id == "333620436296531978" || message.channel.id == "208311597284720640" || message.channel.id == "169551601047044096")) {
	    let eventTeam = message.guild.roles.find('name', 'Otaku (Event Team)');
	    if (message.member.roles.has(eventTeam.id)) {
	        // #points add @mention numPoints reason

            let mentionedUser = message.mentions.users.first();
            let addUser = message.guild.member(mentionedUser);

            if (addUser == null) {
				message.reply("At the moment I can only add points to people by doing a mention of the user. ``#points add @USER (amount) (reason)``")
				.then(function (message) {
				    setTimeout(() => message.delete(), autoMessageDelete)
				}).catch(function () {
				    console.log("Failed to auto delete message after time period")
				});
				return;
			} else {
			var addID = addUser.id
			}

            addToDatabase(addID);

            let userData = storage[addID];	// makes easier to access

            let args = message.content.split(' ').slice(2);
			let numPoints = parseInt(args[1])
			let reasonPoints = message.content.split(/\s+/g).slice(4).join(" ");
			
			if (!numPoints > 0 || numPoints == null) {
				message.channel.send("Please provide a valid amount of points.")
				.then(function (message) {
				    setTimeout(() => message.delete(), autoMessageDelete)
				}).catch(function () {
				    console.log("Failed to auto delete message after time period")
				});
				return
			}
			if (reasonPoints == "" || reasonPoints == null) {
				message.channel.send("Please provide a reason for adding of points...\n**DO NOT ADD POINTS RANDOMLY.** This may lead to being removed from the team, and stripped of all points")
				.then(function (message) {
				    setTimeout(() => message.delete(), autoMessageDelete)
				}).catch(function () {
				    console.log("Failed to auto delete message after time period")
				});
				return 
			}

            const logChannel = message.guild.channels.find('id', config.logId);
            logChannel.send(`<@${message.author.id}> has added ${numPoints} points to <@${addID}>'s Account\nReason: ${reasonPoints}`);
            userData.points += numPoints

            let embed = {
                "description": "💡 Sucessfully added `" + numPoints + " ` Points to " + mentionedUser.tag + "'s account!",
                "color": 10090000,
                "footer": {
                    "icon_url": `${message.author.displayAvatarURL}`,
                    "text": `${message.author.tag}`
                }
            };
            message.channel.send({ embed });

            fs.writeFile("./jsonStorage/storage.json", JSON.stringify(storage), (err) => {	// Writes back to file.
                if (err) console.error(err)
            });
        } else {
            message.reply("Sorry, but you cannot add points, you need to be in the Otaku (Event Team) to do so!")
				.then(function (message) {
                setTimeout(() => message.delete(), autoMessageDelete)
            }).catch(function () {
                console.log("Failed to auto delete message after time period")
            });
        }
    }
    else if ((message.content.startsWith("#points bal") || message.content.startsWith("#p bal") || message.content.startsWith("#p money") || message.content.startsWith("#points money")) && (message.channel.id == "333620436296531978" || message.channel.id == "208311597284720640" || message.channel.id == "169551601047044096")) {
        let mentionedUser = message.mentions.users.first();
        let balAccount = message.guild.member(mentionedUser);

        if (balAccount == null) {
            var balID = message.author.id
            var balTag = message.author.tag
			var balPFP = message.author.displayAvatarURL
        } else {
            var balID = balAccount.id
            var balTag = balAccount.user.tag
			var balPFP = balAccount.user.displayAvatarURL
			
        }

        addToDatabase(balID);
        let userData = storage[balID];	// makes easier to access

        let balEmbed = new Discord.RichEmbed()
                .setDescription(`💰 You currently have ${userData.points} points`)
                .setColor("#004D40")
                .setFooter(balTag, balPFP);
        message.channel.sendEmbed(balEmbed)
    }

	else if (message.content.toLowerCase() === ("#help") && (channels[message.channel.id].botCommandsAllowed == "true")) {
		const embed = new Discord.RichEmbed()
            .setColor(`#0D47A1`)
            .setTitle(`ShadeBot V1.63 (Events update)`)
            .setURL('https://github.com/Alipoodle/shadebot-discord')
			.setDescription("Hello, I am Shadebot, the server's servant. I was made by <@183931930935427073>\n**If you are looking for specific help; most commands will have better help if you just post the command without any of the arguments!**\n\n**You can find the current commands below:**")
            .addField('#daily', 'This allows you to pick up a small amount of money every 24 hours!', true)
			.addField('#send (@mentions)', "Send a bit of money to a friend (Although there's 10% tax)", true)
			.addField('#bal [@mentions]', "Check the amount of money, you or a friend has.", true)
            .addField('#roulette (black, red, green) (amount)', "Spend some of your money on standard Roulette, Play risky and go for Green to get 14x back or safe with Black and Red and get 1.5x back", true)
            .addField('#luckydip (amount)', "Pick out a random object, you have a change to gain more money or lose little bits. But the Risk is all yours!", true)
            .addField('#image (link)', 'Once you hit Legendary Weeb you can post images in <#153951788163137536>, this will allow you to post linked images.', true)
			.addField('#flip & #unflip', "Tired of Discord's simple table flip? Well now you can flip more tables (*and people*)", true)
            .setFooter('Created by Alipoodle#5025', 'https://alipoodle.me/small.gif');

        message.author.send({ embed });
	}
	
	
        // Random Text based Commands.
        // ILY Bot, Little random thing i though i should add to the bot!
    else if (message.content.toLowerCase().includes("ily") && message.content.toLowerCase().includes("shadebot") && message.author.id === config.ownerId) {
        message.channel.send("💬 Love you toooo! <:AliMercyHeart2:326076862503845890> <:AliMercyHeart:306055342490517506>")
    }
	
    if (messageTaken == true && channels[message.channel.id].allowReplyMessages == "true") {
        if (message.content.toLowerCase().includes("ily") && message.content.toLowerCase().includes("shadebot") && message.author.id != config.ownerId) { // Alipoodle's command
            message.channel.send("💬 Sorry I'm taken 😘")
        } else if (message.content.toLowerCase().includes("shadebitch") || message.content.toLowerCase().includes("shadebetch")) {	// Community Command
			let random = Math.floor(Math.random() * 10);
			if (random < 3) { message.channel.send("💬 Bitch... That ain't my name and you know it. "); } 
			else { message.channel.send("💬 That's not my name... Plz No Bully me <:ShadeBotRude:326816154083393536>"); }
        } else if (message.content.toLowerCase().includes("shadebot-sama") && message.author.id === "193371641848266752") {		// Lenny's Custom Command
            message.channel.send("💬 Y-yes Lenny-chan? >w< *nuzzles nosey*")
        } else if (message.content.toLowerCase().includes("goodbot") && message.author.id === "241593793579712512") {			// Rufy's Custom Command
            message.channel.send("💬 Yes Rufy-kun! *hhhhhh* I'll be a good girl... *groans as i stare at his buldge*");
        } else if (message.content.toLowerCase().includes("goodbot") && message.author.id != "241593793579712512") {
            message.channel.send("💬 I'm only Rufy's *hisses and runs to Rufy's heels* Away with you!")
        } else if (message.content.toLowerCase() === "ali doesn't have") {														// Community Command
            message.delete();
            message.channel.send("💬 **News Flash**\n**Alipoodle** does not have the Witch skin for the character called Mercy in the game Overwatch. <:AliMercyWitch:306055344180690945>\nPress 'F' to pay respects.");
        } else if (message.content.toLowerCase().includes("send nudes")) {														// Community Command
            message.channel.send("💬 Give them to me too thanks 😘");
        } else if (message.content.toLowerCase().includes("luvbug") && message.author.id === "183800599945412610") {			// Auroa's Command
            message.channel.send("💬 gwizzy is your little luvbug auro~ (🌸  ՞ゥ ՞)ゞ﻿")
        } else if (message.content.toLowerCase().includes("shadebutt") && message.author.id === "108291699171659776") {			// Rizako's Command
            message.channel.send("💬 Put it in Riz-sensei <:ShadeBottriGasm:326816756494761996>"); //
            if (message.channel.id === "153958699872813056") {
                let nsfwFile = "https://i.imgur.com/IEREMnK.png";
                message.channel.sendFile(nsfwFile);
			}
        } else if (message.content.toLowerCase().includes("shadebutt") && message.author.id != "108291699171659776") {
            message.channel.send("💬 I'm sorry, but that's only for Rizako 😉")
        } else if (message.content.toLowerCase() === ("damn") && message.author.id === "111911375269330944") {					// Grizz's Command
            message.channel.send("💬 daniel")
        } else if (message.content.toLowerCase().includes("cross on your forehead")) {											// Winter / Fuyu's Command
            message.channel.send("💬 issa knife <:henIssa:313794938875936769>")
        } else if (message.content.toLowerCase().includes("daddy") && message.content.toLowerCase().includes("harder")) {		// Community command
            message.channel.send("💬 Please... give it to me as well! <:AliMercyGasm:274887600932913162>")
        } else if (message.content === ("(╯°□°）╯︵ ┻━┻") || message.content.toLowerCase() === ("#unflip")) {				    // Random Command
            var unflipMessage = unflip[Math.floor(Math.random() * unflip.length)];
            message.channel.send(unflipMessage)
        } else if (message.content.toLowerCase() === ("#flip")) {																// Random Command
            var flipMessage = tableFlip[Math.floor(Math.random() * tableFlip.length)];
            message.channel.send(flipMessage)
        }

        else return;
		messageTaken = false;
    }
});

/*
client.on('guildMemberAdd', async member => {
});
client.on('guildMemberRemove', async member => {
});
client.on('messageReactionAdd', (reaction, user) => {
  if (reaction.message.channel.id !== '222086648706498562') return;
  reaction.message.channel.send(`${user.username} added reaction ${reaction.emoji}, count is now ${reaction.count}`);
});
client.on('messageReactionRemove', (reaction, user) => {
  if (reaction.message.channel.id !== '222086648706498562') return;
  reaction.message.channel.send(`${user.username} removed reaction ${reaction.emoji}, count is now ${reaction.count}`);
});
client.on("presenceUpdate", (oldMember, newMember) => {
	
});
*/
client.on("guildBanAdd", (guild, user) => {
	console.log(`${getTime()}: ${user.tag} (id: ${user.id}) has been banned from the server ${guild.name}`)
	const logChannel = guild.channels.find('name', 'kick-ban-record');
    if (!logChannel) return;
    logChannel.send(`${getTime()}: ${user.tag} (id: ${user.id}) has been banned from the server\nPlease provide needed information for why you have banned the user:`);
	
});

client.on("guildBanRemove", (guild, user) => {
	console.log(`${getTime()}: ${user.tag} (id: ${user.id}) has been unbanned from the server ${guild.name}`)
	const logChannel = guild.channels.find('name', 'kick-ban-record');
    if (!logChannel) return;
    logChannel.send(`${getTime()}: ${user.tag} (id: ${user.id}) has been unbanned from the server!`);
	
});

client.on("guildCreate", guild => console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`));
client.on("guildDelete", guild => console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`));
client.on("error", (e) => console.error("Error: " + e));
client.on("warn", (e) => console.warn("Warning: " + e));

// !msg.guild.member(client.user).hasPermission("BAN_MEMBERS")

client.login(config.token);