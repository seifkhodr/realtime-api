import httpSatusCode from './enums/httpResponseStatusCode.js';
import httpStatusText from './enums/httpResponseStatusText.js';

class AppError extends Error {
    constructor(message, statusCode,statusText,data) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.data = data;
        this.isOperational = true;
        this.statusText = statusText;

        Error.captureStackTrace(this, this.constructor);
    }
}

class UnprocessableEntityError extends AppError {
    constructor(message = 'Request cannot be processed ' , data = null) {
        super(
            message,
            httpSatusCode.httpResponseClientErrorCode.UNPROCESSIBLE_CONTENT ,
            httpStatusText.FAIL,
            data
        );
    }
}

// same for others

