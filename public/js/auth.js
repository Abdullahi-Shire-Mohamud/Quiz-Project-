const loginform = document.querySelector("#login-form");

loginform.addEventListener("submit", async (event) => {

    event.preventDefault();

    const username =
        document.querySelector("#username").value;

    const password =
        document.querySelector("#password").value;

    const messageElement =
        document.querySelector("#login-message");


    try {

        const response = await fetch("/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();


        if (response.ok && data.success) {
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("role", data.user.role)
            console.log("Logged in:", data);
            window.location.href = "index.html";

        } else {

            messageElement.textContent =
                data.message || "Login failed.";
        }


    } catch (error) {

        console.error("Login error:", error);

        messageElement.textContent =
            "Could not connect to the server.";
    }
});