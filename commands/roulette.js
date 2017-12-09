function isOdd(num) { 
	if ((num % 2) == 0) return false;
	else if ((num % 2) == 1) return true;
}

exports.run = (client, message, args) => {
    if (client.channelperms.botCommandsAllowed.indexOf(message.channel.id) == -1) return;
    
    let colour = args[0];
    let money = parseInt(args[1]);
    client.addToDatabase(message.author.id);
    let userData = client.storage[message.author.id];
    
    if (!money) return message.author.send("Usage ``" + client.config.prefix + "roulette (black, red, green) (amount)``\nPick any of the colours you want... but some are more likely than others...\n**Black is for Even numbers**... **and Red is for odd**... both of these will provide you with **1.5x your original amount**.\nTake a risk and pick **Green** and you can get **14x the amount of money**... however it's one in 37."); //help
    if (money > 500) money = 500;
    if (money > userData.money) return message.channel.send("Sorry, you are betting more than you have!");
    if (!colour)  return message.channel.send("You can only bet on Black (1.5x), Red (1.5x), or Green (14x).");
    colour = colour.toLowerCase()
    
    if (colour == "b" || colour.includes("black")) colour = 0;
    else if (colour == "r" || colour.includes("red")) colour = 1;
    else if (colour == "g" || colour.includes("green")) colour = 2;
    else return message.channel.send("You can only bet on Black (1.5x), Red (1.5x), or Green (14x).");
    
    let random = Math.floor(Math.random() * 37);
    
    if (random == 0 && colour == 2) { // Green
        money *= 14
        client.addMoney(money, userData)
        message.channel.send(`💚 **JACKPOT** You won ${money} ShadeBucks 💚 | The Number was ${random}`)
        console.log(`${message.author.tag} Won the jackpot`)
    } else if (isOdd(random) && colour == 1) { // Red
        money = parseInt(money * 1.5)
        client.addMoney(money, userData)
        message.channel.send(`🔴 You won ${money} ShadeBucks 🔴 | The Number was ${random}`)
    } else if (!isOdd(random) && colour == 0) { // Black
        money = parseInt(money * 1.5)
        client.addMoney(money, userData)
        message.channel.send(`⚫ You won ${money} ShadeBucks ⚫ | The Number was ${random}`)
    } else { // Wrong
        client.loseMoney(money, userData)
        message.channel.send(`You sadly lost ${money} ShadeBucks | The Number was ${random}`)
    }

    client.saveFile("s");
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    cat: "fun"
};
    
exports.help = {
    name: 'roulette',
    description: 'Allows you to spend your Shadebucks on a game of Roulette.',
    usage: 'roulette (black/red/green) (amount)'
};