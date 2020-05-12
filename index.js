//Define shit lol
const Discord = require('discord.js');
const fs = require('fs');
const {
    prefix,
    token,
} = require('./config.json');

//Create client
const client = new Discord.Client();
client.commands = new Discord.Collection();

const musicCommands = fs.readdirSync('./commands/music').filter(file => file.endsWith('.js'));
const splatoonCommands = fs.readdirSync('./commands/splatoon').filter(file => file.endsWith('.js'));
const generalCommands = fs.readdirSync('./commands/general').filter(file => file.endsWith('.js'));

for (const file of musicCommands) {
    const command = require(`./commands/music/${file}`);
    client.commands.set(command.name, command);
}
for (const file of splatoonCommands) {
    const command = require(`./commands/splatoon/${file}`);
    client.commands.set(command.name, command);
}
for (const file of generalCommands) {
    const command = require(`./commands/general/${file}`);
    client.commands.set(command.name, command);
}

//Music Variables
client.queue = new Map(); //List of songs that are currently queued.

//Status Checks
client.on('ready', () => {
    console.log('Bot is now connected');
});

//On message event - handles all commands
client.on('message', message => {
    //Don't respond to other bots
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    try {
        if (command.args){
            if (!args.length) return message.channel.send(
                `You didn't provide any arguments, ${message.author}!
                \nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
            );
            command.execute(message, args);
        } else {
            command.execute(message);
        }
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(token);