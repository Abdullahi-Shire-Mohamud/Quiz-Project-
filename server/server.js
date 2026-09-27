// Server for the Quiz Project
const express = require("express");
const app = express();
const PORT = 3000;
app.use('/', express.static('public'));

app.get("/welcome", (req, res) => {
res.send("Welcome to the REST API!");
});
//server side code for the quiz project - express server setup - 
// api endpoints - middleware etc//





app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});
//test//