// Server for the Quiz Project
const express = require("express");
const app = express();
const PORT = 3000;

// Middleware 
app.use(express.json());
app.use('/', express.static('public'));

app.get("/welcome", (req, res) => {
    res.send("Welcome to the REST API!");
});
//server side code for the quiz project - express server setup - 
// api endpoints - middleware etc//

app.get("/api/test", (req, res) => { // Test endpoint to check if the API is working
    res.json({
        message: "Quiz API is working"
    });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
//test//