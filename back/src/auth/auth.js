module.exports = function  verifyToken (req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();

    } else {
        // Forbiden status
        res.sendStatus(403)
    }
}
