const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const ytdl = require("ytdl-core");
client.once('ready', () => {
	console.log('Ecstasy is online.');
});

var servers = {}

client.on('message', message => {
    console.log(message.content);
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const mysql = require('mysql');
    const command = args.shift().toLowerCase();
    const { voice } = message.member
    const connection = mysql.createConnection({
        host: 'localhost'
        
    })
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    else if (command.startsWith(`respond`)) {
        message.reply(`I respond.`);
    }
    else if (command.startsWith(`help`)) {
        message.reply(`I cannot help you or anyone else. Yet.`);
    }
    else if (command.startsWith(`play`)) {
        voice.channel.join()
        function play(connection, message) {
            var server = servers[message.guild.id];
            connection.play(ytdl(server.queue[0], { filter: "audioonly" }));
            server.queue.shift();
            server.dispatcher.on("end", function(){
                if (server.queue[0]) {
                    play(connection, message);
                } else {
                    connection.disconnect();
                }
            })
        }
        var a = Math.floor((Math.random() * 5) + 1);
        if (a === 1) {
            message.reply(`I am still under construction and can't do shit. Blame my creators.`);

        }
        else if (a === 2) {
            message.reply(`Fuck off.`);

        }  else if (a === 3) {
            message.reply(`I only obey SkyNet.`);

        } else if (a === 4) {
            message.reply(`Sammy hasn't completed writing my code.`);

        } else {
            message.reply(`Music will rot your brain.`);

        }
        //if (!args[0]) {
        //    message.reply(`I need arguments.`);
        //    return;
        //}
        if (!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        }
        var server = servers[message.guild.id];
        server.queue.push(args[1]);
        //play(connection, message)
    }
    else if (command.startsWith(`stop`)) {
        voice.channel.leave()
    }
});

client.login(token);