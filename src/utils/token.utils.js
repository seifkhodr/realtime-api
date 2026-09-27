/**
 * later use it 
 * https://auth0.com/
 */

import jwt from 'jsonwebtoken';
import getEnv from '../config/env.config.js';


async function generateToken(payload){
    // create the token with the payload and the secret key and the expiration time
    return jwt.sign(
        payload,
        getEnv('JWT_SECRET_KEY' , null),
        {
            expiresIn : getEnv('JWT_EXPIRATION_TIME' , null)
        }  
    );
}

async function verifyToken(token){
    // verify the token with the secret key
    return jwt.verify(token,getEnv('JWT_SECRET_KEY',null));
}

export default {
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