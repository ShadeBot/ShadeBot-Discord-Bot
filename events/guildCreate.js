module.exports = (client, guild) => {
    console.log(chalk.magenta(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`))
};