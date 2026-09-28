// Server for the Quiz Project
const express = require("express");
const path = require("path");
const pool = require("./db");

//Routes
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;
//for routing auth.js to server auth.js(mount)

// Middleware 
app.use(express.json());

// Serve frontend files from the public folder
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api", authRoutes);

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

app.get("/api/db-test", async (req, res) => { // Test endpoint to check if the database connection is working
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connection is working",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
//test//