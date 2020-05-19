const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
    name: 'currentmaps',
    aliases: ['cm', 'newmaps', 'maps', 'current', 'mapschedules', 'mapschedule'],
    description: 'Displays the currently running maps for all modes.',
    args: false,
    usage: '(There are no arguments for this command.)',
    async execute(message){
        //Get the JSON file for battle schedule
        const schedules = await axios.get('https://splatoon2.ink/data/schedules.json');

        //Converts the unix timestamp to a readable timestamp.
        ///Hour[0] = Hour of the day
        ///Hour[1] = AM/PM
        var startHour = [new Date(schedules.data.regular[0].start_time * 1000).getHours(), 'AM'];
        var endHour = [new Date(schedules.data.regular[0].end_time * 1000).getHours(), 'AM'];

        if (startHour[0] > 12) {
            startHour[0] -= 12;
            startHour[1] = 'PM';
        }
        if (endHour[0] > 12) {
            endHour[0] -= 12;
            endHour[1] = 'PM';
        }

        //Structures for each of the gamemodes
        const leagueStruct = {
            stageA: schedules.data.league[0].stage_a.name,
            stageB: schedules.data.league[0].stage_b.name,
            mode: schedules.data.league[0].rule.name
        }
        const regularStruct = {
            stageA: schedules.data.regular[0].stage_a.name,
            stageB: schedules.data.regular[0].stage_b.name,
            mode: schedules.data.regular[0].rule.name
        }
        const rankedStruct = {
            stageA: schedules.data.gachi[0].stage_a.name,
            stageB: schedules.data.gachi[0].stage_b.name,
            mode: schedules.data.gachi[0].rule.name
        }

        const currentMapsEmbed = new Discord.MessageEmbed()
            .setTitle('Current maps and modes')
            .setDescription(`*From ${startHour[0]} ${startHour[1]} to ${endHour[0]} ${endHour[1]}*`)
            .addFields(
                { name: '**__Regular Battle__**', value: `**Stage A:** ${regularStruct.stageA}\n**Stage B:** ${regularStruct.stageB}\n**Rule:** ${regularStruct.mode}` },
                { name: '**__Ranked Battle__**', value: `**Stage A:** ${rankedStruct.stageA}\n**Stage B:** ${rankedStruct.stageB}\n**Rule:** ${rankedStruct.mode}` },
                { name: '**__League Battle__**', value: `**Stage A:** ${leagueStruct.stageA}\n**Stage B:** ${leagueStruct.stageB}\n**Rule:** ${leagueStruct.mode}` }
            );
        return message.channel.send(currentMapsEmbed);
    }
}