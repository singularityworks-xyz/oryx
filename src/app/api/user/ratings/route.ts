import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/hooks/lib/auth';
import connect from '@/hooks/lib/database';
import Rating, { IRatingModel } from '@/models/Rating';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await connect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const result = await (Rating as IRatingModel).getUserRatings(
      new mongoose.Types.ObjectId(session.user.id), 
      page, 
      limit
    );
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user ratings' },
      { status: 500 }
    );
  }
}
