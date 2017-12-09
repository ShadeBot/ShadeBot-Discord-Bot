exports.run = (client, msg, args) => {
  if (!msg.member.roles.some(r=>client.config.staffRoles.includes(r.id))) return msg.reply("Sorry, you do not have the permissions to do this!")
  
  const members = msg.guild.members.filter(member => member.user.presence.activity && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(member.user.presence.activity.name));
  return msg.channel.send(members.map(member => `\`${member.id}\` ${member.displayName}`).join("\n") || "Nobody has an invite link as game name.");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["ci", "checkinvite"],
  cat: "moderation"
};

exports.help = {
  name: 'checkinvites',
  description: 'Returns a list of members with an invite as their game.',
  usage: 'checkinvites'
};