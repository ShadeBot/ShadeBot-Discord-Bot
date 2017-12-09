const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require('os');

exports.run = (client, msg, args) => {
    if (client.config.ownerId.indexOf(msg.author.id) == -1) return;

    const duration = moment.duration(client.uptime).format("D[d] H[h] m[m] s[s]");
    const sysDuration = moment.duration(os.uptime()*1000).format("D[d] H[h] m[m] s[s]");
    
    const embed = new Discord.MessageEmbed()
      .setColor(`#0D47A1`)
      .setTitle("ShadeBot: 3.0.1 (Rework 2.0 Update)")
      .setURL('https://github.com/ShadeBot/ShadeBot-Discord-Bot')
      .addField('Cached Guilds', client.guilds.size, true)
      .addField('Cached Channels', client.channels.size, true)
      .addField('Cached Members', client.users.size, true)
      .addField('Ping', `${client.ping.toFixed(0)} ms`, true)
      .addField('Users in Database', client.storage[1].users, true) // need to add the storage
      .addField('RAM Usage', `${(process.memoryUsage().rss / 1048576).toFixed()}MB/${(os.totalmem() > 1073741824 ? `${(os.totalmem() / 1073741824).toFixed(1)} GB` : `${(os.totalmem() / 1048576).toFixed()} MB`)} (${(process.memoryUsage().rss / os.totalmem() * 100).toFixed(2)}%)`, true)
      .addField('System Time', new Date().toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric"}), true)
      .addField('System Uptime', `${sysDuration}`, true)
      .addField('Process Uptime', `${duration}`, true)
      .setFooter('Created by Alipoodle#5025', 'https://alipoodle.me/small.gif');
  msg.channel.send({ embed });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["botinfo"],
  cat: "utilities"
};

exports.help = {
  name: 'stats',
  description: 'Gives some useful bot statistics',
  usage: 'stats'
};