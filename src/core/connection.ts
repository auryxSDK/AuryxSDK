import { Connection } from '@solana/web3.js';
import { Logger } from '../utils/logger';
import { AuryxError } from '../utils/errors';
import { NETWORK_CONSTANTS } from '../utils/constants';

export class ConnectionManager {
    private connection: Connection;
    private logger: Logger;
    private reconnectAttempts: number = 0;
    private isConnected: boolean = false;
    private reconnectTimeout?: NodeJS.Timeout;

    constructor(connection: Connection, logger: Logger) {
        this.connection = connection;
        this.logger = logger;
        this.setupConnectionMonitoring();
    }

    private async setupConnectionMonitoring(): Promise<void> {
        try {
            await this.testConnection();
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.logger.info('Connection established successfully');
        } catch (error) {
            this.logger.error('Failed to establish connection:', { error });
            this.handleConnectionFailure();
        }
    }

    private async testConnection(): Promise<void> {
        try {
            await this.connection.getSlot();
        } catch (error) {
            throw new AuryxError(
                'NETWORK_ERROR',
                'Failed to test connection',
                error
            );
        }
    }

    private handleConnectionFailure(): void {
        this.isConnected = false;

        if (this.reconnectAttempts >= NETWORK_CONSTANTS.MAX_RECONNECT_ATTEMPTS) {
            this.logger.error('Max reconnection attempts reached');
            return;
        }

        const backoffTime = NETWORK_CONSTANTS.RECONNECT_INTERVAL * 
            Math.pow(2, this.reconnectAttempts);

        this.reconnectTimeout = setTimeout(async () => {
            this.reconnectAttempts++;
            this.logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${NETWORK_CONSTANTS.MAX_RECONNECT_ATTEMPTS})`);
            
            try {
                await this.setupConnectionMonitoring();
            } catch (error) {
                this.handleConnectionFailure();
            }
        }, backoffTime);
    }

    public getConnectionStatus(): boolean {
        return this.isConnected;
    }

    public getConnection(): Connection {
        return this.connection;
    }

    public async updateConnection(newConnection: Connection): Promise<void> {
        this.cleanup();
        this.connection = newConnection;
        await this.setupConnectionMonitoring();
    }

    public cleanup(): void {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        this.isConnected = false;
        this.reconnectAttempts = 0;
    }
}