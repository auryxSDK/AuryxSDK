export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: number;
    metadata?: Record<string, any>;
}

export class Logger {
    private level: LogLevel;
    private logEntries: LogEntry[];
    private maxEntries: number;

    private readonly LOG_LEVELS: Record<LogLevel, number> = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    };

    constructor(level: LogLevel = 'info', maxEntries: number = 1000) {
        this.level = level;
        this.logEntries = [];
        this.maxEntries = maxEntries;
    }

    debug(message: string, metadata?: Record<string, any>): void {
        this.log('debug', message, metadata);
    }

    info(message: string, metadata?: Record<string, any>): void {
        this.log('info', message, metadata);
    }

    warn(message: string, metadata?: Record<string, any>): void {
        this.log('warn', message, metadata);
    }

    error(message: string, metadata?: Record<string, any>): void {
        this.log('error', message, metadata);
    }

    private log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
        if (this.LOG_LEVELS[level] >= this.LOG_LEVELS[this.level]) {
            const entry: LogEntry = {
                level,
                message,
                timestamp: Date.now(),
                metadata
            };

            this.addEntry(entry);
            this.outputLog(entry);
        }
    }

    private addEntry(entry: LogEntry): void {
        this.logEntries.push(entry);
        if (this.logEntries.length > this.maxEntries) {
            this.logEntries.shift();
        }
    }

    private outputLog(entry: LogEntry): void {
        const timestamp = new Date(entry.timestamp).toISOString();
        const metadataStr = entry.metadata 
            ? ` ${JSON.stringify(entry.metadata)}`
            : '';
        const logMessage = `[${timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${metadataStr}`;

        switch (entry.level) {
            case 'debug':
                console.debug(logMessage);
                break;
            case 'info':
                console.info(logMessage);
                break;
            case 'warn':
                console.warn(logMessage);
                break;
            case 'error':
                console.error(logMessage);
                break;
        }
    }

    setLevel(level: LogLevel): void {
        this.level = level;
    }

    getLevel(): LogLevel {
        return this.level;
    }

    getLogs(): LogEntry[] {
        return [...this.logEntries];
    }

    clearLogs(): void {
        this.logEntries = [];
    }

    setMaxEntries(max: number): void {
        this.maxEntries = max;
        if (this.logEntries.length > max) {
            this.logEntries = this.logEntries.slice(-max);
        }
    }

    getStats(): Record<LogLevel, number> {
        return {
            debug: this.logEntries.filter(entry => entry.level === 'debug').length,
            info: this.logEntries.filter(entry => entry.level === 'info').length,
            warn: this.logEntries.filter(entry => entry.level === 'warn').length,
            error: this.logEntries.filter(entry => entry.level === 'error').length
        };
    }
}