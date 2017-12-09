const {promisify} = require("util");

exports.run = async (client, message, args) => {
  if (client.config.ownerId.indexOf(message.author.id) == -1) return;

  await message.channel.send("Rebooting...");
  
  const commandUnloads = client.commands.filter(c=>!!c.db).array();
  for(const c of commandUnloads) {
    await c.db.close();
  }
  process.exit(1);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["restart"],
  cat: "moderation"
};

exports.help = {
  name: 'reboot',
  description: 'Restarts bot',
  usage: 'reboot'
};