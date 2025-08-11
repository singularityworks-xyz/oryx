import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  content: string;
  isEdited: boolean;
  editedAt?: Date;
  likes: mongoose.Types.ObjectId[];
  dislikes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  toggleLike(userId: mongoose.Types.ObjectId): Promise<IComment>;
  toggleDislike(userId: mongoose.Types.ObjectId): Promise<IComment>;
  getUserReaction(userId: mongoose.Types.ObjectId): 'like' | 'dislike' | null;
}

// Define interface for Comment model with static methods
export interface ICommentModel extends mongoose.Model<IComment> {
  getProductComments(
    productId: mongoose.Types.ObjectId,
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<{
    comments: IComment[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalComments: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>;
  
  getUserComments(
    userId: mongoose.Types.ObjectId,
    page: number,
    limit: number
  ): Promise<{
    comments: IComment[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalComments: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>;
  
  canUserComment(
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId
  ): Promise<boolean>;
}

const CommentSchema: Schema = new Schema({
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
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    minlength: [1, 'Comment cannot be empty'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
    default: undefined,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  }],
}, {
  timestamps: true,
});

// Indexes for efficient queries
CommentSchema.index({ product: 1, createdAt: -1 });
CommentSchema.index({ user: 1, createdAt: -1 });
CommentSchema.index({ 'likes': 1 });
CommentSchema.index({ 'dislikes': 1 });

// Virtual for comment counts
CommentSchema.virtual('likesCount').get(function(this: IComment) {
  return this.likes.length;
});

CommentSchema.virtual('dislikesCount').get(function(this: IComment) {
  return this.dislikes.length;
});

// Pre-save middleware to handle edit tracking and rating requirement
CommentSchema.pre('save', async function(this: IComment, next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  
  // Check if user has rated the product before allowing comment
  if (this.isNew) {
    const Rating = mongoose.model('Rating');
    const existingRating = await Rating.findOne({
      user: this.user,
      product: this.product
    });
    
    if (!existingRating) {
      return next(new Error('You must rate the product before commenting'));
    }
  }
  
  next();
});

// Post-save middleware to update user and product references
CommentSchema.post('save', async function(this: IComment) {
  try {
    const User = mongoose.model('User');
    const Product = mongoose.model('Product');
    
    // Add comment to user's comments array if not already present
    await User.findByIdAndUpdate(this.user, {
      $addToSet: { comments: this._id }
    });
    
    // Add comment to product's comments array if not already present
    await Product.findByIdAndUpdate(this.product, {
      $addToSet: { comments: this._id }
    });
  } catch (error) {
    console.error('Error updating user/product references:', error);
  }
});

// Post-remove middleware to update user and product references
CommentSchema.post('deleteOne', { document: true, query: false }, async function(this: IComment) {
  try {
    const User = mongoose.model('User');
    const Product = mongoose.model('Product');
    
    // Remove comment from user's comments array
    await User.findByIdAndUpdate(this.user, {
      $pull: { comments: this._id }
    });
    
    // Remove comment from product's comments array
    await Product.findByIdAndUpdate(this.product, {
      $pull: { comments: this._id }
    });
  } catch (error) {
    console.error('Error updating user/product references after deletion:', error);
  }
});

// Static method to get comments for a product with pagination
CommentSchema.statics.getProductComments = async function(
  productId: mongoose.Types.ObjectId,
  page: number = 1,
  limit: number = 10,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  
  const [comments, total] = await Promise.all([
    this.find({ product: productId })
      .populate('user', 'name image')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments({ product: productId })
  ]);
  
  return {
    comments,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalComments: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  };
};

// Static method to get user's comment history
CommentSchema.statics.getUserComments = async function(
  userId: mongoose.Types.ObjectId,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit;
  
  const [comments, total] = await Promise.all([
    this.find({ user: userId })
      .populate('product', 'name images productId')
      .populate('user', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments({ user: userId })
  ]);
  
  return {
    comments,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalComments: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  };
};

// Method to toggle like
CommentSchema.methods.toggleLike = async function(userId: mongoose.Types.ObjectId) {
  const userIndex = this.likes.indexOf(userId);
  const dislikeIndex = this.dislikes.indexOf(userId);
  
  if (userIndex === -1) {
    // Add like
    this.likes.push(userId);
    // Remove from dislikes if present
    if (dislikeIndex !== -1) {
      this.dislikes.splice(dislikeIndex, 1);
    }
  } else {
    // Remove like
    this.likes.splice(userIndex, 1);
  }
  
  return await this.save();
};

// Method to toggle dislike
CommentSchema.methods.toggleDislike = async function(userId: mongoose.Types.ObjectId) {
  const userIndex = this.dislikes.indexOf(userId);
  const likeIndex = this.likes.indexOf(userId);
  
  if (userIndex === -1) {
    // Add dislike
    this.dislikes.push(userId);
    // Remove from likes if present
    if (likeIndex !== -1) {
      this.likes.splice(likeIndex, 1);
    }
  } else {
    // Remove dislike
    this.dislikes.splice(userIndex, 1);
  }
  
  return await this.save();
};

// Method to get user's reaction (like/dislike) to this comment
CommentSchema.methods.getUserReaction = function(userId: mongoose.Types.ObjectId) {
  if (this.likes.includes(userId)) return 'like';
  if (this.dislikes.includes(userId)) return 'dislike';
  return null;
};

// Static method to check if user can comment on a product
CommentSchema.statics.canUserComment = async function(
  userId: mongoose.Types.ObjectId,
  productId: mongoose.Types.ObjectId
) {
  const Rating = mongoose.model('Rating');
  const existingRating = await Rating.findOne({
    user: userId,
    product: productId
  });
  
  return !!existingRating;
};

// Ensure virtual fields are serialized
CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });

export default mongoose.models.Comment || mongoose.model<IComment, ICommentModel>('Comment', CommentSchema);
