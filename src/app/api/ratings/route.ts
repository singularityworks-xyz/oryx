import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/hooks/lib/auth';
import connect from '@/hooks/lib/database';
import Rating, { IRatingModel } from '@/models/Rating';
import Product from '@/models/Product';
import mongoose from 'mongoose';

// GET /api/ratings - Get ratings for a product
export async function GET(request: NextRequest) {
  try {
    await connect();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const [averageRating, ratingDistribution] = await Promise.all([
      (Rating as IRatingModel).getAverageRating(new mongoose.Types.ObjectId(productId)),
      (Rating as IRatingModel).getRatingDistribution(new mongoose.Types.ObjectId(productId))
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        averageRating: averageRating.averageRating,
        totalRatings: averageRating.totalRatings,
        ratingDistribution
      }
    });
    
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

// POST /api/ratings - Create or update a rating
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
    
    const { productId, rating } = await request.json();
    
    if (!productId || !rating) {
      return NextResponse.json(
        { error: 'Product ID and rating are required' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: 'Rating must be a whole number between 1 and 5' },
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
    
    // Find existing rating or create new one
    const existingRating = await (Rating as IRatingModel).findOne({
      user: new mongoose.Types.ObjectId(session.user.id),
      product: new mongoose.Types.ObjectId(productId)
    });
    
    let result;
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      result = await existingRating.save();
    } else {
      // Create new rating
      result = await (Rating as IRatingModel).create({
        user: new mongoose.Types.ObjectId(session.user.id),
        product: new mongoose.Types.ObjectId(productId),
        rating
      });
    }
    
    return NextResponse.json({
      success: true,
      data: result,
      message: existingRating ? 'Rating updated successfully' : 'Rating created successfully'
    });
    
  } catch (error) {
    console.error('Error creating/updating rating:', error);
    return NextResponse.json(
      { error: 'Failed to create/update rating' },
      { status: 500 }
    );
  }
}

// DELETE /api/ratings - Delete a rating
export async function DELETE(request: NextRequest) {
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
    
    const rating = await (Rating as IRatingModel).findOneAndDelete({
      user: new mongoose.Types.ObjectId(session.user.id),
      product: new mongoose.Types.ObjectId(productId)
    });
    
    if (!rating) {
      return NextResponse.json(
        { error: 'Rating not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Rating deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting rating:', error);
    return NextResponse.json(
      { error: 'Failed to delete rating' },
      { status: 500 }
    );
  }
}
