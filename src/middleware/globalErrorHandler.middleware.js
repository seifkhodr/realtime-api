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
    let message = err.isOperational ? err.message : 'Internal server error';
    let data = err.isOperational ? err.data : null;

    if (err instanceof SyntaxError && err.status === httpResponseClientErrorCode.BAD_REQUEST) {
        statusCode = httpResponseClientErrorCode.BAD_REQUEST;
        message = 'Invalid JSON request body';
        data = null;
    }

    if (err.code === 11000) {
        statusCode = httpResponseClientErrorCode.CONFLICT;
        message = 'Resource already exists';
        data = null;
    }

    if (err.name === 'ValidationError') {
        statusCode = httpResponseClientErrorCode.UNPROCESSIBLE_CONTENT;
        message = 'Validation failed';
        data = Object.values(err.errors).map(el => ({
            field: el.path,
            message: el.message
        }));
    }

    if (err.name === 'CastError') {
        statusCode = httpResponseClientErrorCode.BAD_REQUEST;
        message = `Invalid value for ${err.path}`;
        data = null;
    }

    if (err.name === 'MongoServerSelectionError' || err.name === 'MongoNetworkError') {
        statusCode = httpResponseServerErrorCode.SERVICE_UNVAILABLE;
        message = 'Database service unavailable';
        data = null;
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = httpResponseClientErrorCode.UNAUTHORIZED;
        message = 'Invalid or expired token';
        data = null;
    }

    if (statusCode >= httpResponseServerErrorCode.INTERNAL_SERVER_ERROR) {
        data = null;
    }

    if (statusCode >= httpResponseServerErrorCode.INTERNAL_SERVER_ERROR) {
        console.error(err);
    }

    const response = statusCode >= httpResponseServerErrorCode.INTERNAL_SERVER_ERROR
        ? httpErrorResponse(message, data)
        : httpFailResponse(message, data);

    return res.status(statusCode).json(response);
}

export default globalErrorHandler;