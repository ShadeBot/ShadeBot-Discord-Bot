const fs = require("fs");

exports.run = (client, message, args) => {
    if (args[0] == "add" && client.config.ownerId.indexOf(message.author.id) != -1) {
        let roleId = parseInt(args[2])
        if (!roleId) return message.channel.send("Seems like you haven't provided me with a valid Role ID");
        // roles add trigger id
        if (!client.roles[args[1]]) message.channel.send(`Adding new role with Trigger: "${args[1]}" RoleID: "${args[2]}"`);
        else message.channel.send("Replacing current role id for trigger.");
        
        client.roles[args[1]] = args[2]
        client.saveFile("r")
    }
    
    else if (args[0] == "ban" && message.member.roles.some(r=>client.config.staffRoles.includes(r.id))) {
        let mentionedUser = message.mentions.users.first();
        if (!mentionedUser) return message.reply("Currently I can only find people by mentioning them. `" + client.config.prefix + "roles ban @MENTION role`")
            .then(function (message) { setTimeout(() => message.delete(), client.config.messageTimeout)})
            .catch(function () { messagefail});
        client.addRoleBan(mentionedUser.id)
        
        var banRoleId
        for (i = 2; i < args.length; i++) {
            if(client.roles[args[i].toLowerCase()])
                banRoleId = client.roles[args[i].toLowerCase()]
        }
        
        if (banRoleId) {
            let roleName = message.guild.roles.find('id', banRoleId);
            if (client.rolesBan[mentionedUser.id].indexOf(banRoleId) != -1) return message.reply("User is already banned from " + roleName.name)
            
            client.rolesBan[mentionedUser.id].push(`${banRoleId}`)
            message.reply(`Successfully banned <@${mentionedUser.id}> from adding the role ${roleName.name}`);
            client.saveFile("rb")
        } else {
            message.channel.send("Sorry but I could not find a role the role you are looking for!")
                .then(function (message) { setTimeout(() => message.delete(), client.config.messageTimeout)})
                .catch(function () { messagefail});
        }
    }
    
    else if (args[0] == "unban" && message.member.roles.some(r=>client.config.staffRoles.includes(r.id))) {
        let mentionedUser = message.mentions.users.first();
        if (!mentionedUser) return message.reply("Currently I can only find people by mentioning them. `" + client.config.prefix + "roles ban @MENTION role`")
            .then(function (message) { setTimeout(() => message.delete(), client.config.messageTimeout)})
            .catch(function () { messagefail});
        client.addRoleBan(mentionedUser.id)
        
        var banRoleId
        for (i = 2; i < args.length; i++) {
            if(client.roles[args[i].toLowerCase()])
                banRoleId = client.roles[args[i].toLowerCase()]
        }
        
        if (banRoleId) {
            let roleName = message.guild.roles.find('id', banRoleId);
            if (client.rolesBan[mentionedUser.id].indexOf(banRoleId) == -1) return message.reply("User isn't banned from " + roleName.name)
            
            client.rolesBan[mentionedUser.id].splice(client.rolesBan[mentionedUser.id].indexOf(banRoleId), 1);
            message.reply(`Successfully unbanned <@${mentionedUser.id}> from adding the role ${roleName.name}`);
            client.saveFile("rb")
        } else {
            message.channel.send("Sorry but I could not find a role the role you are looking for!")
                .then(function (message) { setTimeout(() => message.delete(), client.config.messageTimeout)})
                .catch(function () { messagefail});
        }
    }
};
    
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    cat: "moderation"
};
    
exports.help = {
    name: 'roles',
    description: 'Unban/ban or adds a Self-assignable role.',
    usage: 'roles unban/ban (@user) (role) | roles add (trigger) (roleId)'
};