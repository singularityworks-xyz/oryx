import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    const connection = await dbConnect();
    
    if (!connection) {
      return NextResponse.json(
        { 
          products: [],
          pagination: { page: 1, limit: 12, total: 0, pages: 0 },
          message: 'Database connection not available. Please try again later.'
        },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isActive: true };

    if (category) {
      query.categories = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        products: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 0 },
        error: 'Failed to fetch products'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

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

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      );
    }

    // Check if productId already exists
    const existingProductId = await Product.findOne({ productId });
    if (existingProductId) {
      return NextResponse.json(
        { error: 'Product ID already exists' },
        { status: 400 }
      );
    }

    const product = new Product({
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
    });

    await product.save();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
} 