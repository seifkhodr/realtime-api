function isAuthorize(...roles){
    return function(req,res,next){
        const user = req.user;
        if(!user || !user.role){
            const error = new Error('no authenticate');
            next(error);
        }
        const role = user.role;

        const isAuthorized = roles.includes(role);
        if(!isAuthorized){
            const error = new Error('not authorized');
            next(error);
        }
        //is authorized go to next middleware
        next();
    }
}

module.exports = isAuthorize;