/**
 * 
 * following the jsend standard
 * for more -> https://github.com/omniti-labs/jsend
 */

/**
 * 
 * for sucess { status , return data || null if no payload}
 * for error {status , message}
 * for fail {status , message ,data is optional since it contain the errors maybe called it errors} 
 */
import httpStatusText from './enums/httpResponseStatusText.js';

function httpResponseFactory(status,code,data,message){
    if(status === httpStatusText.SUCCESS){
        return {
            status ,
            data
        }
    }else{
        return {
            status ,
            message ,
            data
        }
    }
}

// to be changed when implement the ui
function httpSuccessResponse(data){
    return httpResponseFactory(httpStatusText.SUCESS,null,data,null);
}

// to be changed later when implement the ui
function httpFailResponse(message,data){
    return httpResponseFactory(httpStatusText.FAIL,null,data,message);
}

//to be changed later when implement the ui
function  httpErrorResponse(message,data){
    return httpResponseFactory(httpStatusText.ERROR)
}

export default {
    httpSuccessResponse,
    httpFailResponse,
    httpErrorResponse
}
