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

// taskkill /f /im node.exe - kills of node processes

app.use(express.static( path.join(__dirname, '../public'))); // sends static .css & .js files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views')) // retrieves .ejs files from views folder
app.use(express.json());

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
});

// sends login page
app.get('/', function(req, res){
    res.sendFile((path.join(__dirname, '../views/mainpage.html')));
});


app.get('/:username/:page', (req, res) => {
    const {username, page} = req.params
    connection.query(`SELECT * FROM user_problems where username_='${username}'`, (err, result, fields) => {
        if (err) throw err;
        const pageSize = 5;
        const pageNumber = parseInt(page) || 1;
        const startIdx = (pageNumber - 1) * pageSize;
        const endIdx = (startIdx+1) * pageSize;
        const pageData = result.slice(startIdx, endIdx);
        
        res.render('mainpage', {data: pageData, currentPage: pageNumber, totalPages: Math.ceil(result.length / pageSize) })
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