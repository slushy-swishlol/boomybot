//Define shit lol
const Discord = require('discord.js');
const fs = require('fs');
/*
const {
    prefix,
    token,
} = require('./config.json');
*/
const token = process.env.token;
const prefix = process.env.prefix;

//Client Properties
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.queue = new Map();

//Read through commands directory and get all command files
const commandDir = fs.readdirSync('./commands');
for (const folder of commandDir){
    const folderCommands = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of folderCommands) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

//Status Checks
client.on('ready', () => {
    console.log('Bot is now connected');
});

//On message event - handles all commands
client.on('message', message => {
    //Don't respond to other bots
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
    if (!command) return message.channel.send(`That is not a valid command, ${message.author}!`);

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