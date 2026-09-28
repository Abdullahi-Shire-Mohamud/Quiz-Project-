const express = require("express");
const auth = require('../auth');
const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    console.log("Login attempt:", username);
    router.post('login/', auth.login);

});

module.exports = router;