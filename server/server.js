// Quiz Project Server

const express = require("express");
const path = require("path");
const pool = require("./db");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

// -------------------------------------
// Middleware
// -------------------------------------

// Allows the server to read JSON sent from the frontend
app.use(express.json());

// Makes files inside /public available in the browser
app.use(
    express.static(
        path.join(__dirname, "..", "public")
    )
);


// -------------------------------------
// API Routes
// -------------------------------------

// Authentication routes
// Example:
// POST /api/login
app.use("/api", authRoutes);


// -------------------------------------
// Test Routes
// -------------------------------------

// Simple welcome route
app.get("/welcome", (req, res) => {
    res.send("Welcome to the REST API!");
});


// Test if Express server is working
app.get("/api/test", (req, res) => {
    res.json({
        message: "Quiz API is working"
    });
});


// Test if PostgreSQL connection is working
app.get("/api/db-test", async (req, res) => {
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
    console.log(`Server running at http://localhost:${PORT}/client/index.html`);
});
//test//