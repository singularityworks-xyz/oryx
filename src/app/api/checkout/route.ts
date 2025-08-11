import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connect } from '@/hooks/lib/database';
import { authOptions } from '@/hooks/lib/auth';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { Session } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { items, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    await connect();

    // Validate products and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
      });
    }

    // Create order in database with COD status
    const order = new Order({
      userId: session.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Confirmed'
    });

    await order.save();

    return NextResponse.json({
      success: true,
      orderId: order._id,
      message: 'Order placed successfully! Payment will be collected on delivery.',
      order: {
        id: order._id,
        totalAmount,
        items: orderItems,
        shippingAddress,
        paymentMethod: 'Cash on Delivery',
        orderStatus: 'Confirmed'
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 