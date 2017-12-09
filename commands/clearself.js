exports.run = (client, msg, args) => {
  if (client.config.ownerId.indexOf(msg.author.id) == -1) return;
  
  let messagecount = parseInt(args[0], 10) ? parseInt(args[0], 10) : 1;
  msg.channel.messages.fetch({limit: 100})
  .then(messages => {
    let msg_array = messages.array();
    msg_array = msg_array.filter(m => m.author.id === client.user.id);
    msg_array.length = messagecount + 1;
    msg_array.map(m => m.delete().catch(console.error))
    .then(msg.delete())
   });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['clears'],
  cat: "moderation"
};

exports.help = {
  name: 'clearself',
  description: 'Prunes messages from the bot.',
  usage: 'clearself (number of messages)'
};