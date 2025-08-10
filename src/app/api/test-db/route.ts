import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    console.log('Test DB API: Starting...');
    console.log('Test DB API: MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    const connection = await dbConnect();
    
    if (connection) {
      console.log('Test DB API: Connection successful');
      return NextResponse.json({ 
        status: 'success', 
        message: 'Database connection successful',
        connectionState: connection.readyState
      });
    } else {
      console.log('Test DB API: Connection failed');
      return NextResponse.json({ 
        status: 'error', 
        message: 'Database connection failed' 
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Test DB API: Error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Database connection error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
