import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/hooks/lib/auth';
import connect from '@/hooks/lib/database';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await connect();
    
    const user = await User.findOne({ email: session.user.email })
      .select('-password')
      .lean();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { name, phone, address } = body;
    
    // Validation
    const validationErrors: string[] = [];
    
    // Validate name
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        validationErrors.push('Name is required and cannot be empty');
      } else if (name.length > 60) {
        validationErrors.push('Name cannot be more than 60 characters');
      }
    }
    
    // Validate phone number
    if (phone !== undefined && phone !== '') {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phone)) {
        validationErrors.push('Please provide a valid phone number');
      }
    }
    
    // Validate address fields
    if (address) {
      if (typeof address !== 'object') {
        validationErrors.push('Invalid address format');
      } else {
        const addressFields = ['fullName', 'mobileNumber', 'buildingNumber', 'streetName', 'zoneNumber', 'area', 'city', 'poBox'];
        for (const field of addressFields) {
          if (address[field] !== undefined && typeof address[field] !== 'string') {
            validationErrors.push(`${field} must be a string`);
          }
        }
        
        // Validate mobile number format if provided
        if (address.mobileNumber && address.mobileNumber !== '') {
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (!phoneRegex.test(address.mobileNumber)) {
            validationErrors.push('Please provide a valid mobile number');
          }
        }
      }
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    await connect();
    
    const updateData: {
      name?: string;
      phone?: string | null;
      address?: {
        fullName: string;
        mobileNumber: string;
        buildingNumber: string;
        streetName: string;
        zoneNumber: string;
        area: string;
        city: string;
        poBox: string;
      };
    } = {};
    
    if (name !== undefined) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone || null;
    if (address) {
      updateData.address = {
        fullName: address.fullName || '',
        mobileNumber: address.mobileNumber || '',
        buildingNumber: address.buildingNumber || '',
        streetName: address.streetName || '',
        zoneNumber: address.zoneNumber || '',
        area: address.area || '',
        city: address.city || '',
        poBox: address.poBox || ''
      };
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // Handle mongoose validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as unknown as { errors: Record<string, { message: string }> }).errors).map((err) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
