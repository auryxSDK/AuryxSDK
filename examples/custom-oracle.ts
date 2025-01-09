import { Connection } from '@solana/web3.js';
import { AuryxClient } from '../src';
import { PriceData, TradingPair } from '../src/client/types';

class CustomPriceOracle extends AuryxClient {
  private customPrices: Map<string, number>;

  constructor(connection: Connection) {
    super(connection);
    this.customPrices = new Map();
    this.initializeCustomPrices();
  }

  private initializeCustomPrices() {
    // Add custom price adjustments
    this.customPrices.set('SOL/USD', 1.05); // 5% premium
    this.customPrices.set('BTC/USD', 1.02); // 2% premium
  }

  async getPrice(pair: TradingPair): Promise<PriceData> {
    // Get base price from parent implementation
    const basePrice = await super.getPrice(pair);
    
    // Apply custom adjustment if exists
    const adjustment = this.customPrices.get(pair) || 1;
    
    return {
      ...basePrice,
      price: basePrice.price * adjustment
    };
  }

  // Add custom method for price adjustment
  setCustomAdjustment(pair: TradingPair, adjustment: number) {
    this.customPrices.set(pair, adjustment);
  }
}

async function main() {
  const connection = new Connection('https://api.devnet.solana.com');
  const oracle = new CustomPriceOracle(connection);

  try {
    // Get base price
    console.log('Fetching base SOL/USD price...');
    const basePrice = await oracle.getPrice('SOL/USD');
    console.log('Base SOL/USD:', basePrice);

    // Modify adjustment
    oracle.setCustomAdjustment('SOL/USD', 1.10); // 10% premium
    
    // Get adjusted price
    console.log('\nFetching adjusted SOL/USD price...');
    const adjustedPrice = await oracle.getPrice('SOL/USD');
    console.log('Adjusted SOL/USD:', adjustedPrice);

  } catch (error) {
    console.error('Error:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());