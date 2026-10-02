import { UnauthorizedError } from '../utils/AppError.js';
import tokenUtils from '../utils/token.utils.js';

async function authMiddleware(req, res, next) {

    const accessTokenFromCookie = req.cookies?.accessToken;
    const authHeader = req.headers.authorization;

    const accessTokenFromHeader = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null;
        
    const accessToken = accessTokenFromCookie || accessTokenFromHeader;

    if (!accessToken) {
        const error = new UnauthorizedError('Authentication required');
        return next(error);
    }

    try {
        const authenticatedUser = await tokenUtils.verifyAccessToken(accessToken);
        if (authenticatedUser.type !== 'access')
            return next(new UnauthorizedError('Invalid access token'));

        //send it to the user;
        req.user = authenticatedUser;
        next();

    } catch (error) {
        return next(error);
    }
}

export default authMiddleware;