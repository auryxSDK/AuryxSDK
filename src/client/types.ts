import { LogLevel } from '../utils/logger';

export type TradingPair = 'SOL/USD' | 'BTC/USD' | 'ETH/USD';

export interface PriceData {
    price: number;      // Current price
    timestamp: number;  // Unix timestamp
    confidence: number; // Confidence score (0-1)
    proof: Buffer | null; // Cryptographic proof
}

export interface PriceUpdate {
    pair: TradingPair;  // Trading pair
    price: number;      // Updated price
    timestamp: number;  // Update time
}

export interface OracleConfig {
    rpcEndpoint: string;    // Solana RPC endpoint
    commitment: string;     // Transaction commitment level
    cacheDuration: number;  // Cache duration in milliseconds
    maxRetries: number;     // Maximum retry attempts
    timeout: number;        // Request timeout
    validateProofs: boolean;// Enable proof validation
    logLevel: LogLevel;    // Logging verbosity
    updateInterval: number; // Price update interval
}

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export interface PriceSource {
    name: string;
    weight: number;
    getPrice(pair: TradingPair): Promise<number>;
}