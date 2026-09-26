const jwt = require('jsonwebtoken');
const getEnv = require('../config/env.config');

function authMiddleware (req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        const error = new Error('unothorized');
        next(error);
    }
    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(token,getEnv('JWT_SECRET_KEY' , null));
        req.user = decoded;
        next();

    } catch (error) {
        next(error);
    }
}

module.exports = authMiddleware;