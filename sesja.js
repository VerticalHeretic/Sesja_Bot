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
    }

}

export{Sesja}