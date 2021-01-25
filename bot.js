console.log('Beep beep 🦾 ')

// CONSTANTS 
const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const SQLLite = require("better-sqlite3")
const sql = new SQLLite('./data/data.sqlite')

const replies = [
    "The Force will be with you. Always. ✨ ",
    "“I find your lack of faith disturbing. 🤖 ",
    "Now, young Skywalker, you will die. ⚡️ ", 
    "It's no use Anakin I have the high ground 🏔"
];

client.on('ready', () => {
    console.log('💙');
    createPointsTable();
    createSesjaTable();
});

client.on('message', msg => {
    if (msg.author.bot) return;
    let score;
    if( msg.channel.id == '802931490019082300' && msg.content === 'Force') {
        const index = Math.floor(Math.random() * replies.length);
        msg.channel.send(replies[index]);
    }
    if (msg.channel.id == '802931490019082300') {
        score = client.getPoints.get(msg.author.username)
        if(!score) {
            score = { id: `${msg.author.id}`, user: msg.author.username, points: 0}
        }
        score.points++;
        client.setPoints.run(score);
    }
    if(msg.channel.id == '802931490019082300' && msg.content === 'Points') {
        return msg.reply(`You currently have ${score.points} 🤘🏻`)
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

function createSesjaTable() {
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'sesja';").get();
    if(!table['count(*)']) {
        sql.prepare("CREATE TABLE sesja (id INTEGER AUTOINCREMENT, subject TEXT, when TEXT, professor TEXT);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
    client.getSesja = sql.prepare("SELECT * FROM sesja");
    client.setSesja = sql.prepare("INSERT OR REPLACE INTO sesja (subject, when, professor) VALUES (@subject, @when, @professor");
    client.getSesjaForSubject = sql.prepare("SELECT * FROM sesja WHERE subject = ?");
    client.getSesjaForProfessor = sql.prepare("SELECT * FROM sesja WHERE professor = ?")
}


client.login(process.env.BOT_TOKEN);
