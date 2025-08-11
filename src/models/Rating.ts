import mongoose, { Schema, Document } from 'mongoose';

export interface IRating extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define interface for Rating model with static methods
export interface IRatingModel extends mongoose.Model<IRating> {
  getAverageRating(productId: mongoose.Types.ObjectId): Promise<{
    averageRating: number;
    totalRatings: number;
  }>;
  
  getRatingDistribution(productId: mongoose.Types.ObjectId): Promise<Record<number, number>>;
  
  getUserRatings(
    userId: mongoose.Types.ObjectId,
    page: number,
    limit: number
  ): Promise<{
    ratings: IRating[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalRatings: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>;
  
  hasUserRated(
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ): Promise<number | null>;
  
  canUserComment(
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ): Promise<boolean>;
}

const RatingSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required'],
    index: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be a whole number',
    },
  },
}, {
  timestamps: true,
});

// Compound unique index to ensure one rating per user per product
RatingSchema.index({ user: 1, product: 1 }, { unique: true });

// Index for efficient queries
RatingSchema.index({ product: 1, rating: 1 });
RatingSchema.index({ user: 1, createdAt: -1 });

// Pre-save middleware to validate rating
RatingSchema.pre('save', function(this: IRating, next) {
  if (this.rating < 1 || this.rating > 5) {
    next(new Error('Rating must be between 1 and 5'));
  }
  next();
});

// Post-save middleware to update product's average rating
RatingSchema.post('save', async function(this: IRating) {
  try {
    const Product = mongoose.model('Product');
    const Rating = mongoose.model('Rating');
    const { averageRating, totalRatings } = await (Rating as IRatingModel).getAverageRating(this.product);
    
    await Product.findByIdAndUpdate(this.product, {
      averageRating,
      totalRatings
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
});

// Post-remove middleware to update product's average rating
RatingSchema.post('deleteOne', { document: true, query: false }, async function(this: IRating) {
  try {
    const Product = mongoose.model('Product');
    const Rating = mongoose.model('Rating');
    const { averageRating, totalRatings } = await (Rating as IRatingModel).getAverageRating(this.product);
    
    await Product.findByIdAndUpdate(this.product, {
      averageRating,
      totalRatings
    });
  } catch (error) {
    console.error('Error updating product rating after deletion:', error);
  }
});

// Post-save middleware to update user and product references
RatingSchema.post('save', async function(this: IRating) {
  try {
    const User = mongoose.model('User');
    const Product = mongoose.model('Product');
    
    // Add rating to user's ratings array if not already present
    await User.findByIdAndUpdate(this.user, {
      $addToSet: { ratings: this._id }
    });
    
    // Add rating to product's ratings array if not already present
    await Product.findByIdAndUpdate(this.product, {
      $addToSet: { ratings: this._id }
    });
  } catch (error) {
    console.error('Error updating user/product references:', error);
  }
});

// Post-remove middleware to update user and product references
RatingSchema.post('deleteOne', { document: true, query: false }, async function(this: IRating) {
  try {
    const User = mongoose.model('User');
    const Product = mongoose.model('Product');
    
    // Remove rating from user's ratings array
    await User.findByIdAndUpdate(this.user, {
      $pull: { ratings: this._id }
    });
    
    // Remove rating from product's ratings array
    await Product.findByIdAndUpdate(this.product, {
      $pull: { ratings: this._id }
    });
  } catch (error) {
    console.error('Error updating user/product references after deletion:', error);
  }
});

// Static method to get average rating for a product
RatingSchema.statics.getAverageRating = async function(productId: mongoose.Types.ObjectId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, totalRatings: { $sum: 1 } } }
  ]);
  
  return result.length > 0 ? {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalRatings: result[0].totalRatings
  } : { averageRating: 0, totalRatings: 0 };
};

// Static method to get rating distribution for a product
RatingSchema.statics.getRatingDistribution = async function(productId: mongoose.Types.ObjectId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);
  
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  result.forEach(item => {
    distribution[item._id as keyof typeof distribution] = item.count;
  });
  
  return distribution;
};

// Static method to get user's rating history
RatingSchema.statics.getUserRatings = async function(
  userId: mongoose.Types.ObjectId,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;
  
  const [ratings, total] = await Promise.all([
    this.find({ user: userId })
      .populate('product', 'name images productId averageRating')
      .populate('user', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments({ user: userId })
  ]);
  
  return {
    ratings,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRatings: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  };
};

// Static method to check if user has rated a product
RatingSchema.statics.hasUserRated = async function(
  userId: mongoose.Types.ObjectId,
  productId: mongoose.Types.ObjectId
) {
  const rating = await this.findOne({ user: userId, product: productId });
  return rating ? rating.rating : null;
};

// Static method to check if user can comment on a product
RatingSchema.statics.canUserComment = async function(
  userId: mongoose.Types.ObjectId,
  productId: mongoose.Types.ObjectId
) {
  const rating = await this.findOne({ user: userId, product: productId });
  return !!rating;
};

export default mongoose.models.Rating || mongoose.model<IRating, IRatingModel>('Rating', RatingSchema);
