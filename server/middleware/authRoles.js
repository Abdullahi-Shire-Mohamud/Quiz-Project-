const crypto = require("crypto");


// Temporary session storage on the server
const sessions = new Map();


// Create a session after successful login
function createSession(user) {

    const sessionId =
        crypto.randomUUID();

    sessions.set(sessionId, {
        id: user.id,
        username: user.username,
        role: user.role
    });

    return sessionId;
}


// Read session id from cookie
function getSessionId(req) {

    const cookieHeader =
        req.headers.cookie;

    if (!cookieHeader) {
        return null;
    }


    const cookies =
        cookieHeader.split(";");


    for (const cookie of cookies) {

        const [name, value] =
            cookie.trim().split("=");

        if (name === "sessionId") {
            return value;
        }
    }


    return null;
}


// Check that the user is logged in
function authUser(req, res, next) {

    const sessionId =
        getSessionId(req);

    const user =
        sessions.get(sessionId);


    if (!user) {

        return res.status(401).json({
            success: false,
            message: "You must be logged in."
        });
    }


    // Store user information on the request
    req.user = user;

    next();
}


// Check that the logged-in user is an admin
function authAdmin(req, res, next) {

    const sessionId =
        getSessionId(req);

    const user =
        sessions.get(sessionId);


    if (!user) {

        return res.status(401).json({
            success: false,
            message: "You must be logged in."
        });
    }


    if (user.role !== "admin") {

        return res.status(403).json({
            success: false,
            message: "Admin access required."
        });
    }


    req.user = user;

    next();
}


module.exports = {
    createSession,
    authUser,
    authAdmin,
    sessions
};