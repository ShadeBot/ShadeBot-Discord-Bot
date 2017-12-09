const Discord = require('discord.js');
const moment = require("moment");

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
}

exports.run = (client, message, args) => {
    if (client.channelperms.botCommandsAllowed.indexOf(message.channel.id) == -1) return;

    let roleText = args.join(" ").toLowerCase()
    
    if (!roleText) {
        const embed = new Discord.MessageEmbed()
            .setColor(0xFFFFFF)
            .setTitle("Roles")
            .setDescription(`${message.guild.roles.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).join(" **|** ") || "No Roles"}`, true)

        message.channel.send({embed});
    } else {
        let role = message.guild.roles.filter(m => m.name.toLowerCase() == roleText).first() || message.guild.roles.find('id', args[0]) || message.guild.roles.filter(m => m.name.toLowerCase().indexOf(roleText) != -1).first();
        const presences = role.members.map(st => st.presence.status)
        var onlineMembers = 0;
        for (let i in presences) {
            if (presences[i] !== 'offline') {
                onlineMembers++
            }
        }
    
        const embed = new Discord.MessageEmbed()
            .setColor(role.hexColor)
            .addField("Name", role.name, true)
            .addField("ID", role.id, true)
            .addField("Created At", `${moment.utc(role.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")} UTC`, false)
            .addField("Color", `Hex: ${role.hexColor}\nRGB: ${hexToRgb(role.hexColor)}`, true)
            .addField("Members", `Total: ${role.members.size}\nOnline: ${onlineMembers}` , true)
            .addField("Position", `${message.guild.roles.size - role.position} out of ${message.guild.roles.size}\nHoisted: ${role.hoist}`, true)
        message.channel.send({embed});
    }

    
       
    

};
    
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['role', 'rinfo'],
    cat: "utilities"
};
    
exports.help = {
    name: 'roleinfo',
    description: 'Find information about a role.',
    usage: 'roleinfo (role)'
};