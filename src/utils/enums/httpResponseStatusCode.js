const httpResponseSuccessCode = {
    OK : 200 ,
    CREATED : 201 ,
    ACCEPTED : 202 ,
    NO_CONTENT : 204
};

const httpResponseClientErrorCode={
    BAD_REQUEST : 400 ,
    UNAUTHORIZED: 401 ,
    FORBIDDEN : 403 ,
    NOT_FOUND : 404 , 
    CONFLICT : 409 ,
    UNPROCESSIBLE_CONTENT : 422 ,
    TO_MANY_REQUESTS :429
};

const httpResponseServerErrorCode = {
    INTERNAL_SERVER_ERROR : 500 ,
    SERVICE_UNVAILABLE : 503
};

module.exports = {
    httpResponseSuccessCode,
    httpResponseClientErrorCode,
    httpResponseServerErrorCode
};