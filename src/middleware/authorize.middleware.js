import { ForbiddenError, UnauthorizedError } from '../utils/AppError.js';

//return an middleware to check if the user is authorized to do this ops
function isAuthorize(...roles) {
    return function (req, res, next) {
        //get user from req (that is sended by the auth middleware)
        const authenticatedUser = req.user;
        //check if is defined(i.e that is auth and has a role in its token)

        if (!authenticatedUser || !authenticatedUser.role) {
            const error = new UnauthorizedError('Authentication required');
            return next(error);
        }
        //get the role 
        const authenticatedUserRole = authenticatedUser.role;
        //check if user role is matched to any allowed role
        const isAuthorized = roles.includes(authenticatedUserRole);
        //if not throw unauthorized error
        if (!isAuthorized) {
            const error = new ForbiddenError('You do not have permission to perform this action');
            return next(error);
        }
        //is authorized go to next middleware
        next();
    }
}

export default isAuthorize;