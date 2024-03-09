
document.addEventListener("DOMContentLoaded", function () {
    
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        let username = document.getElementById("username").value || "unknown";
        this.action = `/login/${username}/1`;
        this.submit();

        document.getElementById("username").value = " ";
        document.getElementById("password").value = " ";
      });
})