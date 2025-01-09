import { Connection } from '@solana/web3.js';
import { Oracle } from '../core/oracle';
import { ConnectionManager } from '../core/connection';
import { PriceData, OracleConfig, PriceUpdate, TradingPair } from './types';
import { Logger } from '../utils/logger';
import { AuryxError } from '../utils/errors';
import { DEFAULT_CONFIG } from '../utils/constants';

export class AuryxClient {
    private connection: Connection;
    private oracle: Oracle;
    private connectionManager: ConnectionManager;
    private logger: Logger;
    private subscriptions: Map<string, Set<(update: PriceUpdate) => void>>;

    constructor(connection: Connection, config: Partial<OracleConfig> = {}) {
        this.connection = connection;
        this.logger = new Logger(config.logLevel || DEFAULT_CONFIG.LOG_LEVEL);
        this.connectionManager = new ConnectionManager(connection, this.logger);
        this.oracle = new Oracle(this.connectionManager, this.logger);
        this.subscriptions = new Map();

        // Initialize with merged config
        this.initialize({
            ...DEFAULT_CONFIG,
            ...config
        });
    }

    private initialize(config: OracleConfig): void {
        this.logger.info('Initializing Auryx client...');
        this.setupErrorHandling();
    }

    private setupErrorHandling(): void {
        process.on('unhandledRejection', (error) => {
            this.logger.error('Unhandled promise rejection:', error);
        });
    }

    /**
     * Get current price for a trading pair
     */
    async getPrice(pair: TradingPair): Promise<PriceData> {
        try {
            this.logger.debug(`Fetching price for ${pair}`);
            return await this.oracle.fetchPrice(pair);
        } catch (error) {
            this.logger.error(`Failed to fetch price for ${pair}:`, error);
            throw new AuryxError('PRICE_FETCH_ERROR', `Failed to fetch price for ${pair}`, error);
        }
    }

    /**
     * Subscribe to price updates for a trading pair
     */
    subscribe(
        pair: TradingPair,
        callback: (update: PriceUpdate) => void
    ): () => void {
        if (!this.subscriptions.has(pair)) {
            this.subscriptions.set(pair, new Set());
        }

        const callbacks = this.subscriptions.get(pair)!;
        callbacks.add(callback);

        this.logger.debug(`New subscription added for ${pair}`);

        // Start price updates if this is the first subscriber
        if (callbacks.size === 1) {
            this.startPriceUpdates(pair);
        }

        // Return unsubscribe function
        return () => {
            this.logger.debug(`Unsubscribing from ${pair}`);
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.stopPriceUpdates(pair);
            }
        };
    }

    /**
     * Start receiving price updates for a pair
     */
    private startPriceUpdates(pair: TradingPair): void {
        const interval = setInterval(async () => {
            try {
                const price = await this.getPrice(pair);
                const callbacks = this.subscriptions.get(pair);
                
                if (callbacks) {
                    const update: PriceUpdate = {
                        pair,
                        price: price.price,
                        timestamp: Date.now()
                    };

                    callbacks.forEach(callback => callback(update));
                }
            } catch (error) {
                this.logger.error(`Error updating price for ${pair}:`, error);
            }
        }, DEFAULT_CONFIG.UPDATE_INTERVAL);

        // Store interval for cleanup
        this.oracle.setUpdateInterval(pair, interval);
    }

    /**
     * Stop price updates for a pair
     */
    private stopPriceUpdates(pair: TradingPair): void {
        const interval = this.oracle.getUpdateInterval(pair);
        if (interval) {
            clearInterval(interval);
            this.oracle.clearUpdateInterval(pair);
        }
    }

    /**
     * Get connection status
     */
    isConnected(): boolean {
        return this.connectionManager.getConnectionStatus();
    }

    /**
     * Clean up resources
     */
    cleanup(): void {
        this.logger.info('Cleaning up Auryx client...');
        this.subscriptions.forEach((_, pair) => {
            this.stopPriceUpdates(pair);
        });
        this.connectionManager.cleanup();
    }
}