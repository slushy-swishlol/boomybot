const ytdl = require('ytdl-core');
const nowplaying = require('./nowPlaying.js');
const popyt = require('popyt');

module.exports = {
    name: 'addsong',
    aliases: ['play', 'add', 'a', 'p'],
    description: 'Adds the specified song to the server queue.',
    args: true,
    usage: '<song>',
    async execute(message, args){

        const { queue } = message.client;
        const serverQueue = queue.get(message.guild.id);

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.channel.send("You must be in a voice channel before you can add songs!");
            return;
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send("I need the permissions to join and speak in your voice channel!");
        }

        if (args[0].contains(''))

        try { 
            const songInfo = await ytdl.getInfo(args[0]);
            const song = {
                title: songInfo.title,
                url: songInfo.video_url
            };
    
            if (!serverQueue){ //No queue for designated server
                //Queue structure with various information for future reference.
                const queueStruct = {
                    textChannel: message.channel,
                    voiceChannel: message.member.voice.channel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                };
        
                //Set structure in map to organize with multiple servers
                queue.set(message.guild.id, queueStruct);
                queueStruct.songs.push(song);
        
                //Try to connect to the voice channel. Throw error otherwise
                try {
                    var connection = await message.member.voice.channel.join();
                    queueStruct.connection = connection;
                    console.log(`queueStruct.songs[0]: ${queueStruct.songs[0]}`);
                    this.playSong(message, queueStruct.songs[0]);
                } catch (err) {
                    console.log(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(err);
                }
            } else {
                serverQueue.songs.push(song);
                return message.channel.send(`${song.title} has been added to the queue!`);
            }
        }
        catch(error){
            console.error(error);
            return message.channel.send('That is not a valid YouTube video ID!');
        }
    },
    async playSong(message, song){
        const { queue } = message.client;
        const serverQueue = await queue.get(message.guild.id);
    
        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(message.guild.id);
            return;
        }
    
        const stream = ytdl(song.url, {
            filter: 'audioonly'
        });
        const dispatcher = await serverQueue.connection.play(stream)
            .on("finish", async () => {
                serverQueue.songs.shift();
                await this.playSong(message, serverQueue.songs[0]);
            })
            .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        nowplaying.execute();
    }
}

