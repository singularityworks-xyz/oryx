import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/hooks/lib/auth';
import connect from '@/hooks/lib/database';
import Comment, { ICommentModel } from '@/models/Comment';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 400 }
      );
    }
    
    await connect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const result = await (Comment as ICommentModel).getUserComments(
      new mongoose.Types.ObjectId(session.user.id), 
      page, 
      limit
    );
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user comments' },
      { status: 500 }
    );
  }
}
