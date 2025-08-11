import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/hooks/lib/auth';
import connect from '@/hooks/lib/database';
import Comment, { ICommentModel } from '@/models/Comment';
import mongoose from 'mongoose';

// POST /api/comments/dislike - Toggle dislike on a comment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await connect();
    
    const { commentId } = await request.json();
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }
    
    const comment = await (Comment as ICommentModel).findById(commentId);
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Toggle dislike
    await comment.toggleDislike(new mongoose.Types.ObjectId(session.user.id));
    
    // Get updated comment with populated user info
    await comment.populate('user', 'name image');
    
    return NextResponse.json({
      success: true,
      data: comment,
      message: 'Dislike toggled successfully'
    });
    
  } catch (error) {
    console.error('Error toggling dislike:', error);
    return NextResponse.json(
      { error: 'Failed to toggle dislike' },
      { status: 500 }
    );
  }
}
