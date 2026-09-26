/**
 * v1 handle normal error
 * 
 * v2(later)
 * handle the custom errors inside the utils/AppError.js
 * + handle the JsonWebToken errors
 * + handle mongoDB errors
 * + simple errors by js 
 */

function globalErrorHandler(err , req , res , next){
    // for no customized errors
    if(!err.isOperational){
        // not client errors like validation auth....
        
    }
    // if client errors just format it 
    const patten= new RegExp(/^4\d{2}$/ ,flags);
    const status = err.statusCode.toString();

    if(pattern.test(status)){
        // start with 4xx so it's a client error
    }else{
    // 5XX so its an server error
    } 
    // now send the response after handle all this
    res.status(err.statusCode).end();
}

module.exports = globalErrorHandler;

/**
 *later read about the prcess -level handlers
 */