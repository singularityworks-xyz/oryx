import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sku: string;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  itemCount: number;
  lastSynced: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartModel extends Model<ICart> {
  findOrCreate: (userId: mongoose.Types.ObjectId) => Promise<ICart>;
}

const CartItemSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 99,
  },
  sku: {
    type: String,
    required: true,
    trim: true,
  },
});

const CartSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  items: [CartItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  itemCount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  lastSynced: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Create indexes for better query performance
CartSchema.index({ userId: 1 });
CartSchema.index({ 'items.productId': 1 });
CartSchema.index({ updatedAt: -1 });

// Pre-save middleware to calculate totals
CartSchema.pre('save', function(next) {
  const cart = this as unknown as { items: ICartItem[]; totalAmount: number; itemCount: number; lastSynced: Date };
  if (cart.items && Array.isArray(cart.items)) {
    cart.totalAmount = cart.items.reduce((total: number, item: ICartItem) => total + (item.price * item.quantity), 0);
    cart.itemCount = cart.items.reduce((count: number, item: ICartItem) => count + item.quantity, 0);
  }
  cart.lastSynced = new Date();
  next();
});

// Static method to find or create cart for user
CartSchema.statics.findOrCreate = async function(userId: mongoose.Types.ObjectId) {
  let cart = await this.findOne({ userId });
  if (!cart) {
    cart = new this({ userId, items: [], totalAmount: 0, itemCount: 0 });
    await cart.save();
  }
  return cart;
};

export default mongoose.models.Cart || mongoose.model<ICart, ICartModel>('Cart', CartSchema);
