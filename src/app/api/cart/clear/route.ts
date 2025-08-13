import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connect } from '@/hooks/lib/database';
import { authOptions } from '@/hooks/lib/auth';
import Cart from '@/models/Cart';
import { Session } from 'next-auth';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // Clear all items from cart
    cart.items = [];
    await cart.save();

    return NextResponse.json({ 
      success: true,
      message: 'Cart cleared successfully',
      cart: {
        items: cart.items,
        total: cart.totalAmount,
        itemCount: cart.itemCount,
        lastSynced: cart.lastSynced,
      }
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
