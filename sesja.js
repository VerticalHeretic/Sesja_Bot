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
        if(commandArgs.length == 0) {
            receivedMessage.channel.send("I'm not sure how can I help you. Try `#sesja help [topic]`");
        } else {
            receivedMessage.channel.send("It seems that you need help with: " + commandArgs);
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

}

export{Sesja}