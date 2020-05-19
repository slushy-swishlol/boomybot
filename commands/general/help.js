const { prefix } = require('c:/Users/Slushy/Documents/Projects/boomybot/config.json');

module.exports = {
    name: 'help',
    aliases: ['commands'],
    description: 'Displays a list of all available commands, and information about specific commands.',
    args: true,
    usage: '<command name>',
    execute(message, args){
        const data = [];
        const { commands } = message.client;

        if (!args.length){
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            
            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        data.push(`**Description:** ${command.description}`);
        data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

        message.channel.send(data, { split: true });

    }
}