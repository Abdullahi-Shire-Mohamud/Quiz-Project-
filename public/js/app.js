/*
    App.js will handle general homepage behaviour, meaning it will:
    - check if a user is logged in
    - show/hide quizzes
    - change Login/Register into username + Logout
    - show the Admin Dashboard link for admins
    - handle logout
    - MORE INCOMING!
*/

// ------------------------------
// FIRST WE GET ELEMENTS FROM THE PAGE
// ------------------------------


// Login and Register links shown to visitors
const guestNav = document.querySelector("#guest-nav");

// Username and Logout section shown to logged-in users
const userNav = document.querySelector("#user-nav");


// Displays the logged-in username beside "Test your knowledge"
const usernameDisplay =
    document.querySelector("#usernameDisplay");

// Logout button
const logoutButton = document.querySelector("#logout-button");

// Main quiz content
const quizContent = document.querySelector("#quiz-content");

// Message shown when someone is not logged in
const loginRequired = document.querySelector("#login-required");

// Admin Dashboard navigation link
const adminNavItem = document.querySelector("#admin-nav-item");

// ------------------------------
// HERE WE CHECK LOGIN STATE
// ------------------------------

/*
    Try to get the logged-in user from sessionStorage.

    sessionStorage stores values as strings,
    so the user was previously stored using JSON.stringify().
*/
const storedUser = sessionStorage.getItem("currentUser");

// Start with no logged-in user
let currentUser = null;

/*
    If currentUser exists in sessionStorage,
    convert the JSON string back into a JavaScript object.
*/
if (storedUser) {
    currentUser = JSON.parse(storedUser);
}



// ------------------------------
// USER IS LOGGED IN
// ------------------------------

if (currentUser) {

    // User is logged in so we hide the Login/Register links and show the username + Logout section
    guestNav.hidden = true;
    userNav.hidden = false;

    quizContent.hidden = false;
    loginRequired.hidden = true;

    // Show the logged-in username in the hero section
    usernameDisplay.textContent = currentUser.username;
    
    /*
    Only admins should see the Admin Dashboard link.
   
    his controls what is visible in the interface.
        IMPORTANT:
           Real admin security must also be checked
           by the backend.
    */
    if (currentUser.role === "admin") {
        adminNavItem.hidden = false;
    }


    // ------------------------------
    // USER IS NOT LOGGED IN
    // ------------------------------

} else {

    // Visitors should see Login and Register links, but not the username + Logout section
    guestNav.hidden = false;
    userNav.hidden = true;

    quizContent.hidden = true;
    loginRequired.hidden = false;

    adminNavItem.hidden = true;
}

// ------------------------------
// LOGOUT
// ------------------------------

if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        sessionStorage.removeItem("currentUser");

        window.location.href = "index.html";
    });

}