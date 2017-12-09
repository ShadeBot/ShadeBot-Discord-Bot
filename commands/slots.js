const slotItems = ["🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🍎", "🍑", "🍓", "🍒"];
const Discord = require('discord.js');

exports.run = (client, message, args) => {
    if (client.channelperms.botCommandsAllowed.indexOf(message.channel.id) == -1) return;

    client.addToDatabase(message.author.id);
    let userData = client.storage[message.author.id];
    let money = parseInt(args[0]);
    let win = false;

    if (!money) return message.author.send("Usage ``" + client.config.prefix + "slots (amount)``"); //help
    if (money > 500) money = 500;
    if (money > userData.money) return message.channel.send("Sorry, you are betting more than you have!");

    let number = []
    for (i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }

    if (number[0] == number[1] && number[1] == number[2]) { // All 3 the same! 10/1000 or 1% (10 items)
        money *= 9
        win = true;
    } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) { // 2 are the same! 100/1000 or 10%
        money *= 2
        win = true;
    }
    if (win) {
        let slotsEmbed = new Discord.MessageEmbed()
            .setDescription(`${slotItems[number[0]]} ${slotItems[number[1]]} ${slotItems[number[2]]} You won ${money}`)
            .setColor("RANDOM")
            .setFooter(message.author.tag, message.author.displayAvatarURL())
        message.channel.send({embed: slotsEmbed})
        client.addMoney(money, userData)
    } else {
        let slotsEmbed = new Discord.MessageEmbed()
            .setDescription(`${slotItems[number[0]]} ${slotItems[number[1]]} ${slotItems[number[2]]} You lost ${money}`)
            .setColor("RANDOM")
            .setFooter(message.author.tag, message.author.displayAvatarURL())
        message.channel.send({embed: slotsEmbed})
        client.loseMoney(money, userData)
    }
    client.saveFile('s');
};
    
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["slot"],
    cat: "fun"
};
    
exports.help = {
    name: 'slots',
    description: 'Allows you to spend your Shadebucks on a game of Slots.',
    usage: 'slots (amount)'
};