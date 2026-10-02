import { BadRequestError } from '../utils/AppError.js';

const validateAllowedField = (allowedFields, { requireField = true } = {})=>{
    return (req,res,next)=>{

        const receivedField = Object.keys(req.body || {});

        if(requireField && receivedField.length ===0){
            return next(new BadRequestError('At least one field is required'));
        }

        const invalidFields = receivedField.filter((field)=> !allowedFields.includes(field));

        if(invalidFields.length !==0){
            return next(new BadRequestError(
                `Invalid fields: ${invalidFields.join(', ')}`,
                { fields: invalidFields }
            ));
        }
        
        //is valid wrap it inside the body
        const sanitizedData = {};
        for(const field of allowedFields){
            if(req.body[field] !==undefined)
            sanitizedData[field] = req.body[field];
        }

        req.data = sanitizedData;
        //pass to the next middleware
        next();
    }
};

export default validateAllowedField;