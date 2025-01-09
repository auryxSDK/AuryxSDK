import { TradingPair, ValidationResult } from '../client/types';
import { handleValidationError } from '../utils/errors';
import { SUPPORTED_PAIRS, PROOF_CONSTANTS } from '../utils/constants';

export function validatePrice(price: number): void {
    const result = validatePriceData(price);
    if (!result.isValid) {
        throw handleValidationError(result.error || 'Invalid price data');
    }
}

export function validatePriceData(price: number): ValidationResult {
    if (typeof price !== 'number') {
        return {
            isValid: false,
            error: 'Price must be a number'
        };
    }

    if (isNaN(price)) {
        return {
            isValid: false,
            error: 'Price cannot be NaN'
        };
    }

    if (price < 0) {
        return {
            isValid: false,
            error: 'Price cannot be negative'
        };
    }

    if (!isFinite(price)) {
        return {
            isValid: false,
            error: 'Price must be finite'
        };
    }

    return { isValid: true };
}

export function validateTradingPair(pair: string): asserts pair is TradingPair {
    const isValid = SUPPORTED_PAIRS.includes(pair as TradingPair);
    
    if (!isValid) {
        throw handleValidationError(
            'Invalid trading pair',
            { supported: SUPPORTED_PAIRS }
        );
    }
}

export function validateConfidence(confidence: number): ValidationResult {
    if (typeof confidence !== 'number') {
        return {
            isValid: false,
            error: 'Confidence must be a number'
        };
    }

    if (confidence < 0 || confidence > 1) {
        return {
            isValid: false,
            error: 'Confidence must be between 0 and 1'
        };
    }

    if (confidence < PROOF_CONSTANTS.MIN_CONFIDENCE) {
        return {
            isValid: false,
            error: `Confidence below minimum threshold (${PROOF_CONSTANTS.MIN_CONFIDENCE})`
        };
    }

    return { isValid: true };
}

export function validateTimestamp(timestamp: number): ValidationResult {
    const now = Date.now();
    const maxAge = PROOF_CONSTANTS.STALENESS_THRESHOLD;

    if (timestamp > now) {
        return {
            isValid: false,
            error: 'Timestamp cannot be in the future'
        };
    }

    if (now - timestamp > maxAge) {
        return {
            isValid: false,
            error: 'Data is too old'
        };
    }

    return { isValid: true };
}