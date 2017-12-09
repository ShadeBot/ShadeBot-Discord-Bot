const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const status = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline/Invisible"
};
const randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });


exports.run = (client, message, args) => {
  if (client.channelperms.botCommandsAllowed.indexOf(message.channel.id) == -1) return;
  
  var member
  let userText = args.join(" ").toLowerCase()
  if (!userText) {
    member = message.member
  }
  else {
    member = message.mentions.members.first() || message.guild.members.filter(m => m.displayName.toLowerCase() == userText).first() || message.guild.members.filter(m => m.user.username.toLowerCase() == userText).first() || message.guild.members.find('id', args[0]) || message.guild.members.filter(m => m.displayName.toLowerCase().indexOf(userText) != -1).first() || message.guild.members.filter(m => m.user.username.toLowerCase().indexOf(userText) != -1).first()
  }
  if (!member) return message.reply("Sorry I couldn't find the user you are looking for!");

  const embed = new Discord.MessageEmbed()
    .setColor(member.displayHexColor)
    .setThumbnail(`${member.user.displayAvatarURL()}`)
    .setAuthor(`${member.user.tag} (${member.id})`, `${member.user.avatarURL()}`)
    .addField("Nickname:", `${member.nickname ? `${member.nickname}` : "No nickname"}`, true)
    .addField("Status", `${status[member.user.presence.status]}`, true)
    .addField("Playing", member.presence.activity ? `${member.presence.activity.name}`: "not playing anything.", true)
    .addField("Roles", `${member.roles.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).join(" **|** ") || "No Roles"}`, false)
    .addField("Joined At", `${moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")} UTC`, true)
    .addField("Created At", `${moment.utc(member.user.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")} UTC`, true);
    member.roles.size >= 1 ? embed.setFooter(`has ${member.roles.size - 1} role(s)`) : embed.setFooter(`has 0 roles`)
  message.channel.send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["info", "uinfo", "user"],
  cat: "utilities"
};

exports.help = {
  name: "userinfo",
  description: "Gets userinfo from a mention or id",
  usage: "userinfo (id or mention)"
};
