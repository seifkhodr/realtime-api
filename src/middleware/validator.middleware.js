import { validationResult } from 'express-validator';

function validatorMiddleware(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){

        const errorFormatter = errors.array().map((error)=>{
            if(error.type === 'field'){
                return {
                path : error.path,
                message : error.msg
                }
            }else{
                return {
                    message : error.msg
                }
            }
        });
        //implement unprocessibl entity error later
        const error = new Error('Validation Failed');
        error.status = 400;
        //later send it using custom one 
        error.errors=errorFormatter;
        return next(error);
    }

    //validation success
    return next();
}

export default validatorMiddleware;