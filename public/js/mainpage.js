
function sendHttpRequest(method, url, body=null){
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open(method, url);
        //request.responseType = "json";

        request.onload = () => { resolve(request); }

        if (method === "GET")
            request.send();
        else
            request.send(body);
    });
}

function applyColor(obj){
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

function createButtons(){
    let pages = document.getElementById("page-div"),
        username = document.getElementById("user").textContent
        //pageCount = document.getElementById("totalPages").value;
        const ViewablePages = 6; // max number of pages to show for a page 

    for (let index = 1;  index <= ViewablePages; ++index) {
        let button = document.createElement("a");
        button.href = `http://localhost:3000/${username}/${index}`; 
        button.textContent = index;
        pages.append(button);
    }
}

function openPopUp(problem, language){
    let popup = document.getElementsByClassName("pop-up")[0];
    // made spaces _ so problems with spaces in name can be parameters
    problem = problem.replaceAll(" ", "_"); 
    
    sendHttpRequest('GET', `http://localhost:3000/textbox/${language}/${problem}`).then(Data => {
        let result = JSON.parse(Data.responseText);
        let editor = ace.edit("editor");
        editor.setValue(result.solution);
        editor.setTheme("ace/theme/monokai");
        editor.setShowPrintMargin(false);
        editor.session.setMode("ace/mode/javascript");
    });
    popup.style.visibility = "visible";
}

// add step to send data to server (post)
function closePopUp(){
    let popup = document.getElementsByClassName("pop-up")[0];
    let editor = ace.edit("editor");
    editor.setValue("");
    popup.style.visibility = "hidden";
}

document.addEventListener('DOMContentLoaded', () => {
    // applies appropriate color to each question based on difficulty
    let diff = document.getElementsByClassName("difficulty");
    for (let input of diff) 
        applyColor(input);

    // makes pagination for problem page upon loading
    createButtons();
});

