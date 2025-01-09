# AuryxSDK

<div align="center">
    <img src=".github/assets/logo.png" alt="" width="200"/>
    <h1>Auryx Oracle SDK</h1>
    <p>High-Performance Decentralized Oracle SDK for Solana</p>
   
</div>

## Features

- ⚡️ Sub-second latency price feeds
- 🔐 Decentralized validation
- 📊 Real-time market data
- 🛡️ Cryptographic proofs
- 🔄 High availability system
- 🎯 Solana-native implementation

## Installation

```bash
npm install @auryx/sdk
```

## Quick Start

```typescript
import { Connection } from '@solana/web3.js';
import { AuryxClient } from '@auryx/sdk';

// Initialize connection
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Create Auryx client
const client = new AuryxClient(connection);

// Get SOL/USD price
const price = await client.getPrice('SOL/USD');
console.log('Current SOL price:', price);

// Subscribe to price updates
const unsubscribe = client.subscribeToPriceUpdates('SOL/USD', (update) => {
    console.log('New price update:', update);
});

// Later: cleanup subscription
unsubscribe();
```

## Documentation

Visit our [documentation](https://auryx.dev) for:
- API Reference
- Integration Guide
- Examples
- Contributing Guidelines

## Use Cases

- **DeFi Applications**: Real-time price feeds for lending, trading, and synthetic assets
- **Trading Systems**: Automated trading strategies and risk management
- **Settlement Systems**: Accurate price data for settlement and liquidation
- **Cross-chain Applications**: Price feeds for cross-chain bridges and applications

## Advanced Configuration

```typescript
const client = new AuryxClient(connection, {
    rpcEndpoint: 'https://your-rpc-endpoint.com',
    commitment: 'confirmed',
    cacheDuration: 1000,
    maxRetries: 3,
    timeout: 5000,
    validateProofs: true,
    logLevel: 'debug'
});
```

## Development

```bash
# Clone the repository
git clone https://github.com/AuryxSDK/AuryxSDK.git
cd AuryxSDK

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

## Support

- [Documentation](https://auryx.dev)
- [Twitter](https://x.com/AuryxSDK)
- [GitHub Issues](https://github.com/AuryxSDK/AuryxSDK/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

Found a security issue? Please visit [https://auryx.dev/](https://auryx.dev/) for our security policy and reporting process.

---

<div align="center">
    Built with ❤️ by <a href="https://auryx.dev">Auryx Labs</a>
</div>
