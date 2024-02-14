const express = require("express");
const app = express();
const path = require('path');
const port = 8000;

const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mango51',
    database: 'users'
});

app.use('/public', express.static( '../frontend/public'));

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
});

// sends login page
app.get('/', function(request, response){
    response.sendFile((path.join(__dirname, '../frontend/views/index.html')));
});

app.listen(port, () => console.log(`server running on http://localhost:${port}`));

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

function validateLeetcodeProfile(username){
    connection.query(`SELECT * FROM user_info where leetcode_profile=${username}`, (err, result, fields) => {

    })
}

checkUser('wbpatterson', 'momdad40');
connection.end();