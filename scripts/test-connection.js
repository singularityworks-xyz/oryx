const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  console.log('URI starts with:', uri.substring(0, 20) + '...');

  const options = {
    bufferCommands: false,
    maxPoolSize: 10,
    minPoolSize: 2,
    maxConnecting: 5,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxIdleTimeMS: 30000,
    retryWrites: true,
    retryReads: true,
    autoIndex: (process.env.NODE_ENV || 'development') === 'development',
    heartbeatFrequencyMS: 10000,
  };

  try {
    console.log('Attempting connection...');
    const startTime = Date.now();
    
    const mongooseInstance = await mongoose.connect(uri, options);
    const connectionTime = Date.now() - startTime;
    
    console.log(`✅ Connection successful in ${connectionTime}ms`);
    console.log('Connection state:', mongooseInstance.connection.readyState);
    console.log('Database name:', mongooseInstance.connection.name);
    console.log('Host:', mongooseInstance.connection.host);
    console.log('Port:', mongooseInstance.connection.port);
    
    // Test a simple operation
    const collections = await mongooseInstance.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await mongooseInstance.disconnect();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();
