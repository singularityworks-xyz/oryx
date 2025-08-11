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
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const canComment = await (Rating as IRatingModel).canUserComment(
      new mongoose.Types.ObjectId(session.user.id), 
      new mongoose.Types.ObjectId(productId)
    );
    const userRating = await (Rating as IRatingModel).hasUserRated(
      new mongoose.Types.ObjectId(session.user.id), 
      new mongoose.Types.ObjectId(productId)
    );
    
    return NextResponse.json({
      success: true,
      data: {
        canComment,
        userRating
      }
    });
    
  } catch (error) {
    console.error('Error checking comment permission:', error);
    return NextResponse.json(
      { error: 'Failed to check comment permission' },
      { status: 500 }
    );
  }
}
