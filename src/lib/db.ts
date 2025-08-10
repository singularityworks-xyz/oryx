import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const cached = (global as Record<string, unknown>).mongoose as { 
  conn: mongoose.Connection | null; 
  promise: Promise<mongoose.Mongoose> | null;
  isConnecting: boolean;
} | undefined;

if (!cached) {
  (global as Record<string, unknown>).mongoose = { 
    conn: null, 
    promise: null, 
    isConnecting: false 
  };
}

async function dbConnect(): Promise<mongoose.Connection | null> {
  console.log('dbConnect: Starting connection process...');
  
  // If we already have a connection, return it
  if (cached?.conn) {
    console.log('dbConnect: Using existing connection');
    return cached.conn;
  }

  // If we're already trying to connect, wait for that promise
  if (cached?.promise && cached.isConnecting) {
    console.log('dbConnect: Waiting for existing connection attempt...');
    try {
      const mongoose = await cached.promise;
      cached.conn = mongoose.connection;
      cached.isConnecting = false;
      console.log('dbConnect: Connection established from existing promise');
      return cached.conn;
    } catch (e) {
      cached.promise = null;
      cached.isConnecting = false;
      console.error('dbConnect: Error from existing promise:', (e as Error).message);
      return null;
    }
  }

  // Create a new connection
  if (!cached?.promise) {
    console.log('dbConnect: Creating new connection...');
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000, // Added connect timeout
      retryWrites: true,
      retryReads: true,
    };

    if (cached) {
      cached.isConnecting = true;
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('dbConnect: New connection promise resolved');
        cached.isConnecting = false;
        return mongoose;
      });
    }
  }

  try {
    if (cached) {
      console.log('dbConnect: Waiting for connection promise...');
      const mongoose = await cached.promise;
      cached.conn = mongoose.connection;
      cached.isConnecting = false;
      
      console.log('dbConnect: Connection established successfully');
      
      // Add connection event listeners
      cached.conn.on('error', (err) => {
        console.error('dbConnect: MongoDB connection error:', err);
        cached.conn = null;
        cached.promise = null;
      });

      cached.conn.on('disconnected', () => {
        console.log('dbConnect: MongoDB disconnected');
        cached.conn = null;
        cached.promise = null;
      });

      return cached.conn;
    }
  } catch (e) {
    if (cached) {
      cached.promise = null;
      cached.isConnecting = false;
    }
    console.error('dbConnect: MongoDB connection error:', (e as Error).message);
    return null;
  }

  console.log('dbConnect: No connection available');
  return null;
}

export default dbConnect; 