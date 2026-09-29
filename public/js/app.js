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

// Displays username beside "Test your knowledge" 
const usernameDisplay = document.querySelector("#usernameDisplay");

// Logout button
const logoutButton = document.querySelector("#logout-button");

// Main quiz content
const quizContent = document.querySelector("#quiz-content");

// Message shown when someone is not logged in
const loginRequired = document.querySelector("#login-required");

// Admin Dashboard navigation link
const adminNavItem = document.querySelector("#admin-nav-item");

// Navigation links only available to logged-in users
const homeNavItem = document.querySelector("#home-nav-item");
const resultsNavItem = document.querySelector("#results-nav-item");

// ------------------------------
// HERE WE CHECK LOGIN STATE
// ------------------------------

/*
    auth.js will save the following values in localStorage
    after a successful login.
*/
const username = localStorage.getItem("username");
const role = localStorage.getItem("role");


// ------------------------------
// USER IS LOGGED IN
// ------------------------------

if (username) {

    // User is logged in so we hide the Login/Register links and show the username + Logout section
    guestNav.hidden = true;
    userNav.hidden = false;
    loginRequired.hidden = true;
    quizContent.hidden = false;

    // Logged-in users can access Home and My Results
    homeNavItem.hidden = false;
    resultsNavItem.hidden = false;


    // Show the logged-in username in the hero section
    usernameDisplay.textContent = username;

    /*
    Only admins should see the Admin Dashboard link.
    */
    if (role === "admin") {
        adminNavItem.hidden = false;
    } else {
        adminNavItem.hidden = true;
    }
}


// ------------------------------
// USER IS NOT LOGGED IN
// ------------------------------

else {

    // Visitors should see Login and Register links, but not the username + Logout section
    guestNav.hidden = false;
    userNav.hidden = true;

    quizContent.hidden = true;
    loginRequired.hidden = false;

    adminNavItem.hidden = true;

    // Visitors should not see pages that require login
    homeNavItem.hidden = true;
    resultsNavItem.hidden = true;
}

// ------------------------------
// LOGOUT
// ------------------------------

if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        // Remove login information saved by auth.js
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        // Return to homepage
        window.location.href = "index.html";
    });

}