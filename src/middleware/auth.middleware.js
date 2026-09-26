const jwt = require('jsonwebtoken');
const getEnv = require('../config/env.config');

function authMiddleware (req,res,next){
    // get the authorization header (e.g. Bearer ngjkfn12un4wejkfnrn....)
    const authHeader = req.headers.authorization;
    // check if exist or start with Bearer(valid format )
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        const error = new Error('unothorized');
        next(error);
    }
    // if valid get the token 
    const token = authHeader.split(' ')[1];

    try {
        // decode the values in the token
        const decoded = jwt.verify(token,getEnv('JWT_SECRET_KEY' , null));
        //send it to the user;
        req.user = decoded;
        next();

    } catch (error) {
        // jsonwebtoken errors 
        // handle them later
        next(error);
    }
}

module.exports = authMiddleware;