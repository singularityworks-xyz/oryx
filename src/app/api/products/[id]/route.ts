import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/hooks/lib/database';
import Product from '@/models/Product';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();

    const body = await request.json();
    const {
      productId,
      name,
      description,
      costPrice,
      discount,
      sellingPrice,
      categories,
      stock,
      tags,
      images,
      sku,
      isActive,
      isTrending,
      weight,
      dimensions,
      brand,
      material,
      warranty
    } = body;

    // Validate required fields
    if (!productId || !name || !description || !costPrice || !categories || !stock || !sku || !images) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if SKU already exists for other products
    const existingProduct = await Product.findOne({ sku, _id: { $ne: id } });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      );
    }

    // Check if productId already exists for other products
    const existingProductId = await Product.findOne({ productId, _id: { $ne: id } });
    if (existingProductId) {
      return NextResponse.json(
        { error: 'Product ID already exists' },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productId,
        name,
        description,
        costPrice,
        discount: discount || 0,
        sellingPrice: sellingPrice || (costPrice - (discount || 0)),
        categories,
        stock,
        tags: tags || [],
        images,
        sku,
        isActive: isActive !== undefined ? isActive : true,
        isTrending: isTrending || false,
        weight,
        dimensions,
        brand,
        material,
        warranty
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connect();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 