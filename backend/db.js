const sqlite3 = require("sqlite3").verbose();

const path = require("path");
const fs = require("fs");

//Create database path
const dbPath = path.join(__dirname, "data", "app.db");

//Connect to database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Could not connect to database", err.message);
    }
    else {
        console.log("Connected to database");
    }
});

//Enable foreign key constraints
db.run("PRAGMA foreign_keys = ON");

//create path to sql model
const modelPath = path.join(__dirname, "model.sql");
//Read SQL model file, convert to readable string, and execute to create tables
const modelSQL = fs.readFileSync(modelPath, "utf-8");

db.exec(modelSQL, (err) => {
    if (err) {
        console.error("Could not create tables", err.message);
    }
    else {
        console.log("Tables created successfully");
    }
});

module.exports = db;


