const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticateToken(req:any,res:any,next:any){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.sendStatus(401);

    jwt.verify(token, config.auth.secretToken, (err:any, user:any) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

module.exports = { authenticateToken };  // Correct export
