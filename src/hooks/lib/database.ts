import mongoose from 'mongoose';

// Database configuration
const DB_CONFIG = {
  // Connection pool settings
  maxPoolSize: 10,
  minPoolSize: 2,
  maxConnecting: 5,
  
  // Timeout settings
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxIdleTimeMS: 30000,
  
  // Retry settings
  retryWrites: true,
  retryReads: true,
  
  // Performance settings
  bufferCommands: false,
  autoIndex: (process.env.NODE_ENV || 'development') === 'development',
  
  // Heartbeat settings
  heartbeatFrequencyMS: 10000,
};

// Connection state management
interface ConnectionState {
  connection: mongoose.Connection | null;
  isConnecting: boolean;
  lastConnectionAttempt: number;
}

let connectionState: ConnectionState = {
  connection: null,
  isConnecting: false,
  lastConnectionAttempt: 0,
};

/**
 * Main database connection function
 * Handles connection pooling, retries, and state management
 */
export async function connect(): Promise<mongoose.Connection | null> {
  try {
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    const uri = process.env.MONGODB_URI;
    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MONGODB_URI format. Must start with mongodb:// or mongodb+srv://');
    }

    // Check if we already have a valid connection
    if (connectionState.connection && connectionState.connection.readyState === 1) {
      return connectionState.connection;
    }

    // Check if we're already trying to connect
    if (connectionState.isConnecting) {
      console.log('Database: Already connecting, waiting...');
      // Wait for the connection to complete
      while (connectionState.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return connectionState.connection;
    }

    // Create new connection
    console.log('Database: Creating new connection...');
    connectionState.isConnecting = true;
    connectionState.lastConnectionAttempt = Date.now();

    const mongooseInstance = await mongoose.connect(uri, DB_CONFIG);
    connectionState.connection = mongooseInstance.connection;
    connectionState.isConnecting = false;

    // Set up connection event listeners
    connectionState.connection.on('error', (err) => {
      console.error('Database: Connection error:', err);
      connectionState.connection = null;
    });

    connectionState.connection.on('disconnected', () => {
      console.log('Database: Connection disconnected');
      connectionState.connection = null;
    });

    connectionState.connection.on('connected', () => {
      console.log('Database: Connection established');
    });

    connectionState.connection.on('reconnected', () => {
      console.log('Database: Connection reconnected');
    });

    console.log('Database: Connection successful');
    return connectionState.connection;

  } catch (error) {
    connectionState.isConnecting = false;
    console.error('Database: Connection failed:', (error as Error).message);
    return null;
  }
}

/**
 * Check if database connection is healthy
 */
export async function isHealthy(): Promise<boolean> {
  try {
    const connection = await connect();
    return !!(connection && connection.readyState === 1);
  } catch (error) {
    console.error('Database: Health check failed:', error);
    return false;
  }
}

/**
 * Gracefully close database connection
 */
export async function disconnect(): Promise<void> {
  if (connectionState.connection) {
    try {
      await connectionState.connection.close();
      console.log('Database: Connection closed successfully');
    } catch (error) {
      console.error('Database: Error closing connection:', (error as Error).message);
    } finally {
      connectionState.connection = null;
    }
  }
}

/**
 * Get current connection status
 */
export function getStatus(): {
  isConnected: boolean;
  isConnecting: boolean;
  readyState: number | null;
} {
  return {
    isConnected: !!(connectionState.connection && connectionState.connection.readyState === 1),
    isConnecting: connectionState.isConnecting,
    readyState: connectionState.connection?.readyState || null,
  };
}

// Export the main connect function as default
export default connect;
