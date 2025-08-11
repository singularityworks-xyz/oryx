import { NextResponse } from 'next/server';
import { connect, getStatus } from '@/hooks/lib/database';

export async function GET() {
  try {
    console.log('Test DB API: Starting connection test...');
    console.log('Test DB API: MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('Test DB API: NODE_ENV:', process.env.NODE_ENV);
    
    const startTime = Date.now();
    const connection = await connect();
    const connectionTime = Date.now() - startTime;
    
    if (connection) {
      console.log('Test DB API: Connection successful in', connectionTime, 'ms');
      console.log('Test DB API: Connection state:', connection.readyState);
      
      const status = getStatus();
      
      return NextResponse.json({
        success: true,
        connectionTime: `${connectionTime}ms`,
        connectionState: connection.readyState,
        status,
        message: 'Database connection successful'
      });
    } else {
      console.log('Test DB API: Connection failed');
      return NextResponse.json({
        success: false,
        message: 'Failed to establish database connection'
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Test DB API: Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database connection test failed'
    }, { status: 500 });
  }
}
