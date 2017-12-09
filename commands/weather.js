const request = require('request');
const Discord = require('discord.js');

exports.run = (client, message, args) => {
	if (client.channelperms.botCommandsAllowed.indexOf(message.channel.id) == -1) return;
    
    let location = args.join('%20');
    request(`http://api.openweathermap.org/data/2.5/weather?appid=(ADD API KEY)&q=${location}`, (error, response, body) => {
        var json = JSON.parse(body);

        if (json.cod && json.cod == 404) return message.reply("City not found!")
        if (json.wind.deg) {
            let angle = json.wind.deg
            if (json.wind.deg <= 22.5) angle = "N";
            else if (json.wind.deg <= 67.5) angle = "NE";
            else if (json.wind.deg <= 112.5) angle = "E";
            else if (json.wind.deg <= 157.5) angle = "SE";
            else if (json.wind.deg <= 202.5) angle = "S";
            else if (json.wind.deg <= 247.5) angle = "SW";
            else if (json.wind.deg <= 292.5) angle = "W";
            else if (json.wind.deg <= 337.5) angle = "NW";
            else if (json.wind.deg <= 360.1) angle = "N";

            json.wind.speed += `m/s ${angle}`;
        } 
        else json.wind.speed += "m/s";

        let weatherEmbed = new Discord.MessageEmbed()
            .setColor(`#a1afc6`)
            .setTitle(`:flag_${json.sys.country.toLowerCase()}: ${json.name}, ${json.sys.country}`)
            .setURL(`https://openweathermap.org/city/${json.id}`)
            .setThumbnail(`https://openweathermap.org/img/w/${json.weather[0].icon}.png`)
            .addField(`Temperature`, `${(json.main.temp - 273.15).toFixed(2)}°C (Min: ${(json.main.temp_min - 273.15)}°C | Max: ${(json.main.temp_max - 273.15)}°C )`, false)
            .addField('Weather', `${json.weather[0].main}`, true)
            .addField(`Wind`, `${json.wind.speed}`, true)
            .addField(`Humidity`,`${json.main.humidity}%`, true)
            .addField('Cloudiness', `${json.clouds.all}%`, true)
            

        message.channel.send({ embed: weatherEmbed })
    })
};
    
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    cat: "utilities"
};
   
exports.help = {
    name: 'weather',
    description: 'Find weather of your location',
    usage: 'weather (location)'
};