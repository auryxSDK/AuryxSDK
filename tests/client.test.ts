import { Connection } from '@solana/web3.js';
import { AuryxClient } from '../src/client/AuryxClient';

describe('AuryxClient', () => {
  let client: AuryxClient;
  let connection: Connection;

  beforeEach(() => {
    connection = new Connection('http://localhost:8899');
    client = new AuryxClient(connection);
  });

  describe('getPrice', () => {
    it('should fetch price for valid trading pair', async () => {
      const price = await client.getPrice('SOL/USD');
      expect(price).toBeDefined();
      expect(price.price).toBeGreaterThan(0);
      expect(price.timestamp).toBeDefined();
    });

    it('should throw error for invalid trading pair', async () => {
      await expect(client.getPrice('INVALID/PAIR' as any)).rejects.toThrow();
    });
  });

  describe('subscribeToPriceUpdates', () => {
    it('should subscribe to price updates', (done) => {
      const callback = jest.fn();
      const unsubscribe = client.subscribeToPriceUpdates('SOL/USD', (update) => {
        callback(update);
        expect(update.pair).toBe('SOL/USD');
        expect(update.price).toBeDefined();
        expect(update.timestamp).toBeDefined();
        unsubscribe();
        done();
      });
    });
  });
});