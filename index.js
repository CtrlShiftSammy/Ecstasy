const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const ytdl = require("ytdl-core");
client.once('ready', () => {
	console.log('Ready!');
});

var servers = {}

client.on('message', message => {
    console.log(message.content);
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const { voice } = message.member
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    else if (command.startsWith(`respond`)) {
        message.reply(`I respond.`);
    }
    else if (command.startsWith(`help`)) {
        message.reply(`I cannot help you yet.`);
    }
    else if (command.startsWith(`play`)) {
        voice.channel.join()
        function play(connection, message) {
            var server = servers[message.guild.id];
            server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
            server.queue.shift();
            server.dispatcher.on("end", function(){
                if (server.queue[0]) {
                    play(connection, message);
                } else {
                    connection.disconnect();
                }
            })
        }
        if (!args[0]) {
            message.reply(`I need arguments.`);
            return;
        }
        if (!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        }
        var server = servers[message.guild.id];
        server.queue.push(args[1]);
        play(connection, message)
    }
    else if (command.startsWith(`stop`)) {
        voice.channel.leave()
    }
});

client.login(token);