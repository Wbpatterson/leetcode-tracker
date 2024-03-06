console.log('Hello World!')

document.addEventListener("DOMContentLoaded", function () {
    
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        let username = document.getElementById("username").value;
        this.action = `/${username}/1`;
        console.log(username)
        this.submit();
      });
    
})