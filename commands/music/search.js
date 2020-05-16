const { YouTube } = require('popyt');
const Discord = require('discord.js');
const { apiKey } = require('../../config.json');
const addSong = require('./addSong.js');

module.exports = {
    name: 'search',
    aliases: ['s', 'youtube'],
    description: 'Searches for the given terms and returns a list of the top 10 results from YouTube.',
    args: true,
    usage: '<search term>',
    async execute(message, args) {
        const youtube = new YouTube(apiKey);
        const searchResults = await youtube.searchVideos(args[0], 10);

        const resultsEmbed = new Discord.MessageEmbed()
            .setTitle(`Top 10 search results for ${args[0]}`)
            .setFooter(`Please respond with the number that corresponds to your desired search result.\nSend *cancel* to cancel the search query.`);
        for (var i = 0; i < searchResults.results.length; i++){
            //th cjim
            resultsEmbed.addField(`Result ${i+1}`, searchResults.results[i].title);
        }
        await message.channel.send(resultsEmbed);
        getResult(message.client, message.author.id, searchResults.results);
    }
}

function getResult(client, memberID, results){
    client.once('message', async message => {
        if (!memberID == message.author.id){
            getResult(client, memberID, results);
        }
        if (message.content === 'cancel') {
            return message.channel.send('Search query cancelled.');
        }
        const chosenResult = parseInt(message.content.slice(message.content.indexOf(' ')));
        if (isNaN(chosenResult) || chosenResult < 1 || chosenResult > 10) {
            await message.channel.send(`Please respond with a number that is on the list, ${message.author}!`);
            getResult(client, memberID, results);
        } else {
            const result = results[chosenResult - 1].url;
            console.log(results + '\n');
            console.log(results[chosenResult - 1]);
            await addSong.execute(message, [result]);
        }
    });
}