import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    mongodbUri: process.env.MONGODB_URI ? 'exists' : 'missing',
    nodeEnv: process.env.NODE_ENV || 'undefined',
    allEnvVars: Object.keys(process.env).filter(key => key.includes('MONGODB') || key.includes('NODE')),
    timestamp: new Date().toISOString()
  });
}
