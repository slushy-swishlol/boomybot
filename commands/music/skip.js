module.exports = {
    name: 'skip',
    aliases: [],
    description: 'Skips the song that is currently playing.',
    args: false,
    usage: '(There are no arguments for this command.)',
    execute(message){
        const { queue } = message.client;
        const serverQueue = queue.get(message.guild.id);
        if (!message.member.permissions.has('ADMINISTRATOR')){
            return message.channel.send("You must be an admin to skip the song!");
        }

        if (!message.member.voice.channel){
            return message.channel.send("You have to be in a voice channel to skip a song!" );
        }
        if (!serverQueue){
            return message.channel.send("There is no song that I could skip!");
        }
        serverQueue.connection.dispatcher.end();
    }
}