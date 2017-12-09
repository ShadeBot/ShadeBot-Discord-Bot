exports.run = async (client, msg, args) => {
  if (client.config.ownerId.indexOf(msg.author.id) == -1) return;

  if(!args.length) return msg.channel.send(`Must provide a command to reload. Derp.`).then(setTimeout(msg.delete.bind(msg), 1000));

  let command;
  if (client.commands.has(args[0])) {
    command = client.commands.get(args[0]);
  } else if (client.aliases.has(args[0])) {
    command = client.commands.get(client.aliases.get(args[0]));
  }
  if(!command) return msg.channel.send(`The command \`${args[0]}\` doesn't seem to exist, nor is it an alias. Try again!`).then(setTimeout(msg.delete.bind(msg), 1000));

  if(command.db) await command.db.close();

  command = command.help.name;

  delete require.cache[require.resolve(`./${command}.js`)];
  let cmd = require(`./${command}`);
  client.commands.delete(command);
  if(cmd.init) cmd.init(client);
  client.aliases.forEach((cmd, alias) => {
    if (cmd === command) client.aliases.delete(alias);
  });
  client.commands.set(command, cmd);
  cmd.conf.aliases.forEach(alias => {
    client.aliases.set(alias, cmd.help.name);
  });

  msg.channel.send(`The command \`${command}\` has been reloaded`).then(setTimeout(msg.delete.bind(msg), 1000));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  cat: "moderation"
};

exports.help = {
  name: 'reload',
  description: 'Reloads a command that\'s been modified.',
  usage: 'reload (command)'
};
