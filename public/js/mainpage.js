
function test(pageIndex){
    const req = new XMLHttpRequest();
    req.open("GET", `/page=${pageIndex}`)
    console.log(req.rsesponse)
    return null
}

function sendHttpRequest(method, url, body=null){
    let promise = new Promise((resolve, rejest) => {
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
    return promise;
}

let getCount = (method, url) =>{
    sendHttpRequest(method, url).then(responseData => {
      console.log(responseData.response);
      document.getElementById("easy-num").textContent = responseData.response.easySolved || 0;
      document.getElementById("medium-num").textContent = responseData.response.mediumSolved || 0;
      document.getElementById("hard-num").textContent = responseData.response.hardSolved || 0;
    })
}

window.onload = () => {
    getCount("GEt","https://leetcode-stats-api.herokuapp.com/wbpatterson"); 
}



