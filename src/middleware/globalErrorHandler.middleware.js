/**
 * v1 handle normal error
 * 
 * v2(later)
 * handle the custom errors inside the utils/AppError.js
 * + handle the JsonWebToken errors
 * + handle mongoDB errors
 * + simple errors by js 
 */

function globalErrorHandler(err, req, res, next) {
    // DEBUGGING ERROR HANDLER
    // console.error("Global Error Handler caught:", err);
    // return res.status(err.status || err.statusCode || 500).json({
    //     message: err.message || 'Internal Server Error',
    //     errors: err.errors || undefined, // For validation errors
    //     // stack: err.stack
    // });

    
    // for no customized errors
    if(!err.isOperational){
        // not client errors like validation auth....
        return res.status(404).json({
            message : 'Route not found'
        })
    }
    // if client errors just format it 
    const patten= new RegExp(/^4\d{2}$/ , 'g');
    const status = err.statusCode.toString();

    if(pattern.test(status)){
        // start with 4xx so it's a client error
    }else{
    // 5XX so its an server error
    } 
    // now send the response after handle all this
    return res.status(err.statusCode).end();
    
}

export default globalErrorHandler;

/**
 *later read about the prcess -level handlers
 */