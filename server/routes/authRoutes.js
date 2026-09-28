const express = require("express");

const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    console.log("Login attempt:", username);

    // Authentication will be connected to the database later.
    res.status(501).json({
        success: false,
        message: "Login authentication is not implemented yet."
    });
});

module.exports = router;