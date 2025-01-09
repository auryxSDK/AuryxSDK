import { Oracle } from '../src/core/oracle';
import { ConnectionManager } from '../src/core/connection';
import { Logger } from '../src/utils/logger';
import { Connection } from '@solana/web3.js';

describe('Oracle', () => {
  let oracle: Oracle;
  let connectionManager: ConnectionManager;
  let logger: Logger;

  beforeEach(() => {
    const connection = new Connection('http://localhost:8899');
    logger = new Logger('debug');
    connectionManager = new ConnectionManager(connection, logger);
    oracle = new Oracle(connectionManager, logger);
  });

  describe('fetchPrice', () => {
    it('should fetch and validate price data', async () => {
      const priceData = await oracle.fetchPrice('SOL/USD');
      expect(priceData).toBeDefined();
      expect(priceData.price).toBeGreaterThan(0);
      expect(priceData.timestamp).toBeDefined();
      expect(priceData.confidence).toBeGreaterThan(0);
      expect(priceData.confidence).toBeLessThanOrEqual(1);
    });

    it('should use cache for subsequent requests', async () => {
      const firstPrice = await oracle.fetchPrice('SOL/USD');
      const secondPrice = await oracle.fetchPrice('SOL/USD');
      expect(secondPrice.timestamp).toBe(firstPrice.timestamp);
    });
  });

  afterEach(() => {
    oracle.cleanup();
  });
});