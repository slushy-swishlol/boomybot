const ytdl = require('ytdl-core');
const nowplaying = require('./nowPlaying.js');
const { YouTube } = require('popyt');
const { apiKey } = require('../../config.json');
const Discord = require('discord.js');

module.exports = {
    name: 'addsong',
    aliases: ['play', 'add', 'a', 'p'],
    description: 'Adds the specified song to the server queue.',
    args: true,
    usage: '<song>',
    async execute(message, args){
        
        console.log(args);

        const youtube = new YouTube(apiKey);
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
        
        const songInfo = await youtube.getVideo(args[0]);
        const channelName = await songInfo.youtube.getChannel(songInfo.channelId);
        
        const song = {
            title: songInfo.title,
            url: songInfo.url,
            date: songInfo.datePublished,
            duration: `${songInfo.minutes}:${songInfo.seconds}`,
            thumbnail: songInfo.thumbnails.default.url,
            channel: channelName.name
        }

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
                this.playSong(message, queueStruct.songs[0]);
            } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
                return message.channel.send(err);
            }
        } else {
            serverQueue.songs.push(song);
            const addedEmbed = new Discord.MessageEmbed()
            .setAuthor('Added to queue', message.author.avatarURL())
            .setTitle(song.title)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setColor(0xff0000)
            .addFields(
                { name: 'Duration', value: song.duration, inline: true },
                { name: 'Channel', value: song.channel, inline: true },
                { name: 'Position in queue', value: serverQueue.songs.indexOf(song) + 1 }
            );
            return message.channel.send(addedEmbed);
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
        nowplaying.execute(message);
    }
}

