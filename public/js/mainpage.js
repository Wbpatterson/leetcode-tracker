
const itemPerPage = 20;

// need to send a get request upon opening main page
// url can be /:username/page=:val

let currPage = 0

if (currPage === 0){
    console.log(currPage)
} else {
    console.log(`currPage is not zero but${currPage}`)
}

currPage++;

function test(pageIndex){
    const req = new XMLHttpRequest();
    req.open("GET", `/page=${pageIndex}`)
    console.log(req.response)
    return null
}

function createProblemTable(pageIndex, username){
    const req = new XMLHttpRequest();
    req.open("POST", `/page=${pageIndex}`)
    req.send(username)
    req.responseType = 'json';
    let data = req.response;
    let table = document.getElementsByClassName("problem-stats")[0];

    let numPages = data.length / itemPerPage;
    let startIndex = itemPerPage * pageIndex;
    let endIndex = itemPerPage * (startIndex + pageIndex)

    while (startIndex < endIndex && startIndex < data.length){
        let newRow = table.insertRow(1); // always going to insert after main headers
        newRow.insertCell(0).innerHTML = data.username_;
        newRow.insertCell(1).innerHTML = data.difficulty;
        newRow.insertCell(2).innerHTML = data.topic;
        newRow.insertCell(3).innerHTML = data.time_;
        newRow.insertCell(4).innerHTML = data.solution;
        startIndex+=1
    }

    return null ;
}

let header = document.getElementsByTagName("h1")[0];
header.innerHTML = "It works";



