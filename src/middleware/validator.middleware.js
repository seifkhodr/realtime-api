import { validationResult } from 'express-validator';
import { UnprocessableEntityError } from '../utils/AppError.js';

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
        const error = new UnprocessableEntityError('Validation failed', errorFormatter);
        return next(error);
    }

    //validation success
    return next();
}

export default validatorMiddleware;