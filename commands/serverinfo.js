const Discord = require("discord.js");
const moment = require("moment");

const verificationLevel = ['None - unrestricted', 'Low - must have verified email on account', 'Medium - must be registered on Discord for longer than 5 minutes', 'High - 	(╯°□°）╯︵ ┻━┻ - must be a member of the server for longer than 10 minutes', 'Very High - ┻━┻ミヽ(ಠ益ಠ)ﾉ彡┻━┻ - must have a verified phone number']
const contentFilter = ['Content filter disabled', 'Scan messages of members without a role', 'Scan messages sent by all members']


exports.run = (client, message, args) => {
    if (client.channelperms.botCommandsAllowed.indexOf(message.channel.id) == -1) return;

    const presences = message.guild.presences.map(st => st.status)
    const channels = message.guild.channels.map(ty => ty.type);
    var onlineMembers = 0;
    var guildChannels = 0;
    for (let i in presences) {
        if (presences[i] !== 'offline') {
            onlineMembers++
        }
    }
    for (let i in channels) {
        if (channels[i] === 'text') {
            guildChannels++
        }
    }


    const embed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setThumbnail(`${message.guild.iconURL()}`)
    .setAuthor(`${message.guild.name}`, message.guild.owner.user.displayAvatarURL())
    .addField("Owner", message.guild.owner.user.tag, true)
    .addField("Members" , `${message.guild.memberCount} (Online: ${onlineMembers})`,  true)
    .addField('Region', message.guild.region, true)
    .addField('Channels', `${message.guild.channels.size} (Text ${guildChannels}) `, true)
    .addField('Emojis', message.guild.emojis.size, true)
    .addField("Roles", message.guild.roles.size, true)
    .addField('Created At', moment(message.guild.createdTimestamp).format('MMMM Do YYYY [@] HH:mm:ss [UTC]'), false)
    .addField('Verification Level', verificationLevel[message.guild.verificationLevel], false)
    .addField('Explicit Content Filter', contentFilter[`${message.guild.explicitContentFilter}`], false)
    
    .setFooter(`Server ID: ${message.guild.id}`)
    
    message.channel.send({ embed })
};
    
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['sinfo', 'server'],
    cat: "utilities"
};
    
exports.help = {
    name: 'serverinfo',
    description: 'Get information about the server!',
    usage: 'serverinfo'
};