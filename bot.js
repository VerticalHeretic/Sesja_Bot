console.log('Beep beep 🦾 ')

const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const fs = require('fs')


// CONSTANTS 
let data = require('./data/mainData.json');


const replies = [
    "The Force will be with you. Always. ✨ ",
    "“I find your lack of faith disturbing. 🤖 ",
    "Now, young Skywalker, you will die. ⚡️ ", 
    "It's no use Anakin I have the high ground 🏔"
];

client.on('ready', () => {
    console.log('💙');
});

client.on('message', msg => {
    console.log(msg.content);
    if( msg.channel.id == '802931490019082300' && msg.content === 'Force') {
        const index = Math.floor(Math.random() * replies.length);
        msg.channel.send(replies[index]);
    }
    if (msg.channel.id == '802931490019082300' && msg.content === 'Points') {
        for (i=0; i < data.points.length; i++) {
            console.log(data.points[i].username)
            if (msg.author.username == data.points[i].username) {
                msg.reply(`You have ${data.points[i].number} point right now`);
            }
            if (msg.author.username != data.points[i].username) {
                msg.reply("You are not in database yet, adding you right now..")
                data.points.push({"username": msg.author.username, "number": 0})
                console.log(data);
                fs.writeFile('./data/mainData.json', JSON.stringify(data), function(err, result){
                    if(err) console.log('error', err)
                });
                break
            }
        }
    }
});


client.login("process.env.BOT_TOKEN");

