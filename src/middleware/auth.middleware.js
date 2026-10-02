import { UnauthorizedError } from '../utils/AppError.js';
import tokenUtils from '../utils/token.utils.js';

async function authMiddleware(req, res, next) {
    // get the authorization header (e.g. Bearer ngjkfn12un4wejkfnrn....)
    const authHeader = req.headers.authorization;
    // check if exist or start with Bearer(valid format )
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error = new UnauthorizedError('Authentication required');
        return next(error);
    }
    // if valid get the token 
    const token = authHeader.split(' ')[1];

    try {
        const decoded = await tokenUtils.verifyAccessToken(token);
        if (decoded.type !== 'access')
            return next(new UnauthorizedError('Invalid access token'));

        //send it to the user;
        req.user = decoded;
        next();

    } catch (error) {
        return next(error);
    }
}

export default authMiddleware;