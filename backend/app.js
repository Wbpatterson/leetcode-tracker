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

app.use(express.static( path.join(__dirname, '../public'))); // serves static .css & .js files as if they were in root dir
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views')) // retrieves .ejs files from views folder
app.use(express.json());
app.use(express.urlencoded({extended: true}))

connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...');
});

// sends login page
app.get('/', function(req, res){
    res.sendFile((path.join(__dirname, '../views/index.html')));
});


app.post('/:username/:page', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try{
        await validateUser(username, password);
    } catch(e){
        console.log(e);
        res.render('index',
            {message: e}
        )
        return;
    }
    
    const components = await mainPageComponents(username, 1);

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
})


app.get('/:username/:page', async (req, res) => {
    const {username, page} = req.params;
    const components = await mainPageComponents(username, page);
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
            const pageData = result.slice(startIdx, endIdx); // holds info for current page problems

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

function validateUser(username, password) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM user_info where username_='${username}' and password_='${password}'`,
        (err, results, fields) => {
            if (err || results.length == 0)
                reject(new Error("no user found"))

            resolve("user found")
        })
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