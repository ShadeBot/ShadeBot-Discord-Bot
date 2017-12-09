const request = require('request');
const Discord = require('discord.js');

exports.run = (client, message, args) => {
	if (!client.config.features.osu || client.config.osu.channels.indexOf(message.channel.id) == -1) return;
	
	let account = args[0];
	let mode = args[1];
	if (!account) return message.reply("Please provide an account you would like to search for!")
	
	if (!mode) { mode = 0 } // Default Game
	else if (mode.indexOf("o") == 0) { mode = 0 } // Standard
	else if (mode.indexOf("t") == 0) { mode = 1 } // Taiko
	else if (mode.indexOf("c") == 0) { mode = 2	} // Catch the Beat
	else if (mode.indexOf("m") == 0) { mode = 3	} // Mania
	else { mode = 0 }
			
	request(`https://osu.ppy.sh/api/get_user?k=${client.config.osu.key}&u=${account}&m=${mode}`, (error, response, body) => {
		var json = JSON.parse(body);
			
		if(json.length == 0) { message.reply("No User found.") }
		else {
			let osu = json[0]
			let osuEmbed = new Discord.MessageEmbed()
				.setColor(`#FF66AA`)
				.setAuthor(osu.username, `https://osu.ppy.sh/images/flags/${osu.country}.png`)
				.setURL(`https://osu.ppy.sh/u/${osu.user_id}`)
				.addField(`PP `, Math.ceil(osu.pp_raw), true)
				.addField(`Rank`,`#${osu.pp_rank} (${osu.country}: #${osu.pp_country_rank})`, true)
				.addField(`Play Count`, osu.playcount, true)
				.addField(`Accuracy`, `${parseFloat(osu.accuracy).toFixed(2)}%`, true)
				.addField(`Level`, parseFloat(osu.level).toFixed(2), true)
				.addField(`Ranks`, `SS: ${osu.count_rank_ss} | S: ${osu.count_rank_s} | A: ${osu.count_rank_a}`, true)
				/*.addField(`Top Play`, topPlay, false) */
				.setThumbnail(`https://a.ppy.sh/${osu.user_id}`)
			message.channel.send({ embed: osuEmbed })
		}
	});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  cat: "fun"
};

exports.help = {
  name: 'osu',
  description: 'Find out information on your osu account!',
  usage: 'osu (account) [mode]'
};




