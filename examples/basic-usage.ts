import { Connection } from '@solana/web3.js';
import { AuryxClient } from '../src';

async function main() {
  // Initialize connection to Solana devnet
  const connection = new Connection('https://api.devnet.solana.com');

  // Create Auryx client with custom configuration
  const client = new AuryxClient(connection, {
    logLevel: 'debug',
    cacheDuration: 5000, // 5 seconds
    maxRetries: 3
  });

  try {
    // Fetch current SOL/USD price
    console.log('Fetching SOL/USD price...');
    const solPrice = await client.getPrice('SOL/USD');
    console.log('SOL/USD:', solPrice);

    // Subscribe to price updates
    console.log('\nSubscribing to price updates...');
    const unsubscribe = client.subscribeToPriceUpdates('SOL/USD', (update) => {
      console.log('Price update received:', update);
    });

    // Keep the script running for 30 seconds
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Cleanup
    unsubscribe();
    console.log('\nUnsubscribed from price updates');

  } catch (error) {
    console.error('Error:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());