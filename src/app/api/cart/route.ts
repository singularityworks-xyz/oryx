import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connect } from '@/hooks/lib/database';
import { authOptions } from '@/hooks/lib/auth';
import Product from '@/models/Product';
import Cart, { ICartModel, ICartItem } from '@/models/Cart';
import { Session } from 'next-auth';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connect();

    // Get or create cart for user
    const cart = await (Cart as ICartModel).findOrCreate(new mongoose.Types.ObjectId(session.user.id));
    
    return NextResponse.json({
      success: true,
      items: cart.items,
      total: cart.totalAmount,
      itemCount: cart.itemCount,
      lastSynced: cart.lastSynced,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    if (quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: 'Quantity must be between 1 and 99' },
        { status: 400 }
      );
    }

    await connect();

    // Verify product exists and has sufficient stock
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Get or create cart for user
    const cart = await (Cart as ICartModel).findOrCreate(new mongoose.Types.ObjectId(session.user.id));
    
    // Add item to cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: new mongoose.Types.ObjectId(productId),
        name: product.name,
        price: product.sellingPrice,
        image: product.images[0],
        quantity,
        sku: product.sku,
      });
    }
    
    await cart.save();

    return NextResponse.json({ 
      success: true,
      message: 'Item added to cart',
      cart: {
        items: cart.items,
        total: cart.totalAmount,
        itemCount: cart.itemCount,
        lastSynced: cart.lastSynced,
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity < 0 || quantity > 99) {
      return NextResponse.json(
        { error: 'Quantity must be between 0 and 99' },
        { status: 400 }
      );
    }

    await connect();

    // Get cart for user
    const cart = await Cart.findOne({ userId: session.user.id });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Update quantity
    if (quantity <= 0) {
      cart.items = cart.items.filter((item: ICartItem) => item.productId.toString() !== productId);
    } else {
      const item = cart.items.find((item: ICartItem) => item.productId.toString() === productId);
      if (item) {
        item.quantity = quantity;
      }
    }
    
    await cart.save();

    return NextResponse.json({ 
      success: true,
      message: 'Cart updated successfully',
      cart: {
        items: cart.items,
        total: cart.totalAmount,
        itemCount: cart.itemCount,
        lastSynced: cart.lastSynced,
      }
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await connect();

    // Get cart for user
    const cart = await Cart.findOne({ userId: session.user.id });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Remove item from cart
    cart.items = cart.items.filter((item: ICartItem) => item.productId.toString() !== productId);
    await cart.save();

    return NextResponse.json({ 
      success: true,
      message: 'Item removed from cart',
      cart: {
        items: cart.items,
        total: cart.totalAmount,
        itemCount: cart.itemCount,
        lastSynced: cart.lastSynced,
      }
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
} 
