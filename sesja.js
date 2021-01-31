import { MessageEmbed } from "discord.js";

class Sesja {

    constructor(sql, client) {
        this.sql = sql;
        this.client = client;
    }

    createSesjaTable() {
        const table = this.sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'sesja';").get();
        if(!table['count(*)']) {
            this.sql.prepare("CREATE TABLE sesja (id INTEGER PRIMARY KEY AUTOINCREMENT, subject TEXT, date TEXT, professor TEXT);").run();
            this.sql.pragma("synchronous = 1");
            this.sql.pragma("journal_mode = wal");
        }
        this.client.getSesjaLenght = this.sql.prepare("SELECT count(*) FROM sesja;");
        this.client.getSesja = this.sql.prepare("SELECT * FROM sesja");
        this.client.setSesja = this.sql.prepare("INSERT OR REPLACE INTO sesja (subject, date, professor) VALUES (@subject, @date, @professor);");
        this.client.getSesjaForSubject = this.sql.prepare("SELECT * FROM sesja WHERE subject = ?;");
        this.client.getSesjaForId = this.sql.prepare("SELECT * FROM sesja WHERE id = ?;");
        this.client.getSesjaForProfessor = this.sql.prepare("SELECT * FROM sesja WHERE professor = ?;");
        this.client.deleteExamForId = this.sql.prepare("DELETE FROM sesja WHERE id = ?;");

    }

    helpCommand(commandArgs, receivedMessage) {
        if(commandArgs.length === 0) {
            receivedMessage.channel.send("I'm not sure how can I help you. Try `#sesja help [topic]`");
        } else if(commandArgs[1] === "add") {
            receivedMessage.channel.send("This command is used for adding new exams to the list. To add new exam you need to type in: `#sesja add [name of subject] [date (YYYY-MM-DD HH:MM.)] [professor]` ");
        } else if(commandArgs[1] === "get") {
            receivedMessage.channel.send("This command is used for getting exams by (id, date, professor and subject). To use it just type in: `#sesja get [id || subject || professor || date]` ");
        } else if(commandArgs[1] === "getAll") {
            receivedMessage.channel.send("This command is used for getting all exams still before you. To use it just type in: `#sesja getAll` ");
        } else if(commandArgs[1] === "delete") {
            receivedMessage.channel.send("This command is used for deleting exams from the list. To use it just type in: `#sesja delete [id]`");
        } else {
            receivedMessage.channel.send("Unfortunately you have misspelled the command or I don't know that command yet. Here is what I know: ");
            const helpEmbedMessage = new MessageEmbed()
                .setColor('#fca4f7')
                .setTitle('Sesja Bot Help')
                .setURL('Sesja Bot', 'https://github.com/LSWarss/Sesja_Bot')
                .setDescription('Simple exam menagment bot, for students and them alike.')
                .addFields(
                    { name: "#sejsa add", value: "To add new exam you need to type in: `#sesja add [name of subject] [date (YYYY-MM-DD HH:MM.)] [professor]`" },
                    { name: "#sejsa get", value: "To get exam it just type in: `#sesja get [id || subject || professor || date]`" },
                    { name: "#sejsa getAll", value: "To get all exams just type in: `#sesja getAll`" },
                    { name: "#sejsa delete", value: "To delete exam just type in: `#sesja delete [id]`" },
                    { name: "Force", value: "Returns random STAR WARS quote"},
                    { name: "Points", value: "Returns your current number of points"}
                )
                .setTimestamp()
                .setFooter('Thanks for using my bot 🤘🏻', 'https://github.com/LSWarss');
            receivedMessage.channel.send(helpEmbedMessage);
        }

    }

    getCommandById(commandArgs, receivedMessage){
        let exam = this.client.getSesjaForId.get(commandArgs[1]);
            if(exam === undefined) {
                receivedMessage.channel.send("There is no exam for this id number");
            } else {
                receivedMessage.channel.send("Exam you are looking for is: " + exam.subject + " on: " + exam.date + " by: " + exam.professor);
            }
    }

    deleteCommandById(commandArgs, receivedMessage) {
        let exam = this.client.getSesjaForId.get(commandArgs[1]);
        if (exam === undefined) {
            receivedMessage.channel.send("There is no exam for this id number");
        } else {
            this.client.deleteExamForId.run(commandArgs[1]);
            receivedMessage.channel.send("Exam you have just deleted was: " + exam.subject + " on: " + exam.date + " by: " + exam.professor);
        }
    }

    addCommand(commandArgs, receivedMessage){
        receivedMessage.channel.send("Started adding...");
        if(commandArgs.length == 5) {
            let exam = {subject: commandArguments[1], date: commandArguments[2] + " " + commandArguments[3], professor: commandArguments[4]}
            this.client.setSesja.run(exam);
            receivedMessage.channel.send("Added new exam for: " + exam.subject + " on: " + exam.date);
        } else {
            receivedMessage.channel.send("Unfortunately you didn't specify all arguments... please type in `#sesja help add` for guidance 🤖");
        }

    }

}

export{Sesja}