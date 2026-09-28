
const validateAllowedField = (allowedFields)=>{
    return (req,res,next)=>{
        const receivedField = Object.keys(req.body || {});
        if(receivedField.length ===0){
            //Bad Request 
            const error = new Error('At least one field is required');
            return next(error);
        }

        const invalidFields = receivedField.filter((field)=> !allowedFields.includes(field));
        if(invalidFields.length !==0){
            //Bad Request
            const error = new Error('Invalid Fields' + invalidFields.join(', '));
            return next(error);
        }
        //is valid wrap it inside the body
        const data = {}
        for(const field of allowedFields){
            if(req.body[field] !==undefined)
                data[field] = req.body[field];
        }

        req.data = data;
        //pass to the next middleware
        next();
    }
};

export default validateAllowedField;