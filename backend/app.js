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
    console.log('You are now connected...');
});

// sends login page
app.get('/', function(req, res){
    res.sendFile((path.join(__dirname, '../views/index.html')));
});


app.get('/:username/:page', async (req, res) => {
    const {username, page} = req.params;
    let components = await mainPageComponents(username, page);
    res.render('mainpage',
        {
            data: components.pageData, 
            currentPage: components.pageNumber, 
            totalPages: components.totalPages,
            username: username,
            easyCount: components.easyCount,
            mediumCount: components.mediumCount,
            hardCount: components.hardCount
        }
    );
});


function mainPageComponents(username, page){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM user_problems where username_='${username}'`,
         async (error, result, fields) => {
            if (error) reject(error);

            const easyCount = await columnCount(username, 'Easy', 'user_problems');
            const mediumCount = await columnCount(username, 'Medium', 'user_problems');
            const hardCount = await columnCount(username, 'Hard', 'user_problems');

            const pageSize = 2;
            const pageNumber = parseInt(page) || 1;
            const startIdx = (pageNumber - 1) * pageSize;
            const endIdx = (startIdx+1) * pageSize;
            const pageData = result.slice(startIdx, endIdx); // holds info on each problem in a row

            resolve(
                {
                    pageData: pageData,
                    pageNumber: pageNumber,
                    totalPages: Math.ceil(result.length / pageSize),
                    easyCount: easyCount,
                    mediumCount: mediumCount,
                    hardCount: hardCount
                }
            );
        });
    });
}


function columnCount(username, difficulty, table){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} where username_='${username}' and difficulty='${difficulty}'`,
        (error, result, fields) => {
            if(error) return reject(error);
            resolve(result.length);
        });
    });
}


app.on('close', () =>{
    connection.end();
})

app.listen(port, () => console.log(`server running on http://localhost:${port}`));