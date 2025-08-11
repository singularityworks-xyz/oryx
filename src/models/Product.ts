import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  productId: string;
  name: string;
  description: string;
  costPrice: number;
  discount: number;
  sellingPrice: number;
  categories: string[];
  stock: number;
  tags: string[];
  images: string[];
  sku: string;
  isActive: boolean;
  isTrending: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  brand?: string;
  material?: string;
  warranty?: string;
  averageRating: number;
  totalRatings: number;
  ratings: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  productId: {
    type: String,
    required: [true, 'Please provide a product ID'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    maxlength: [100, 'Product name cannot be more than 100 characters'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  costPrice: {
    type: Number,
    required: [true, 'Please provide a cost price'],
    min: [0, 'Cost price cannot be negative'],
  },
  discount: {
    type: Number,
    required: [true, 'Please provide a discount amount'],
    min: [0, 'Discount cannot be negative'],
    default: 0,
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Please provide a selling price'],
    min: [0, 'Selling price cannot be negative'],
  },
  categories: [{
    type: String,
    required: [true, 'Please provide at least one category'],
    enum: ['cutleries', 'chinaware', 'glassware', 'kitchen utensils', 'others'],
  }],
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  images: [{
    type: String,
    required: [true, 'Please provide at least one image'],
  }],
  
  isActive: {
    type: Boolean,
    default: true,
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
  },
  dimensions: {
    length: {
      type: Number,
      min: [0, 'Length cannot be negative'],
    },
    width: {
      type: Number,
      min: [0, 'Width cannot be negative'],
    },
    height: {
      type: Number,
      min: [0, 'Height cannot be negative'],
    },
  },
  brand: {
    type: String,
    trim: true,
  },
  material: {
    type: String,
    trim: true,
  },
  warranty: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Pre-save middleware to calculate selling price
ProductSchema.pre('save', function(next) {
  const doc = this as Document & Record<string, unknown>;
  if (doc.isModified('costPrice') || doc.isModified('discount')) {
    const costPrice = (doc as Record<string, unknown>).costPrice as number;
    const discount = (doc as Record<string, unknown>).discount as number;
    (doc as Record<string, unknown>).sellingPrice = costPrice - discount;
  }
  next();
});

// Create indexes for better search performance
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ categories: 1 });
ProductSchema.index({ isTrending: 1 });
ProductSchema.index({ isActive: 1 });

// Virtual for discount percentage
ProductSchema.virtual('discountPercentage').get(function() {
  const doc = this as Document & Record<string, unknown>;
  const costPrice = (doc as Record<string, unknown>).costPrice as number;
  const discount = (doc as Record<string, unknown>).discount as number;
  if (costPrice > 0) {
    return Math.round((discount / costPrice) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 