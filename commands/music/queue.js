const discord = require('discord.js');

module.exports = {
    name: 'queue',
    aliases: ['q', 'songs', 'songlist', 'allsongs'],
    description: 'Lists all the songs that are currently queued.',
    args: false,
    usage: '(There are no arguments for this command.)',
    execute(message){
        const { queue } = message.client;
        const serverQueue = queue.get(message.guild.id);

        const queueEmbed = new discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Current Queue for ${message.guild.name}`)
            .setTimestamp();
        if (serverQueue.songs){
            if (serverQueue.songs.length != 1) {
                queueEmbed.setDescription(`There are currently ${serverQueue.songs.length} songs in the queue.`);
            } else {
                queueEmbed.setDescription('There is currently 1 song in the queue.');
            }
            for (var i = 0; i < serverQueue.songs.length; i++){
                queueEmbed.addField(`Track ${i+1}`, `${serverQueue.songs[i].title}`);
            }
        } else {
            queueEmbed.setDescription('There are currently no songs in the queue.');
        }

        return message.channel.send(queueEmbed);
    }
}