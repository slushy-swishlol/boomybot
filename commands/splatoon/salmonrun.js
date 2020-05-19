const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
    name: 'salmonrun',
    aliases: ['sr', 'salmonruns', 'srschedules'],
    description: 'Displays the schedule for the next 5 salmon runs.',
    args: false,
    usage: '(There are no arguments for this command.)',
    async execute(message){
        //Gets JSON file for salmon run schedule
        const salmonruns = await axios.get('https://splatoon2.ink/data/coop-schedules.json');

        //Structures designated for both the start and end dates of each salmon run.
        const StartDates = [
            new Date (salmonruns.data.schedules[0].start_time * 1000),
            new Date (salmonruns.data.schedules[1].start_time * 1000),
            new Date (salmonruns.data.schedules[2].start_time * 1000),
            new Date (salmonruns.data.schedules[3].start_time * 1000),
            new Date (salmonruns.data.schedules[4].start_time * 1000)
        ];
        const EndDates = [
            new Date(salmonruns.data.schedules[0].end_time * 1000),
            new Date(salmonruns.data.schedules[1].end_time * 1000),
            new Date(salmonruns.data.schedules[2].end_time * 1000),
            new Date(salmonruns.data.schedules[3].end_time * 1000),
            new Date(salmonruns.data.schedules[4].end_time * 1000)
        ];

        //Structures designated for the first two salmon runs, contains extra information
        const currentSRStruct = {
            weapons: [
                salmonruns.data.details[0].weapons[0].weapon.name,
                salmonruns.data.details[0].weapons[1].weapon.name,
                salmonruns.data.details[0].weapons[2].weapon.name,
                salmonruns.data.details[0].weapons[3].weapon.name
            ],
            stage: salmonruns.data.details[0].stage.name
        }
        const nextSRStruct = {
            weapons: [
                salmonruns.data.details[1].weapons[0].weapon.name,
                salmonruns.data.details[1].weapons[1].weapon.name,
                salmonruns.data.details[1].weapons[2].weapon.name,
                salmonruns.data.details[1].weapons[3].weapon.name
            ],
            stage: salmonruns.data.details[1].stage.name
        }

        const salmonRunEmbed = new Discord.MessageEmbed()
            .setTitle('Salmon Run Information')
            .addFields(
                //Salmon Run #1
                {
                    name: `**__${StartDates[0].getMonth()}/${StartDates[0].getDate()} - ${EndDates[0].getMonth()}/${EndDates[0].getDate()}__**`,
                    value: `**Weapons**\n${currentSRStruct.weapons[0]}\n${currentSRStruct.weapons[1]}\n${currentSRStruct.weapons[2]}\n${currentSRStruct.weapons[3]}\n\n` +
                           `**Stage**\n${currentSRStruct.stage}`,
                    inline: true
                },
                //Salmon Run #2
                {
                    name: `**__${StartDates[1].getMonth()}/${StartDates[1].getDate()} - ${EndDates[1].getMonth()}/${EndDates[1].getDate()}__**`,
                    value: `**Weapons**\n${nextSRStruct.weapons[0]}\n${nextSRStruct.weapons[1]}\n${nextSRStruct.weapons[2]}\n${nextSRStruct.weapons[3]}\n\n` +
                           `**Stage**\n${nextSRStruct.stage}`,
                    inline: true
                },
                //Salmon Run #3
                {
                    name: `**__${StartDates[2].getMonth()}/${StartDates[2].getDate()} - ${EndDates[2].getMonth()}/${EndDates[2].getDate()}__**`,
                    value: 'Information currently not available.'
                },
                //Salmon Run #4
                {
                    name: `**__${StartDates[3].getMonth()}/${StartDates[3].getDate()} - ${EndDates[3].getMonth()}/${EndDates[3].getDate()}__**`,
                    value: 'Information currently not available.'
                },
                //Salmon Run #5
                {
                    name: `**__${StartDates[4].getMonth()}/${StartDates[4].getDate()} - ${EndDates[4].getMonth()}/${EndDates[4].getDate()}__**`,
                    value: 'Information currently not available.'
                }
            );
        return message.channel.send(salmonRunEmbed);
    }
}