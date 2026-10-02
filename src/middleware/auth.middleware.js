import { UnauthorizedError } from '../utils/AppError.js';
import tokenUtils from '../utils/token.utils.js';

async function authMiddleware(req, res, next) {

    const cookieToken = req.cookies?.accessToken;
    const authHeader = req.headers.authorization;

    const headerToken = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null;
        
    const token = cookieToken || headerToken;

    if (!token) {
        const error = new UnauthorizedError('Authentication required');
        return next(error);
    }

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