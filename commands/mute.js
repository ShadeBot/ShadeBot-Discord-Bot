const Discord = require('discord.js');

exports.run = (client, message, args) => {
  if (!message.member.roles.some(r=>client.config.staffRoles.includes(r.id))) return message.reply("Sorry, you do not have the permissions to do this!")
  
  let time = args.slice(1).join(' ');
  let amount = parseInt(time);
  let member = message.mentions.members.first() || message.guild.members.get(args[0])
  let modlog = message.guild.channels.find('id', '216661960253636608');
  let muteRole = message.guild.roles.find('id', client.config.roles.mute);
  
  if (!modlog) return message.reply('I cannot find the log channel').catch(console.error);
  if (!muteRole) return message.reply('I cannot find the mute role').catch(console.error);
  if (!member) return message.reply('You must provide a user!').catch(console.error);
  if (member.id == client.user.id) return message.reply("Sorry, but I cannot mute myself!")

  var embed = new Discord.MessageEmbed()
    .setColor(0x212121)
    .setTimestamp()
    .addField('Action', "Mute", true)
    .addField('Target', `${member.user.tag} `, true)
    .addField('Moderator', message.author.tag, true)
    .setFooter(`User Muted (${member.user.id})`, member.user.displayAvatarURL());

  let resetTime
  if (time && amount) {
    time = time.toLowerCase();
    if (time.indexOf('h') != -1) {
      resetTime = new Date(new Date().setHours(new Date().getHours() + amount))
      setTimeout(() => member.removeRole(muteRole).catch(console.error), 3600000 * amount)
      embed.addField('Muted for', `${amount} Hour(s)`, true)
      embed.addField('Unmute Time', `${resetTime.getHours()}:${resetTime.getMinutes()} UTC`, true)
    } else if (time.indexOf('m') != -1) {
      resetTime = new Date(new Date().setMinutes(new Date().getMinutes() + amount))
      setTimeout(() => member.removeRole(muteRole).catch(console.error), 60000 * amount)
      embed.addField('Muted for', `${amount} Minute(s)`, true)
      embed.addField('UTC Time', `${resetTime.getHours()}:${resetTime.getMinutes()}`, true)
    }
  }
  embed.addField('\u200b', '\u200b', true)
  embed.addField('Reason', 'Please provide a reason for muting:', false)

  if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply('I do not have Manage Roles').catch(console.error);

  if (member.roles.has(muteRole.id)) {
    member.removeRole(muteRole).catch(e=>console.error("Cannot remove muted role: " + e));
    message.channel.send("Successfully removed Mute from: " + member.user.tag)
  } else {
    member.addRole(muteRole).then(() => {
      client.channels.get(modlog.id).send({embed}).catch(console.error);
    })
    .catch(e=>console.error("Cannot add muted role: " + e));
    message.channel.send("Successfully added Mute to: " + member.user.tag)
  }

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['unmute', 'm', 'um'],
  cat: "moderation"
};

exports.help = {
  name: 'mute',
  description: 'Mutes or unmutes a mentioned user',
  usage: 'mute (@user) [time]'
};