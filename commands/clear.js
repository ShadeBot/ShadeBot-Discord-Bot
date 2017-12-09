exports.run = async (client, msg, args) => {
  if (!msg.member.roles.some(r=>client.config.staffRoles.includes(r.id))) return;
  
  const user = (msg.mentions.users.first() || msg.guild.members.get(args[0]) || null);
  var amount = !!user ? parseInt(msg.content.split(" ")[2], 10) : parseInt(msg.content.split(" ")[1], 10);
  if (!amount) return msg.channel.send("Must specify an amount to delete!").then(msg.delete(2000));
  if (!amount && !user) return msg.channel.send("Must specify a user and amount, or just an amount, of messages to purge!").then(msg.delete(2000));
  await msg.delete();

  // Caps General staff from only being able to clear 20 messages!
  if (amount > 20  && client.config.ownerId.indexOf(msg.author.id) == -1) { amount = 20; }

  if(user) {
    let messages = await msg.channel.messages.fetch({limit: 100});
    messages = messages.array().filter(m=>m.author.id === user.id);
    messages.length = amount;
    messages.map(async m => await m.delete().catch(console.error))
	  .then(function () {
      msg.channel.send(`:wastebasket: Removed ${amount} messages`)
        .then(function (message) { setTimeout(() => message.delete(), 2000)})
        .catch(function () { messagefail})
	})
  } else {
    msg.channel.bulkDelete(amount).catch(console.error)
    .then(function () {
      msg.channel.send(`:wastebasket: Removed ${amount} messages`)
        .then(function (message) { setTimeout(() => message.delete(), 2000)})
        .catch(function () { messagefail})
    })
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  cat: "moderation"
};

exports.help = {
  name: 'clear',
  description: 'Deletes messages from anyone in the channel.',
  usage: 'clear (number of messages) [@user]'
};