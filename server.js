const express = require("express");
const cors = require('cors');
const news = require("./app/news");
const comments = require("./app/comments");

const mysql = require("mysql");
const config = require("./config");
const db = require("./app/db/mysql");

const app = express();
const port = 8000;

const corsOption = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}

app.use(cors(corsOption));
app.use(express.json());
app.use(express.static("public"));

const connection = mysql.createConnection(config.db);

connection.connect(err => {
    if (err) {
        console.log(err);
        throw err;
    }

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    console.log("mysql connected");

    app.use("/news", news(db(connection)));
    app.use("/comments", comments(db(connection)));
});