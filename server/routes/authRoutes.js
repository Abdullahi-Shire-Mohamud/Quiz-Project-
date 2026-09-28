const express = require("express");
const fs = require("fs");
const path = require("path");

const auth = require('../auth');
const router = express.Router();

const usersFile = path.join(
    __dirname,
    "..",
    "..",
    "database",
    "user.json"
);
// Login route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required."
        });
    }

    try {
        const fileData = fs.readFileSync(usersFile, "utf8");
        const users = JSON.parse(fileData);

        const user = users.find(
            (user) =>
                user.username === username &&
                user.password === password
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        return res.json({
            success: true,
            message: "Login successful.",
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
    console.log("Login attempt:", username);
    router.post('login/', auth.login);

        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});

module.exports = router;