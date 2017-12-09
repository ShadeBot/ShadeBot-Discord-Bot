const Discord = require('discord.js');

exports.run = (client, message, args) => {
    if (!message.guild.channels.some(r=>client.config.points.channels.includes(r.id))) return;

    if (args[0] == "add" && message.member.roles.some(r=>client.config.points.addRoles.includes(r.id))) {
        let mentionedUser = message.mentions.users.first();
        let numPoints = parseInt(args[2], 10)
        let reasonPoints = message.content.split(/\s+/g).slice(4).join(" ");
    
        if (!mentionedUser) 
            return message.reply("At the moment I can only add points to people by doing a mention of the user. ``#points add @USER (amount) (reason)``")
                .then(function (message) { setTimeout(() => message.delete(), client.config.messageTimeout)})
        if (!numPoints)
            return message.channel.send("Please provide a valid amount of points.")
                .then(function (message) { setTimeout(() => message.delete(), client.config.messageTimeout)})
        if (!reasonPoints) 
            return message.channel.send("Please provide a reason for adding of points...\n**DO NOT ADD POINTS RANDOMLY.** This may lead to being removed from the team, and stripped of all points")
                .then(function (message) { setTimeout(() => message.delete(), client.config.messageTimeout)})

        if (numPoints > 100 && client.config.ownerId.indexOf(msg.author.id) == -1)
            return message.channel.send("Sorry you seem to be trying to add more than 100 points. Only the Owner of the Bot can do this!") 
    
        client.addToDatabase(mentionedUser.id);
        let userData = client.storage[mentionedUser.id];
        userData.points += numPoints

        let pointsEmbed = new Discord.MessageEmbed()
            .setDescription(`💡 Sucessfully added \`${numPoints}\` Points to ${mentionedUser.tag}'s account!`)
            .setColor("#99f610")
            .setFooter(message.author.tag, message.author.displayAvatarURL())
        message.channel.send({ embed: pointsEmbed });
    
        client.messageLog(message, `<@${message.author.id}> has added ${numPoints} points to <@${mentionedUser.id}>'s Account\nReason: ${reasonPoints}`)
        client.saveFile('s');
    }

    else if (args[0] == "bal") {
        let balAccount = message.mentions.users.first();
        if (!balAccount) var balinfo = [message.author.id, message.author.tag, message.author.displayAvatarURL()]
        else var balinfo = [balAccount.id, balAccount.tag, balAccount.displayAvatarURL()]

        client.addToDatabase(balinfo[0]);
        let userData = client.storage[balinfo[0]];

        let balEmbed = new Discord.MessageEmbed()
            .setDescription(`💰 You currently have ${userData.points} points`)
            .setColor("#004D40")
            .setFooter(balinfo[1], balinfo[2]);
        message.channel.send({ embed: balEmbed })
    }
};
    
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['point'],
    cat: "fun"
};
    
exports.help = {
    name: 'points',
    description: 'Add or view how many points people have.',
    usage: 'points bal [@user] | points add (@user) (amount of points) (reason for points)'
};