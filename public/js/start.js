//this is javascript file for the client side- dom manipulation - api requests
// fetch api etc//

// Following code is a test to check if the server is running
console.log("JavaScript file loaded!");
async function testServerConnection() {
    const statusElement = document.getElementById("server-status");

    try {
        const response = await fetch("/api/test");

        if (!response.ok) {
            throw new Error("Server returned an error");
        }

        const data = await response.json();
        
        statusElement.textContent = data.message;
        console.log(data);
    } catch (error) {
        statusElement.textContent = "Could not connect to the server.";
        console.error(error);
    }
}

testServerConnection();