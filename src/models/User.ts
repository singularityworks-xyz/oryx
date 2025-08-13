import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  phone?: string;
  address?: {
    fullName: string;
    mobileNumber: string;
    buildingNumber: string;
    streetName: string;
    zoneNumber: string;
    area: string;
    city: string;
    poBox?: string;
  };
  role: 'user' | 'admin';
  ratings: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: false, // Not required for OAuth users
    minlength: [6, 'Password must be at least 6 characters'],
  },
  image: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number'],
  },
  address: {
    fullName: {
      type: String,
      required: false,
    },
    mobileNumber: {
      type: String,
      required: false,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid mobile number'],
    },
    buildingNumber: {
      type: String,
      required: false,
    },
    streetName: {
      type: String,
      required: false,
    },
    zoneNumber: {
      type: String,
      required: false,
    },
    area: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    poBox: {
      type: String,
      required: false,
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  ratings: [{
    type: Schema.Types.ObjectId,
    ref: 'Rating',
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
}, {
  timestamps: true,
});

// Prevent mongoose from creating the model multiple times
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 