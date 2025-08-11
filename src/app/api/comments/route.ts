import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/hooks/lib/auth';
import connect from '@/hooks/lib/database';
import Comment, { ICommentModel } from '@/models/Comment';
import Rating, { IRatingModel } from '@/models/Rating';
import Product from '@/models/Product';
import mongoose from 'mongoose';

// GET /api/comments - Get comments for a product
export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const result = await (Comment as ICommentModel).getProductComments(
      new mongoose.Types.ObjectId(productId), 
      page, 
      limit, 
      sortBy, 
      sortOrder
    );
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create a comment
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
    
    const { productId, content } = await request.json();
    
    if (!productId || !content) {
      return NextResponse.json(
        { error: 'Product ID and content are required' },
        { status: 400 }
      );
    }
    
    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      );
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if user has rated the product (required for commenting)
    const hasRated = await (Rating as IRatingModel).hasUserRated(
      new mongoose.Types.ObjectId(session.user.id), 
      new mongoose.Types.ObjectId(productId)
    );
    if (!hasRated) {
      return NextResponse.json(
        { error: 'You must rate the product before commenting' },
        { status: 403 }
      );
    }
    
    const comment = await Comment.create({
      user: new mongoose.Types.ObjectId(session.user.id),
      product: new mongoose.Types.ObjectId(productId),
      content: content.trim(),
    });
    
    // Populate user info for response
    await comment.populate('user', 'name image');
    
    return NextResponse.json({
      success: true,
      data: comment,
      message: 'Comment created successfully'
    });
    
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// PUT /api/comments - Update a comment
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 400 }
      );
    }
    
    await connect();
    
    const { commentId, content } = await request.json();
    
    if (!commentId || !content) {
      return NextResponse.json(
        { error: 'Comment ID and content are required' },
        { status: 400 }
      );
    }
    
    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      );
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the comment
    if (comment.user.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own comments' },
        { status: 403 }
      );
    }
    
    comment.content = content.trim();
    await comment.save();
    
    // Populate user info for response
    await comment.populate('user', 'name image');
    
    return NextResponse.json({
      success: true,
      data: comment,
      message: 'Comment updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments - Delete a comment
export async function DELETE(request: NextRequest) {
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
    const commentId = searchParams.get('commentId');
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the comment or is admin
    if (comment.user.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You can only delete your own comments' },
        { status: 400 }
      );
    }
    
    // Delete the comment
    await Comment.findByIdAndDelete(commentId);
    
    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
