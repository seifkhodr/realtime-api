import {
    httpResponseClientErrorCode,
    httpResponseServerErrorCode
} from './enums/httpResponseStatusCode.js';
import httpStatusText from './enums/httpResponseStatusText.js';

class AppError extends Error {
    constructor(message, statusCode, statusText = httpStatusText.FAIL, data = null) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.data = data;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    constructor(message = 'Bad request', data = null) {
        super(message, httpResponseClientErrorCode.BAD_REQUEST, httpStatusText.FAIL, data);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Authentication required', data = null) {
        super(message, httpResponseClientErrorCode.UNAUTHORIZED, httpStatusText.FAIL, data);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Access forbidden', data = null) {
        super(message, httpResponseClientErrorCode.FORBIDDEN, httpStatusText.FAIL, data);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Resource not found', data = null) {
        super(message, httpResponseClientErrorCode.NOT_FOUND, httpStatusText.FAIL, data);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Resource already exists', data = null) {
        super(message, httpResponseClientErrorCode.CONFLICT, httpStatusText.FAIL, data);
    }
}

class UnprocessableEntityError extends AppError {
    constructor(message = 'Request cannot be processed', data = null) {
        super(message, httpResponseClientErrorCode.UNPROCESSIBLE_CONTENT, httpStatusText.FAIL, data);
    }
}


class BadGatewayError extends AppError {
    constructor(message = 'Bad gateway', data = null) {
        super(message, httpResponseServerErrorCode.BAD_GATEWAY, httpStatusText.ERROR, data);
    }
}

class InternalServerError extends AppError {
    constructor(message = 'Internal server error', data = null) {
        super(message, httpResponseServerErrorCode.INTERNAL_SERVER_ERROR, httpStatusText.ERROR, data);
    }
}

class ServiceUnavailableError extends AppError {
    constructor(message = 'Service unavailable', data = null) {
        super(message, httpResponseServerErrorCode.SERVICE_UNVAILABLE, httpStatusText.ERROR, data);
    }
}

class GatewayTimeoutError extends AppError {
    constructor(message = 'Gateway timeout', data = null) {
        super(message, httpResponseServerErrorCode.GATEWAY_TIMEOUT, httpStatusText.ERROR, data);
    }
}

export {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    UnprocessableEntityError,
    BadGatewayError,
    InternalServerError,
    ServiceUnavailableError,
    GatewayTimeoutError
};

export default AppError;

