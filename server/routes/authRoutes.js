const express = require('express');//connects  server.js to server/auth.js
const auth = require('../auth');

const router = express.Router();

router.post('/login', auth.login);
//router.post('/logout', auth.logout); could make it so u can log in and it
//stays logged in until you log out regardless if u shut down the website or not

module.exports = router;
module.exports = {login};
