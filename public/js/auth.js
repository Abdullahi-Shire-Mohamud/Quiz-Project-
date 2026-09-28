//Here username and password are saved as variables, these variables
//are sent for authentication and then send user to index.html
const login = document.querySelector(".button");//make the tag login-button
async function login() {
//const inputUsername = document.querySelector("#username").value; // Make the tag username
//const inputPassword = document.querySelector("#password").value; // make the tag password
const inputUsername = "user";
const inputPassword = "password";
    const response = await fetch("/auth/login",{
        method: "POST",
        headers : {"content-Type": "application/json"},
        body : JSON.stringify({inputUsername,inputPassword})
        
    })
    const validuser = await response.json();
    if(validuser.success){
    window.location.href = "index.html";
}
else {
    alert("Login failed");
}
}
login.addEventlistener("Login", (e) =>{
    e.preventDefault();
    login();
});






