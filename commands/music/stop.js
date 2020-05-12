module.exports = {
    name: 'stop',
    aliases: ['a'],
    description: 'Stops the music entirely.',
    args: false,
    usage: '(There are no arguments for this command.)',
    execute(message){
        const { queue } = message.client;
        const serverQueue = queue.get(message.guild.id);

        if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
}