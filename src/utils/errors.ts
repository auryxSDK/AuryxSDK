import { ERROR_CODES } from './constants';

type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export class AuryxError extends Error {
    code: ErrorCode;
    details?: any;

    constructor(code: ErrorCode, message: string, details?: any) {
        super(message);
        this.name = 'AuryxError';
        this.code = code;
        this.details = details;

        // Maintains proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuryxError);
        }
    }

    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            details: this.details,
            stack: this.stack
        };
    }
}

export function isAuryxError(error: any): error is AuryxError {
    return error instanceof AuryxError;
}

export function handleNetworkError(error: any): AuryxError {
    if (error.code === 'ECONNREFUSED') {
        return new AuryxError(
            ERROR_CODES.NETWORK,
            'Failed to connect to the server',
            error
        );
    }
    if (error.code === 'ETIMEDOUT') {
        return new AuryxError(
            ERROR_CODES.TIMEOUT,
            'Request timed out',
            error
        );
    }
    return new AuryxError(
        ERROR_CODES.NETWORK,
        'Network error occurred',
        error
    );
}

export function handleValidationError(message: string, details?: any): AuryxError {
    return new AuryxError(
        ERROR_CODES.VALIDATION,
        message,
        details
    );
}