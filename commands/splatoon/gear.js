const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
    name: 'gear',
    aliases: ['g', 'merch', 'merchandise'],
    description: 'Displays the SplatNet exclusive gear currently available.',
    args: false,
    usage: '(There are no arguments for this command.)',
    async execute(message){
        const gear = await axios.get('https://splatoon2.ink/data/merchandises.json');
        const endTimes = {
            gear0: standardize(new Date(gear.data.merchandises[0].end_time * 1000).getHours()),
            gear1: standardize(new Date(gear.data.merchandises[1].end_time * 1000).getHours()),
            gear2: standardize(new Date(gear.data.merchandises[2].end_time * 1000).getHours()),
            gear3: standardize(new Date(gear.data.merchandises[3].end_time * 1000).getHours()),
            gear4: standardize(new Date(gear.data.merchandises[4].end_time * 1000).getHours()),
            gear5: standardize(new Date(gear.data.merchandises[5].end_time * 1000).getHours())
        }

        const gearEmbed = new Discord.MessageEmbed()
        .setTitle('SplatNet Gear Shop')
        .addFields(
            //Merch 1
            {
                name: `**__${gear.data.merchandises[0].gear.name}__**`,
                value:
                    `**Brand:** ${gear.data.merchandises[0].gear.brand.name}\n` +
                    `**Price:** ${gear.data.merchandises[0].price}\n` +
                    `**Rarity:** ${gear.data.merchandises[0].gear.rarity}\n` +
                    `**Skill:** ${gear.data.merchandises[0].skill.name}\n` +
                    `**Frequent Skill:** ${gear.data.merchandises[0].gear.brand.frequent_skill.name}\n` +
                    `**Type of gear:** ${gear.data.merchandises[0].kind}\n` +
                    `:alarm_clock: **Ends at:** ${endTimes.gear0[0]} ${endTimes.gear0[1]}`,
                inline: true
            },
            //Merch 2
            {
                name: `**__${gear.data.merchandises[1].gear.name}__**`,
                value:
                    `**Brand:** ${gear.data.merchandises[1].gear.brand.name}\n` +
                    `**Price:** ${gear.data.merchandises[1].price}\n` +
                    `**Rarity:** ${gear.data.merchandises[1].gear.rarity}\n` +
                    `**Skill:** ${gear.data.merchandises[1].skill.name}\n` +
                    `**Frequent Skill:** ${gear.data.merchandises[1].gear.brand.frequent_skill.name}\n` +
                    `**Type of gear:** ${gear.data.merchandises[1].kind}\n` +
                    `:alarm_clock: **Ends at:** ${endTimes.gear1[0]} ${endTimes.gear1[1]}`,
                inline: true
            },
            //Merch 3
            {
                name: `**__${gear.data.merchandises[2].gear.name}__**`,
                value:
                    `**Brand:** ${gear.data.merchandises[2].gear.brand.name}\n` +
                    `**Price:** ${gear.data.merchandises[2].price}\n` +
                    `**Rarity:** ${gear.data.merchandises[2].gear.rarity}\n` +
                    `**Skill:** ${gear.data.merchandises[2].skill.name}\n` +
                    `**Frequent Skill:** ${gear.data.merchandises[2].gear.brand.frequent_skill.name}\n` +
                    `**Type of gear:** ${gear.data.merchandises[2].kind}\n` +
                    `:alarm_clock: **Ends at:** ${endTimes.gear2[0]} ${endTimes.gear2[1]}`,
                inline: true
            },
            //Merch 4
            {
                name: `**__${gear.data.merchandises[3].gear.name}__**`,
                value:
                    `**Brand:** ${gear.data.merchandises[3].gear.brand.name}\n` +
                    `**Price:** ${gear.data.merchandises[3].price}\n` +
                    `**Rarity:** ${gear.data.merchandises[3].gear.rarity}\n` +
                    `**Skill:** ${gear.data.merchandises[3].skill.name}\n` +
                    `**Frequent Skill:** ${gear.data.merchandises[3].gear.brand.frequent_skill.name}\n` +
                    `**Type of gear:** ${gear.data.merchandises[3].kind}\n` +
                    `:alarm_clock: **Ends at:** ${endTimes.gear3[0]} ${endTimes.gear3[1]}`,
                inline: true
            },
            //Merch 5
            {
                name: `**__${gear.data.merchandises[4].gear.name}__**`,
                value:
                    `**Brand:** ${gear.data.merchandises[4].gear.brand.name}\n` +
                    `**Price:** ${gear.data.merchandises[4].price}\n` +
                    `**Rarity:** ${gear.data.merchandises[4].gear.rarity}\n` +
                    `**Skill:** ${gear.data.merchandises[4].skill.name}\n` +
                    `**Frequent Skill:** ${gear.data.merchandises[4].gear.brand.frequent_skill.name}\n` +
                    `**Type of gear:** ${gear.data.merchandises[4].kind}\n` +
                    `:alarm_clock: **Ends at:** ${endTimes.gear4[0]} ${endTimes.gear4[1]}`,
                inline: true
            },
            //Merch 6
            {
                name: `**__${gear.data.merchandises[5].gear.name}__**`,
                value:
                    `**Brand:** ${gear.data.merchandises[5].gear.brand.name}\n` +
                    `**Price:** ${gear.data.merchandises[5].price}\n` +
                    `**Rarity:** ${gear.data.merchandises[5].gear.rarity}\n` +
                    `**Skill:** ${gear.data.merchandises[5].skill.name}\n` +
                    `**Frequent Skill:** ${gear.data.merchandises[5].gear.brand.frequent_skill.name}\n` +
                    `**Type of gear:** ${gear.data.merchandises[5].kind}\n` +
                    `:alarm_clock: **Ends at:** ${endTimes.gear5[0]} ${endTimes.gear5[1]}`,
                inline: true
            }
        );
        return message.channel.send(gearEmbed);
    }
}

function standardize(timestamp){
    if (timestamp > 12){
        return [timestamp - 12, 'PM'];
    } else if (timestamp == 0){
        return [12, 'AM'];
    } else {
        return [timestamp, 'AM'];
    }
}