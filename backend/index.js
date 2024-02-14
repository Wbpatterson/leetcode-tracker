const express = require("express");
const app = express();

const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mango51',
    database: 'users'
});

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
});

connection.end();