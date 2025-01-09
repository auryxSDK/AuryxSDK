export const DEFAULT_CONFIG = {
    RPC_ENDPOINT: 'https://api.mainnet-beta.solana.com',
    COMMITMENT: 'confirmed',
    CACHE_DURATION: 30000, // 30 seconds
    MAX_RETRIES: 3,
    TIMEOUT: 5000,
    VALIDATE_PROOFS: true,
    LOG_LEVEL: 'warn',
    UPDATE_INTERVAL: 5000 // 5 seconds
} as const;

export const NETWORK_CONSTANTS = {
    MAX_BATCH_SIZE: 100,
    RATE_LIMIT: 100, // requests per minute
    WEBSOCKET_TIMEOUT: 30000,
    RECONNECT_INTERVAL: 1000,
    MAX_RECONNECT_ATTEMPTS: 5
} as const;

export const PROOF_CONSTANTS = {
    SIGNATURE_LENGTH: 64,
    PUBLIC_KEY_LENGTH: 32,
    MIN_CONFIDENCE: 0.5,
    STALENESS_THRESHOLD: 60000 // 1 minute
} as const;

export const SUPPORTED_PAIRS = [
    'SOL/USD',
    'BTC/USD',
    'ETH/USD'
] as const;

export const ERROR_CODES = {
    NETWORK: 'NETWORK_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    TIMEOUT: 'TIMEOUT_ERROR',
    PROOF: 'PROOF_ERROR',
    PRICE: 'PRICE_ERROR'
} as const;