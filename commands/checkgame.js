exports.run = (client, msg, args) => {
    if (!msg.member.roles.some(r=>client.config.staffRoles.includes(r.id))) return msg.reply("Sorry, you do not have the permissions to do this!")
    let search = args.join(' ');
    if (!search || search.length < 3) return msg.reply("Please provide a valid thing to check for games!")

    const members = msg.guild.members.filter(member => member.user.presence.activity && (member.user.presence.activity.name.toLowerCase().indexOf(search.toLowerCase()) != -1));
    return msg.channel.send(`Members playing: \`${search}\` | Count: ${members.size}\n\n` + members.map(member => `\`${member.id}\` ${member.displayName}`).join("\n"));
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["cg"],
    cat: "moderation"
  };
  
  exports.help = {
    name: 'checkgame',
    description: 'Returns a list of members with an specific game.',
    usage: 'checkgame (game query)'
  };