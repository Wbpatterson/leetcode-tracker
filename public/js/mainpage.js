/*
    create a function in app.js call columnCount(table, column, value) where it retrieves
    the count of columns that match the value
*/
function sendHttpRequest(method, url, body=null){
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open(method, url);
        //request.responseType = "json";

        request.onload = () => {
            resolve(request);
        }

        if (method === "GET")
            request.send();
        else
            request.send(body);
    })
}

function applyColor(obj){
    // make this a switch statment
    switch(obj.textContent){
        case "Easy":
            obj.style.color = "#4BF967";
            break;
        
        case "Medium":
            obj.style.color = "#F7C647";
            break;
        
        case "Hard":
            obj.style.color = "#F63131";
            break;
    }
}

const ViewablePages = 6; // max number of pages to show for a page 

function createButtons(){
    let pages = document.getElementById("page-div"),
        username = document.getElementById("user").textContent,
        pageCount = document.getElementById("totalPages").value;


    for (let index = 1;  index <= pageCount; ++index) {
        let button = document.createElement("a");
        button.href = `http://localhost:3000/${username}/${index}`; 
        button.textContent = index;
        pages.append(button);
    }
}

function openPopUp(problem, language){
    let popup = document.getElementsByClassName("pop-up")[0];
    let textbox = document.getElementById("coding-box");
    problem = problem.replaceAll(" ", "_");
    //console.log(problem)
    sendHttpRequest('GET', `http://localhost:3000/textbox/${language}/${problem}`)
    .then(Data => {
        let result = JSON.parse(Data.responseText);
        textbox.value = result.solution;
        // console.log(result);
    });
    popup.style.visibility = "visible";
}

function closePopUp(){
    let popup = document.getElementsByClassName("pop-up")[0];
    let textobx = document.getElementById("coding-box");
    // add step to send data to server (post)
    textobx.value = ""
    popup.style.visibility = "hidden";
}


document.addEventListener('DOMContentLoaded', function() {
    // getCount("GEt","https://leetcode-stats-api.herokuapp.com/wbpatterson"); makes request for offical leetcode information

    // applies appropriate color to each question based on difficulty
    let diff = document.getElementsByClassName("difficulty");
    for (let input of diff) 
        applyColor(input);

    // makes pagination for problem page upon loading
    createButtons();

    // adds support for tab in <textarea> 
    document.getElementById('coding-box').addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;

            // Set textarea value to: text before caret + tab + text after caret
            this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);

            // Put caret at the right position again
            this.selectionStart = this.selectionEnd = start + 1;
        }
    });
});

