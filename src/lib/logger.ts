/** biome-ignore-all lint/suspicious/noConsole: logger */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

export type LogEntry = {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  metadata?: Record<string, unknown>;
  error?: Error;
  userId?: string;
  requestId?: string;
  sessionId?: string;
};

export type LogTransport = {
  log(entry: LogEntry): void;
};

class ConsoleTransport implements LogTransport {
  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const level = entry.level.toUpperCase();
    const context = entry.context ? `[${entry.context}]` : '';
    const requestId = entry.requestId ? `[${entry.requestId}]` : '';
    const userId = entry.userId ? `[User:${entry.userId}]` : '';

    return `${timestamp} ${level} ${context}${requestId}${userId} ${entry.message}`;
  }

  log(entry: LogEntry): void {
    const message = this.formatMessage(entry);
    const metadata = entry.metadata
      ? JSON.stringify(entry.metadata, null, 2)
      : '';

    switch (entry.level) {
      case 'debug':
        console.debug(message, metadata);
        break;
      case 'info':
        console.info(message, metadata);
        break;
      case 'warn':
        console.warn(message, metadata);
        if (entry.error) {
          console.warn(entry.error);
        }
        break;
      case 'error':
        console.error(message, metadata);
        if (entry.error) {
          console.error(entry.error);
        }
        break;
      case 'none':
        // No logging
        break;
      default:
        console.log(message, metadata);
    }
  }
}

class ProductionTransport implements LogTransport {
  private formatJSON(entry: LogEntry): string {
    const logObject = {
      timestamp: entry.timestamp,
      level: entry.level,
      message: entry.message,
      ...(entry.context && { context: entry.context }),
      ...(entry.requestId && { requestId: entry.requestId }),
      ...(entry.userId && { userId: entry.userId }),
      ...(entry.sessionId && { sessionId: entry.sessionId }),
      ...(entry.metadata && { metadata: entry.metadata }),
      ...(entry.error && {
        error: {
          message: entry.error.message,
          stack: entry.error.stack,
          name: entry.error.name,
        },
      }),
    };

    return JSON.stringify(logObject);
  }

  log(entry: LogEntry): void {
    const jsonLog = this.formatJSON(entry);

    // In production, you might want to send to external services
    // For now, we'll use console with structured format
    console.log(jsonLog);

    // Example: Send to external logging service
    // this.sendToService(entry);
  }
}

class Logger {
  private currentLevel: LogLevel;
  private readonly transports: LogTransport[] = [];
  private readonly context?: string;
  private readonly requestId?: string;
  private readonly userId?: string;
  private readonly sessionId?: string;

  constructor(
    level: LogLevel = 'info',
    options: {
      context?: string;
      requestId?: string;
      userId?: string;
      sessionId?: string;
    } = {}
  ) {
    this.currentLevel = level;
    this.context = options.context;
    this.requestId = options.requestId;
    this.userId = options.userId;
    this.sessionId = options.sessionId;
    this.setupTransports();
  }

  private setupTransports(): void {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      this.transports.push(new ProductionTransport());
    } else {
      this.transports.push(new ConsoleTransport());
    }
  }

  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  setContext(context: string): Logger {
    return new Logger(this.currentLevel, {
      context,
      requestId: this.requestId,
      userId: this.userId,
      sessionId: this.sessionId,
    });
  }

  setRequestId(requestId: string): Logger {
    return new Logger(this.currentLevel, {
      context: this.context,
      requestId,
      userId: this.userId,
      sessionId: this.sessionId,
    });
  }

  setUserId(userId: string): Logger {
    return new Logger(this.currentLevel, {
      context: this.context,
      requestId: this.requestId,
      userId,
      sessionId: this.sessionId,
    });
  }

  setSessionId(sessionId: string): Logger {
    return new Logger(this.currentLevel, {
      context: this.context,
      requestId: this.requestId,
      userId: this.userId,
      sessionId,
    });
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = { debug: 0, info: 1, warn: 2, error: 3, none: 4 };
    return levels[level] >= levels[this.currentLevel];
  }

  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.context,
      requestId: this.requestId,
      userId: this.userId,
      sessionId: this.sessionId,
      metadata,
      error,
    };

    for (const transport of this.transports) {
      try {
        transport.log(entry);
      } catch (transportError) {
        // If logging fails, fallback to console
        console.error('Logger transport failed:', transportError);
        console.log(JSON.stringify(entry));
      }
    }
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, metadata);
  }

  warn(
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): void {
    this.log('warn', message, metadata, error);
  }

  error(
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): void {
    this.log('error', message, metadata, error);
  }

  // Utility method for timing operations
  time(label: string): () => void {
    const start = Date.now();
    this.debug(`Started: ${label}`, { label });

    return () => {
      const duration = Date.now() - start;
      this.debug(`Completed: ${label}`, { label, duration });
    };
  }

  // Utility method for logging with performance timing
  async withTiming<T>(
    label: string,
    operation: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    const endTiming = this.time(label);
    try {
      const result = await operation();
      endTiming();
      return result;
    } catch (error) {
      endTiming();
      this.error(
        `Failed: ${label}`,
        { ...metadata, error: error instanceof Error ? error.message : error },
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  }
}

const getDefaultLogLevel = (): LogLevel => {
  const env = process.env.LOG_LEVEL || process.env.NODE_ENV;

  switch (env) {
    case 'development':
      return 'debug';
    case 'test':
      return 'error';
    case 'production':
      return 'info';
    default:
      return 'info';
  }
};

export const logger = new Logger(getDefaultLogLevel());
export { Logger };
