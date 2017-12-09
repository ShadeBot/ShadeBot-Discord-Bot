function upFirst(string) { return string.charAt(0).toUpperCase() + string.slice(1); }

exports.run = (client, message, args) => {
    if (args[0] == "edit" && client.config.ownerId.indexOf(message.author.id) != -1) {
        let mentionedChannel = message.mentions.channels.first()
        if (mentionedChannel == null) { var id = message.channel.id	}
        else { var id = mentionedChannel.id }
        
        if (message.content.toLowerCase().indexOf("true") != -1) {
            if (message.content.toLowerCase().indexOf("invite") != -1) {
                if (client.channelperms.invitesAllowed.indexOf(id) != -1) message.reply("Invites are already allowed in <#" + id + ">");
                else { client.channelperms.invitesAllowed.push(id); message.reply("Invites are now allowed in <#" + id + ">") }
            } else if (message.content.toLowerCase().indexOf("image") != -1) {
                if (client.channelperms.imageLinkAllowed.indexOf(id) != -1) message.reply("Image links are already allowed in <#" + id + ">")
                else { client.channelperms.imageLinkAllowed.push(id); message.reply("Image Links are now allowed in <#" + id + ">")}
            } else if (message.content.toLowerCase().indexOf("command") != -1) {
                if (client.channelperms.botCommandsAllowed.indexOf(id) != -1) message.reply("Bot commands are already allowed in <#" + id + ">")
                else { client.channelperms.botCommandsAllowed.push(id); message.reply("Bot commands are now allowed in <#" + id + ">")}
            } else if (message.content.toLowerCase().indexOf("reply") != -1) {
                if (client.channelperms.replyMessagesAllowed.indexOf(id) != -1) message.reply("Reply message are already allowed in <#" + id + ">")
                else { client.channelperms.replyMessagesAllowed.push(id); message.reply("Reply message are now allowed in <#" + id + ">")}
            } else if (message.content.toLowerCase().indexOf("link") != -1) {
                if (client.channelperms.linksAllowed.indexOf(id) != -1) message.reply("Links are already allowed in <#" + id + ">")
                else { client.channelperms.linksAllowed.push(id); message.reply("Links are now allowed in <#" + id + ">")}
            }
        } else if (message.content.toLowerCase().indexOf("false") != -1) {
            if (message.content.toLowerCase().indexOf("invite") != -1) {
                if (client.channelperms.invitesAllowed.indexOf(id) == -1) message.reply("Invites are already disabled in <#" + id + ">")
                else { client.channelperms.invitesAllowed.splice(client.channelperms.invitesAllowed.indexOf(id), 1); message.reply("Invites are now disabled in <#" + id + ">")}
            } else if (message.content.toLowerCase().indexOf("image") != -1) {
                if (client.channelperms.imageLinkAllowed.indexOf(id) == -1) message.reply("Image links are already disabled in <#" + id + ">")
                else { client.channelperms.imageLinkAllowed.splice(client.channelperms.imageLinkAllowed.indexOf(id), 1); message.reply("Image Links are now disabled in <#" + id + ">")}
            } else if (message.content.toLowerCase().indexOf("command") != -1) {
                if (client.channelperms.botCommandsAllowed.indexOf(id) == -1) message.reply("Bot commands are already disabled in <#" + id + ">")
                else { client.channelperms.botCommandsAllowed.splice(client.channelperms.botCommandsAllowed.indexOf(id), 1); message.reply("Bot commands are now disabled in <#" + id + ">")}
            } else if (message.content.toLowerCase().indexOf("reply") != -1) {
                if (client.channelperms.replyMessagesAllowed.indexOf(id) == -1) message.reply("Reply message are already disabled in <#" + id + ">")
                else { client.channelperms.replyMessagesAllowed.splice(client.channelperms.replyMessagesAllowed.indexOf(id), 1); message.reply("Reply message are now disabled in <#" + id + ">")}
            } else if (message.content.toLowerCase().indexOf("link") != -1) {
                if (client.channelperms.linksAllowed.indexOf(id) == -1) message.reply("Links are already disabled in <#" + id + ">")
                else { client.channelperms.linksAllowed.splice(client.channelperms.linksAllowed.indexOf(id), 1); message.reply("Links are now disabled in <#" + id + ">")}
            }
        }
        client.saveFile("cp")
        
    }

    else if (args[0] == "view" && message.member.roles.some(r=>client.config.staffRoles.includes(r.id))) {
        let mentionedChannel = message.mentions.channels.first()
        if (mentionedChannel == null) { var chanid = message.channel.id	}
        else { var chanid = mentionedChannel.id }
        
        var mess = `Permissions for channel <#${chanid}>:\n\`\`\`patch\n`;
        var trueMess = "";
        var falseMess = "";
        var settingsArray = []
        for (var key in client.channelperms) {
            if (client.channelperms.hasOwnProperty(key)) {
                let name = key.replace(/([a-z])([A-Z])/g, '$1 $2');
                settingsArray.push(name);
            }
        }
        const longest = settingsArray.reduce((long, str) => Math.max(long, str.length), 0);
        for (var key in client.channelperms) {
            if (client.channelperms.hasOwnProperty(key)) {
                let name = key.replace(/([a-z])([A-Z])/g, '$1 $2');
                if (client.channelperms[key].indexOf(chanid) != -1) trueMess += `\n+ ${upFirst(name)}${' '.repeat(longest - name.length)} : true`
                else falseMess += `\n- ${upFirst(name)}${' '.repeat(longest - name.length)} : false`
            }
        }
        mess += trueMess + falseMess + "\n```"
        message.channel.send(mess)
    }
};
    
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['sett'],
    cat: "moderation"
};
    
exports.help = {
    name: 'settings',
    description: 'Change Shadebot\'s permissions for a specific room',
    usage: 'settings view (#channel) | settings edit (invite/image/command/reply/link) (true/false) [#channel]'
};