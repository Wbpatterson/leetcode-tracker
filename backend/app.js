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
app.get('/', (req, res) => {
    res.sendFile((path.join(__dirname, '../views/index.html')));
});


app.get('/signup', (req, res) => {
    res.sendFile((path.join(__dirname, '../views/signup.html')));
});

app.get('/textbox/:langauge/:problem', (req, res) => {
    const language = req.params.langauge;
    let problem = req.params.problem;
    problem = problem.replaceAll("_", " ");
    console.log(req.params)
    let sql = `SELECT * FROM user_problems where problem='${problem}' and solution='${language}'`;
    connection.query(sql, (err, results, fields) => {
        if (err) throw err;
        res.status(200).json(results[0]);
    });
});


// keps track of signed in users 
loggedInUsers = new Set();


// handles verifying that a user is logged in before request for problem information can be made 
app.post('/login/:username/1', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // *remember to console.log(req.body) to see what is in this object
    let sql = `SELECT * FROM user_info where username_='${username}' and password_='${password}'`;
    connection.query(sql,  async (err, results, fields) => {
        if (err || results.length == 0){
            // if incorrect info is inputed login page is re-rendered with errot alert
            res.render('index', {message: "Incorrect Username or Password"}); 
        } else {
            const components = await mainPageComponents(username, 1);
            loggedInUsers.add(username);
            res.render('mainpage',
            {
                data: components.pageData, 
                currentPage: components.pageNumber, 
                totalPages: components.totalPages,
                username: username,
                easyCount: components.easyCount,
                mediumCount: components.mediumCount,
                hardCount: components.hardCount
            });
        } 
    })
});


// handles path to users problem page 
app.get('/:username/:page', async (req, res) => {
    const {username, page} = req.params;
    if (!loggedInUsers.has(username)){
        res.status(404).sendFile((path.join(__dirname, '../views/notfound.html')));
    } else{
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
    }
});


// retrieves user problem info and from server 
function mainPageComponents(username, page){
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM user_problems where username_='${username}'`;
        connection.query(sql, async (error, result, fields) => {
            if (error) reject(error);

            const easyCount = await problemCount(username, 'Easy', 'user_problems');
            const mediumCount = await problemCount(username, 'Medium', 'user_problems');
            const hardCount = await problemCount(username, 'Hard', 'user_problems');

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

// this function was made async so that i could return result.length in connection.query from function
function problemCount(username, difficulty, table){
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM ${table} where username_='${username}' and difficulty='${difficulty}'`;
        connection.query(sql,  (error, result, fields) => {
            if(error) return reject(error);
            resolve(result.length);
        });
    });
}

app.on('close', () => {
    connection.end();
})

app.listen(port, () => console.log(`server running on http://localhost:${port}`));