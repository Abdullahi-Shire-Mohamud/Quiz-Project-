//read from user.json file and check if the input username and password match any user in the file.
//get the input username and password from the form, this via get.

const fs = require('fs');
fs.readFile('database/user.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const user = users.find(u => u.username === inputUsername && u.password === inputPassword);
    if (user) {
        //matches one of the users in the user.json file
        console.log('Authentication successful');
        user.find(u => u.role === 'admin') ? console.log('User is an admin') : console.log('User is a regular user');
    } else {
        // Authentication failed
        console.error('Authentication failed');
    }
});