const { WebhookClient } = require("discord.js");
const { promisify, inspect } = require('util');
const chalk = require('chalk'); //https://www.npmjs.com/package/chalk#styles
const fs = require("fs");

module.exports = (client) => {
  global.wait = promisify(setTimeout);

  global.range = (count, start = 0) => {
    const myArr = [];
    for(var i = 0; i<count; i++) {
      myArr[i] = i+start;
    }
    return myArr;
  };

  global.chalk = chalk;
  
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m=>m.author.id = msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first().content;
    } catch(e) {
      return false;
    }
  };

  client.answer = (msg, contents, options = {}) => {
    options.delay =  (options.delay || 2000);
    if(msg.flags.includes("delme")) options.deleteAfter = true;
    options.deleteAfter = (options.deleteAfter || false);
    msg.edit(contents);
    if(options.deleteAfter) msg.delete({timeout: options.delay});
  };
  
  client.clean = (text) => {
    if (typeof text !== 'string')
      text = inspect(text, {depth: 0})
    text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203))
        .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");
    return text;
  };
  
  client.conlog = (message) => {
	  currTime = new Date().toLocaleTimeString()
	  if (currTime.length > 7) {
		  console.log(chalk.reset.cyan(`${currTime} : `) + chalk.cyan.bold(message))
	  } else {
		  console.log(chalk.reset.cyan(` ${currTime} : `) + chalk.cyan.bold(message))
	  }
  }

  client.addMoney = (money, userData) => {
    userData.money += money;
    userData.total += money;
  }
  client.loseMoney = (money, userData) => {
    userData.money = parseInt(userData.money - money);
  }

  client.banRole = (userId, roleId) => {
    if (!client.rolesBan[userId]) { return false;}
    if (client.rolesBan[userId].indexOf(roleId) == -1) { return false; } 
    else { return true; }
  }
  client.addRoleBan = (id) => {
    if (!client.rolesBan[id]) {
      client.rolesBan[id] = []
      client.saveFile("rb")
    }
  }
  client.addToDatabase = (id) => {
    if (!client.storage[id]) {
      client.storage[id] = { // Add's info to the database if there's nothing for the user.
        money: 0,
        reset: 0,
        total: 0,
        points: 0
      }
      client.storage[1].users += 1
      client.saveFile("s")
    }
  }
  client.addRoomDatabase = (message) => {
    let id = message.channel.id
    if (client.channelperms.inDatabase.indexOf(id) == -1) {
      client.channelperms.inDatabase.push(`${id}`)
      client.channelperms.linksAllowed.push(`${id}`)
    
      message.channel.send("This is the first time I've seen this room! I will apply the automatic configuration for a channel, if you would like to change anything in this channel do `#settings edit`:\n\n`Invites Allowed: false` | `Image Link Allowed: false` | `Bot commands Allowed: false` | `Reply Message Allowed: false` | `Links Allowed: true`")
      
      client.saveFile("cp")
    }
  }
  client.saveFile = (file) => {
    let location
    let variable
    if (file == "cp") { location = "channels"; variable = client.channelperms;}
    if (file == "n") { location = "nsfw"; variable = client.nsfw;}
    if (file == "re") { location = "reply"; variable = client.reply;}
    if (file == "r") { location = "roles"; variable = client.roles;}
    if (file == "rb") { location = "rolesBan"; variable = client.rolesBan;}
    if (file == "rc") { location = "rolesCheck"; variable = client.rolesCheck;}
    if (file == "s") { location = "storage"; variable = client.storage;}
    fs.writeFile(`./jsonStorage/${location}.json`, JSON.stringify(variable), (err) => {	if (err) console.error(err) });
  }
  client.addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  client.messageLog = (message, content, room = client.config.log.channelId) => {
	const logChannel = client.channels.get(room)
	if (!logChannel) return console.log(chalk.redBright("Log Channel doesn't exist!!"));
	// Need to test if this works for Embed and text.
	logChannel.send(content)
  }
  
  client.findMember = (message, userText) => {
    if (!userText) {
      return message.member
    }
    else {
      let member = message.mentions.members.first() || message.guild.members.filter(m => m.displayName.toLowerCase() == userText).first() || message.guild.members.filter(m => m.user.username.toLowerCase() == userText).first() || message.guild.members.find('id', userText) || message.guild.members.filter(m => m.displayName.toLowerCase().indexOf(userText) != -1).first() || message.guild.members.filter(m => m.user.username.toLowerCase().indexOf(userText) != -1).first()
      return member
    }
  }

  

  process.on('uncaughtException', (err) => {
    let errorMsg = err.stack.replace(new RegExp(`${__dirname}\/`, 'g'), './');
    console.error("Uncaught Exception: ", errorMsg);
  });
  
  process.on("unhandledRejection", err => {
    console.log("Uncaught Promise Error: ", err);
  });
};
