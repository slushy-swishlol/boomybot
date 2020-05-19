const Discord = require('discord.js');

module.exports = {
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Shows the currently playing track and some related information',
    args: false,
    usage: '(There are no arguments for this command.)',
    execute(message){
        const { queue } = message.client;
        const serverQueue = queue.get(message.guild.id);

        if (!serverQueue || serverQueue.songs.length < 1) {
            return message.channel.send('There are no songs currently playing.');
        }
        const npEmbed = new Discord.MessageEmbed()
            .setAuthor('Now Playing', message.author.avatarURL())
            .setTitle(serverQueue.songs[0].title)
            .setURL(serverQueue.songs[0].url)
            .setThumbnail(serverQueue.songs[0].thumbnail)
            .setColor(0xff0000)
            .addFields(
                { name: 'Duration', value: serverQueue.songs[0].duration, inline: true },
                { name: 'Channel', value: serverQueue.songs[0].channel, inline: true }
            );
        message.channel.send(npEmbed);
    }
}