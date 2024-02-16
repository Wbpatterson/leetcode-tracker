// Imports
const express = require("express");
const path = require('path');
const mysql = require('mysql')
const {json} = require("express");
const ejs = require('ejs');

// Inits
const app = express();
const port = 3000;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mango51',
    database: 'users'
});

app.use(express.static( path.join(__dirname, '../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'))
app.use(express.json());

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
});

// sends login page
app.get('/', function(req, res){
    res.sendFile((path.join(__dirname, '../views/mainpage.html')));
});

let userData = [];
const pageSize = 2;
app.get('/:username/page=:val', (req, res) => {
    const {username, value} = req.params;
    connection.query(`SELECT * FROM user_problems where username_='${username}'`, (err, result, fields) => {
        if (err) throw err;
        const page = parseInt(value) || 1;
        const startIdx = (page - 1) * pageSize;
        const endIdx = (startIdx+1) * pageSize;
        const pageData = result.slice(startIdx, endIdx);

        res.render('mainpage', {data: pageData, currentPage: page, totalPages: Math.ceil(userData.length / pageSize) })
    })
});

function getUserProblems(username){
     connection.query(`SELECT * FROM user_problems where username_='${username}'`, (err, result, fields) => {
        if (err) throw err;
        console.log(result)
        return result
    })
}

// function to check if user is in database
function checkUser(username=null, password=null){
    connection.query(`SELECT * FROM user_info where username_='${username}' and password_='${password}'`,
        (err, result, fields) => {
        if(err) throw err;

        if (result.length !== 0)
            console.log(result)
        else
            console.log("User not found!")
    })
}

app.listen(port, () => console.log(`server running on http://localhost:${port}`));
