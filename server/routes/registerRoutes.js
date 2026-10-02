const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersFile = path.join(
    __dirname,
    "..",
    "..",
    "database",
    "user.json"
);

// Register route (POST /api/login)
router.post("/register", async (req, res) => {
    const { username, password } = req.body;  // Here we get username and password sent by auth.js

    // Make sure both fields were provided
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required."
        });
    }

    try {
        // Read temporary users from user.json
        const fileData = fs.readFileSync(usersFile, "utf8");
        const users = JSON.parse(fileData);
        if(typeof username !== "string" || typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Username and password must be Strings"
        })};
        if(users.find(user => user.username.toLowerCase() === username.toLowerCase())) {//check if username exists
            return res.status(409).json({
                success: false,
                message: "Username already exists."
            });
        }
        const newUser = {
            id: users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1, // incremental id so deleting is safer
            username,
            password,
            role: "user"  // Default role for new users
        };

        users.push(newUser);
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
        // Successful registration
        // Do NOT send the password back to the frontend
        return res.json({
            success: true,
            message: "Register successful.",
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Register error:", error);
        console.log("Register attempt:", username);

        return res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});

module.exports = router;