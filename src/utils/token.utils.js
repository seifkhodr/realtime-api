/**
 * later use it 
 * https://auth0.com/
 */

const jwt = require('jsonwebtoken');
const getEnv = require('../config/env.config');


async function generateToken(payload){
    return jwt.sign(
        payload,
        getEnv('JWT_SECRET_KEY' , null),
        {
            expiresIn : getEnv('JWT_EXPIRATION_TIME' , null)
        }  
    );
}

async function verifyToken(token){
    return jwt.verify(token,getEnv('JWT_SECRET_KEY',null));
}

module.exports = {
    generateToken,
    verifyToken
}

/**
 * see the jwt website for more information
 * and jsonwebtoken package in the npm registery
 * 
 * https://github.com/auth0/node-jsonwebtoken
 * 
 * 
 * 
 * some errors to be handled later
 * TokenExpiredError
 * JsonWebTokenError
 */