const {Client} = require("discord.js"),
client = new Client({
    disabledEvents: ['CHANNEL_PINS_UPDATE', 'USER_NOTE_UPDATE', 'USER_SETTINGS_UPDATE',
    'VOICE_STATE_UPDATE', 'TYPING_START', 'VOICE_SERVER_UPDATE', 'RELATIONSHIP_ADD', 'RELATIONSHIP_REMOVE']
}),
config = require('./configbot.json'),
fs = require("fs"),
Enmap = require("enmap"),
EnmapLevel = require("enmap-level");

client.welcomeOption = 0;
client.disableRoleRoom = false;
client.config = config;
client.channelperms = JSON.parse(fs.readFileSync("./jsonStorage/channels.json", "utf8"));
client.storage = JSON.parse(fs.readFileSync("./jsonStorage/storage.json", "utf8"));
client.roles = JSON.parse(fs.readFileSync("./jsonStorage/roles.json", "utf8"));
client.rolesCheck = JSON.parse(fs.readFileSync("./jsonStorage/rolesCheck.json", "utf8"));
client.rolesBan = JSON.parse(fs.readFileSync("./jsonStorage/rolesBan.json", "utf8"));
client.gameswelcome = JSON.parse(fs.readFileSync("./jsonStorage/games-welcome.json", "utf8"));
client.nsfw = JSON.parse(fs.readFileSync("./jsonStorage/nsfw.json", "utf8"));

client.messageTaken = true;

require("./modules/functions.js")(client);
client.db = require("./modules/PersistentDB.js");

client.commands = new Enmap();
client.aliases = new Enmap();
client.testing = new Enmap({ provider: new EnmapLevel({ name: 'testing' }) });
init () = async() => {
    fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  console.log(chalk.yellow(`Loading a total of ${files.length} commands.`));
  files.forEach(f => {
    if(f.split(".").slice(-1)[0] !== "js") return;
    let props = require(`./commands/${f}`);
    client.commands.set(props.help.name, props);
    if(props.init) props.init(client);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

    fs.readdir('./events/', (err, files) => {
  if (err) console.error(err);
  console.log(chalk.yellow(`Loading a total of ${files.length} events.`));
  files.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});
    
client.login(config.botToken);
    
console.log(chalk.greenBright(` Start Time: ${new Date().toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric", second: "numeric"})}`));
console.log(chalk.green(" ---------------------------------------------"))
};
(async () => {
await init();
})();

setInterval(function () {
  var currentGame = client.gameswelcome.games[Math.floor(Math.random() * client.gameswelcome.games.length)];
  client.user.setPresence({ activity: { name: currentGame, type: 1, url: "https://www.twitch.tv/alipoodleftw" } }); 	// Sets random game from the Array Games
  client.messageTaken = true					// Caps the command every Minute

  if (new Date().toLocaleTimeString('en-GB', { hour: "numeric", minute: "numeric"}) === "12:01 AM") {
    conlog("Reset Welcome counter")
    storage[1].welcomeNum = 0
    client.saveFile("s")
  }
}.bind(this), 60000);
