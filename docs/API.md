# AuryxSDK API Reference

## Installation

```bash
npm install @auryx/sdk
```

## Core Classes

### AuryxClient

The main class for interacting with the Auryx Oracle.

```typescript
import { Connection } from '@solana/web3.js';
import { AuryxClient } from '@auryx/sdk';

const client = new AuryxClient(connection, config);
```

#### Configuration Options

```typescript
interface OracleConfig {
    rpcEndpoint: string;    // Solana RPC endpoint
    commitment: string;     // Transaction commitment level
    cacheDuration: number;  // Cache duration in milliseconds
    maxRetries: number;     // Maximum retry attempts
    timeout: number;        // Request timeout
    validateProofs: boolean;// Enable proof validation
    logLevel: LogLevel;    // Logging verbosity
}
```

#### Methods

##### getPrice(pair: TradingPair): Promise<PriceData>
Fetches the current price for a trading pair.

```typescript
const price = await client.getPrice('SOL/USD');
```

##### subscribeToPriceUpdates(pair: TradingPair, callback: (update: PriceUpdate) => void): () => void
Subscribes to real-time price updates.

```typescript
const unsubscribe = client.subscribeToPriceUpdates('SOL/USD', (update) => {
    console.log('New price:', update);
});

// Later: cleanup subscription
unsubscribe();
```

## Types

### PriceData
```typescript
interface PriceData {
    price: number;      // Current price
    timestamp: number;  // Unix timestamp
    confidence: number; // Confidence score (0-1)
    proof: Buffer | null; // Cryptographic proof
}
```

### PriceUpdate
```typescript
interface PriceUpdate {
    pair: TradingPair;  // Trading pair
    price: number;      // Updated price
    timestamp: number;  // Update time
}
```

### TradingPair
```typescript
type TradingPair = 'SOL/USD' | 'BTC/USD' | 'ETH/USD';
```

## Error Handling

The SDK uses custom error types for better error handling:

```typescript
try {
    const price = await client.getPrice('SOL/USD');
} catch (error) {
    if (error instanceof AuryxError) {
        console.error('Oracle error:', error.code, error.message);
    }
}
```

For more detailed documentation and examples, visit [https://auryx.dev](https://auryx.dev).