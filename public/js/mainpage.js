/*
    It makes more sense to have problem stats display completed problems on site rather than wasting 
    resource making request to leetcode for irrelevant information

    create a function in app.js call columnCount(table, column, value) where it retrieves
    the count of columns that match the value
*/
function sendHttpRequest(method, url, body=null){
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open(method, url);
        request.responseType = "json";

        request.onload = () => {
            resolve(request);
        }

        if (method === "GET")
            request.send();
        else
            request.send(body);
    })
}


let getCount = (method, url) =>{
    sendHttpRequest(method, url).then(responseData => {
      console.log(responseData.response);
      document.getElementById("easy-num").textContent = responseData.response.easySolved || 0;
      document.getElementById("medium-num").textContent = responseData.response.mediumSolved || 0;
      document.getElementById("hard-num").textContent = responseData.response.hardSolved || 0;
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

function createButtons(){
    let pages = document.getElementById("page-div"),
        username = document.getElementById("user").textContent,
        pageCount = document.getElementById("totalPages").value;

    console.log(pageCount)

    for (let index = 1;  index <= pageCount; ++index){
            let button = document.createElement("a");
            button.href = `http://localhost:3000/${username}/${index}`;
            button.textContent = index;
            pages.append(button);
    }
}

function openPopUp(){
    let popup = document.getElementsByClassName("pop-up")[0];
    popup.style.visibility = "visible";
}

function closePopUp(){
    let popup = document.getElementsByClassName("pop-up")[0];
    popup.style.visibility = "hidden";
}

document.addEventListener('DOMContentLoaded', function() {
    // getCount("GEt","https://leetcode-stats-api.herokuapp.com/wbpatterson"); makes request for offical leetcode information

    // applies appropriate color to each question based on difficulty
    let diff = document.getElementsByClassName("difficulty");
    for (let input of diff) applyColor(input);

    // makes pagination for problem page upon loading
    createButtons();
});

