// http://random.cat/meow

const request = require('request');
const Discord = require('discord.js');

exports.run = (client, message, args) => {
	if (client.channelperms.botCommandsAllowed.indexOf(message.channel.id) == -1) return;
    
    request(`http://random.cat/meow`, (error, response, body) => {
        var json = JSON.parse(body);

        let catEmbed = new Discord.MessageEmbed()
            .setColor(`#d37121`)
            .setImage(json.file)
            .setFooter(`Source | ${json.file}`)

        message.channel.send({ embed: catEmbed })
    })
};
    
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['meow'],
    cat: "fun"
};
   
exports.help = {
    name: 'cat',
    description: 'Get a random Cat image',
    usage: 'cat'
};