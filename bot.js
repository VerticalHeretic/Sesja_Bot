console.log('Beep beep 🦾 ');

// IMPORTS
import { Sesja } from "./sesja.js";
import { Client } from 'discord.js';
import SQLLite from "better-sqlite3";

// CONSTANTS 
const client = new Client();
const sql = new SQLLite('./data/data.sqlite');
const sesja = new Sesja(sql, client);
const replies = [
    "The Force will be with you. Always. ✨ ",
    "“I find your lack of faith disturbing. 🤖 ",
    "Now, young Skywalker, you will die. ⚡️ ", 
    "It's no use Anakin I have the high ground 🏔"
];
const channels = {
    BOT_TESTING:"802931490019082300"
}

client.on('ready', () => {
    console.log('💙');
    createPointsTable();
    sesja.createSesjaTable();
});

client.on('message', msg => {
    if (msg.author.bot) return;
    let score;
    if( msg.channel.id == channels.BOT_TESTING && msg.content === 'Force') {
        const index = Math.floor(Math.random() * replies.length);
        msg.channel.send(replies[index]);
    }
    if (msg.channel.id == channels.BOT_TESTING) {
        score = client.getPoints.get(msg.author.username)
        if(!score) {
            score = { id: `${msg.author.id}`, user: msg.author.username, points: 0}
        }
        score.points++;
        client.setPoints.run(score);
    }
    if(msg.channel.id == channels.BOT_TESTING && msg.content === 'Points') {
        return msg.reply(`You currently have ${score.points} 🤘🏻`)
    }
    if(msg.channel.id == channels.BOT_TESTING && msg.content.startsWith("#")) {
        let fullCommand = msg.content.substr(1)
        let splitCommand = fullCommand.split(" ")
        let primaryCommand = splitCommand[0]
        let commandArguments = splitCommand.slice(1)

        if(primaryCommand == "sesja"){
            console.log("Arguments are: " + commandArguments)
        }
        if(primaryCommand == "sesja" && commandArguments[0] == "help") {
            helpCommand(commandArguments.splice(1), msg)
        }
        if(primaryCommand == "sesja" && commandArguments[0] == "add") {
            msg.channel.send("Started adding...")
            console.log(commandArguments.length)
            if(commandArguments.length == 5) {
                let exam = {subject: commandArguments[1], date: commandArguments[2] + " " + commandArguments[3], professor: commandArguments[4]}
                sesja.client.setSesja.run(exam)
                msg.channel.send("Added new exam for: " + exam.subject + " on: " + exam.date)
            } else {
                msg.channel.send("Unfortunately you didn't specify all arguments... please type in `#sesja help add` for guidance 🤖")
            }
        }
        if(primaryCommand == "sesja" && commandArguments[0] == "getAll") {
            const exams = sesja.client.getSesja;
            msg.channel.send("Exams before you: ")
            for (const exam of exams.iterate()) {
                console.log(exam)
                msg.channel.send("Subject: " + exam.subject + " when: " + exam.date + " by: " + exam.professor);
            }
            
        }
        if(primaryCommand == "sesja" && commandArguments[0] == "get") {
            let exam = sesja.client.getSesjaForId.get(commandArguments[1]);
            if(exam === undefined) {
                msg.channel.send("There is no exam for this id number");
            } else {
                msg.channel.send("Exam you are looking for is: " + exam.subject + " on: " + exam.date + " by: " + exam.professor);
            }
        }
    }
});

function createPointsTable() {
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'points';").get();
    if(!table['count(*)']) {
        // If the table isn't there, create it and setup the database correctly.
        sql.prepare("CREATE TABLE points (id TEXT PRIMARY KEY, user TEXT, points INTEGER);").run();
        sql.prepare("CREATE UNIQUE INDEX idx_points_id ON points (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    client.getPoints = sql.prepare("SELECT * FROM points WHERE user = ?");
    client.setPoints = sql.prepare("INSERT OR REPLACE INTO points (id, user, points) VALUES (@id,@user,@points)");
}



function helpCommand(commandArgs, receivedMessage) {
    if(commandArgs.length == 0) {
        receivedMessage.channel.send("I'm not sure how can I help you. Try `#sesja help [topic]`");
    } else {
        receivedMessage.channel.send("It seems that you need help with: " + commandArgs);
    }
}

// eslint-disable-next-line no-undef
client.login(process.env.BOT_TOKEN);