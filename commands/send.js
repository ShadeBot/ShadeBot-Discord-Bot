const Discord = require('discord.js');

exports.run = (client, message, args) => {
    if (client.channelperms.botCommandsAllowed.indexOf(message.channel.id) == -1) return;
    let mentionedUser = message.mentions.users.first();
    let numMoney = parseInt(args[1]);
    client.addToDatabase(message.author.id);
    let userDataS = client.storage[message.author.id]
    
    if (!numMoney)
        return message.reply("At the moment I can only send money by doing a mention of the user. ``" + client.config.prefix + "send @USER 100``")
            .then(function (message) { setTimeout(() => message.delete(), client.config.messageTimeout)})
    else if (!mentionedUser)
        return message.reply("At the moment I can only send money by doing a mention of the user. ``" + client.config.prefix + "send @USER 100``")
            .then(function (message) { setTimeout(() => message.delete(), client.config.messageTimeout)})
    else if (userDataS.money < numMoney)
        return message.reply("Sorry. You don't have enough money in your account to give!")
        .then(function (message) { setTimeout(() => message.delete(), client.config.messageTimeout)})
    
    client.loseMoney(numMoney, userDataS)
    let send1Embed = new Discord.MessageEmbed()
        .setDescription(`💵 Removed \`${numMoney}\` ShadeBucks to your account!`)
        .setColor("#9a1d18")
        .setFooter(message.author.tag, message.author.displayAvatarURL());
    message.channel.send({ embed: send1Embed });
    client.addToDatabase(mentionedUser.id);
    let userDataR = client.storage[mentionedUser.id];
    client.addMoney(parseInt(numMoney * 0.9), userDataR);
    
    let send2Embed = new Discord.MessageEmbed()
        .setDescription(`💵 Sucessfully added \`${parseInt(numMoney * 0.9)}\` ShadeBucks to your account!\n*10% Tax has been removed from the money*`)
        .setColor("#FAA61A")
        .setFooter(mentionedUser.tag, mentionedUser.displayAvatarURL());
    message.channel.send({ embed: send2Embed })
    
    client.saveFile("s");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  cat: "economy"
};

exports.help = {
  name: 'send',
  description: 'Send ShadeBucks to another user. (10% tax)',
  usage: 'send (@user) (amount)'
};