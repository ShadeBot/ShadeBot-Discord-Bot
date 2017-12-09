function upFirst(string) { return string.charAt(0).toUpperCase() + string.slice(1); }

exports.run = (client, message, params) => {
  var messageSend = ""

  if (!params[0]) {
    const commandNames = Array.from(client.commands.keys());
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    
    var category = []
    client.commands.map(c => {
      if (!category[c.conf.cat]) category[c.conf.cat] = "";
      category[c.conf.cat] += `\n${client.config.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`
    })
    //messageSend = (`= Command List =\n\n[Use ${client.config.prefix}help <commandname> for details]\n\n${client.commands.map(c => `${client.config.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`).join('\n')}`)
    messageSend = (`= Command List =\n\n[Use ${client.config.prefix}help <commandname> for details]\n`)
    for (var key in category) {
      if (category.hasOwnProperty(key)) {
        messageSend += `\n= ${upFirst(key)} =${category[key]}`
      }
    }
  } else {
    let command = params[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      messageSend = (`= ${upFirst(command.help.name)} = \nDesc  :: ${command.help.description}\nUsage :: ${client.config.prefix}${command.help.usage}`);
    }
  }
  
  if (messageSend != "") {
    if (client.channelperms.botCommandsAllowed.indexOf(message.channel.id) == -1) { message.author.send(messageSend, {code:'asciidoc'}) } 
    else { message.channel.send(messageSend, {code:'asciidoc'}) }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp'],
  cat: "utilities"
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands or specific command\'s help',
  usage: 'help [command]'
};