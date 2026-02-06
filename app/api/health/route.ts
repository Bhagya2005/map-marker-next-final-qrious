import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { withCORS, handleCORSPreflight } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return handleCORSPreflight();
}

export async function GET(req: NextRequest) {
  try {
    console.log('Health check endpoint called');
    await dbConnect();
    
    return withCORS(
      NextResponse.json({
        status: 'ok',
        message: 'Server and MongoDB are connected',
        timestamp: new Date().toISOString(),
        environment: {
          mongoUri: process.env.MONGO_URI ? ' Set' : 'Not set',
          jwtSecret: process.env.JWT_SECRET ? 'Set' : ' Not set',
        },
      }),
      req
    );
  } catch (error: any) {
    console.error('Health check error:', error);
    return withCORS(
      NextResponse.json({
        status: 'error',
        message: error.message || 'Database connection failed',
        timestamp: new Date().toISOString(),
      }, { status: 500 }),
      req
    );
  }
}
