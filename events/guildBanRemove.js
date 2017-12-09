module.exports = (client, guild, user) => {
    client.conlog(`${user.tag} (id: ${user.id}) has been unbanned from the server ${guild.name}`)
	const logChannel = guild.channels.find('name', 'kick-ban-record');
    if (!logChannel) return console.log(chalk.redBright("Log Channel doesn't exist!!"));
    logChannel.send(`${user.tag} (id: ${user.id}) has been unbanned from the server!`);
};