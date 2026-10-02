import {
    httpResponseClientErrorCode,
    httpResponseServerErrorCode
} from '../utils/enums/httpResponseStatusCode.js';
import {
    httpFailResponse,
    httpErrorResponse
} from '../utils/httpResponseFormatter.js';

function globalErrorHandler(err, req, res, next) {
    let statusCode = err.statusCode || httpResponseServerErrorCode.INTERNAL_SERVER_ERROR;
    let errorMessage = err.isOperational ? err.message : 'Internal server error';
    let responseData = err.isOperational ? err.data : null;

    if (err instanceof SyntaxError && err.status === httpResponseClientErrorCode.BAD_REQUEST) {
        statusCode = httpResponseClientErrorCode.BAD_REQUEST;
        errorMessage = 'Invalid JSON request body';
        responseData = null;
    }

    if (err.code === 11000) {
        statusCode = httpResponseClientErrorCode.CONFLICT;
        errorMessage = 'Resource already exists';
        responseData = null;
    }

    if (err.name === 'ValidationError') {
        statusCode = httpResponseClientErrorCode.UNPROCESSIBLE_CONTENT;
        errorMessage = 'Validation failed';
        responseData = Object.values(err.errors).map(el => ({
            field: el.path,
            message: el.message
        }));
    }

    if (err.name === 'CastError') {
        statusCode = httpResponseClientErrorCode.BAD_REQUEST;
        errorMessage = `Invalid value for ${err.path}`;
        responseData = null;
    }

    if (err.name === 'MongoServerSelectionError' || err.name === 'MongoNetworkError') {
        statusCode = httpResponseServerErrorCode.SERVICE_UNVAILABLE;
        errorMessage = 'Database service unavailable';
        responseData = null;
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = httpResponseClientErrorCode.UNAUTHORIZED;
        errorMessage = 'Invalid or expired token';
        responseData = null;
    }

    if (statusCode >= httpResponseServerErrorCode.INTERNAL_SERVER_ERROR) {
        responseData = null;
    }

    if (statusCode >= httpResponseServerErrorCode.INTERNAL_SERVER_ERROR) {
        console.error(err);
    }

    const formattedResponse = statusCode >= httpResponseServerErrorCode.INTERNAL_SERVER_ERROR
        ? httpErrorResponse(errorMessage, responseData)
        : httpFailResponse(errorMessage, responseData);

    return res.status(statusCode).json(formattedResponse);
}

export default globalErrorHandler;