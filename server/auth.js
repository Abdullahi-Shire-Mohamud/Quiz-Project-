//read from user.json file and check if the input username and password match any user in the file.
//get the input username and password from the form, this via get.
const fs = require('fs');
function login(req,res){
    const {username, password} = req.body;
    fs.readFile('database/user.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const validusers = JSON.parse(data);
    const user = validusers.find(u => u.username === inputUsername && u.password === inputPassword);
    if (user) {
        //matches one of the users in the user.json file
        console.log('Authentication successful');
        user.find(u => u.role === 'admin') ? console.log('User is an admin') : console.log('User is a regular user');
        res.JSON({success : true, role : user.role})
    } else {
        // Authentication failed
        console.error('Authentication failed');
        res.JSON({success: false})
    }
});
}

module.exports = {login};
/*
app.post('/auth/login',async, express.urlencoded({ extended: true }) , (req, res) => {
// Access form fields from req.body
const { username, password } = req.body;
console.log('Username:', username);
console.log('Password:', password);
validuser.json({success: true});
});*/
