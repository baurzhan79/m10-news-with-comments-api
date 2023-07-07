const express = require("express");

const mysql = require("mysql");
const config = require("./config");
const db = require("./app/db/mysql");

const app = express();
const port = 8000;

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
});