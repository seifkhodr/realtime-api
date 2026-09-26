//return an middleware to check if the user is authorized to do this ops
function isAuthorize(...roles){
    return function(req,res,next){
        //get user from req (that is sended by the auth middleware)
        const user = req.user;
        //check if is defined(i.e that is auth and has a role in its token)

        if(!user || !user.role){
            const error = new Error('no authenticate');
            next(error);
        }
        //get the role 
        const role = user.role;
        //check if user role is matched to any allowed role
        const isAuthorized = roles.includes(role);
        //if not throw unauthorized error
        if(!isAuthorized){
            const error = new Error('not authorized');
            next(error);
        }
        //is authorized go to next middleware
        next();
    }
}

module.exports = isAuthorize;