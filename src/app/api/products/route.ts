import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

// Retry function for database connection
async function connectWithRetry(maxRetries = 3, delay = 1000): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`connectWithRetry: Attempt ${i + 1} of ${maxRetries}`);
      const connection = await dbConnect();
      if (connection) {
        console.log(`connectWithRetry: Success on attempt ${i + 1}`);
        return connection;
      }
    } catch (error) {
      console.error(`connectWithRetry: Connection attempt ${i + 1} failed:`, error);
    }
    
    if (i < maxRetries - 1) {
      console.log(`connectWithRetry: Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  console.log('connectWithRetry: All attempts failed');
  return null;
}

// Simple health check function
async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const connection = await dbConnect();
    return !!connection;
  } catch (error) {
    console.error('checkDatabaseHealth: Error:', error);
    return false;
  }
}

// Build MongoDB aggregation pipeline for efficient filtering and sorting
function buildAggregationPipeline(params: {
  category?: string;
  search?: string;
  tags?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page: number;
  limit: number;
  inStockOnly?: boolean;
  onSale?: boolean;
  trending?: boolean;
}) {
  const { category, search, tags, minPrice, maxPrice, sort, page, limit, inStockOnly, onSale, trending } = params;
  const skip = (page - 1) * limit;

  // Stage 1: Match stage for filtering
  const matchStage: any = { isActive: true };

  // Category filter
  if (category && category !== 'All Categories') {
    matchStage.categories = category;
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    matchStage.sellingPrice = {};
    if (minPrice !== undefined) matchStage.sellingPrice.$gte = minPrice;
    if (maxPrice !== undefined) matchStage.sellingPrice.$lte = maxPrice;
  }

  // Stock filter
  if (inStockOnly) {
    matchStage.stock = { $gt: 0 };
  }

  // Sale filter (products with discount > 0)
  if (onSale) {
    matchStage.discount = { $gt: 0 };
  }

  // Trending filter
  if (trending) {
    matchStage.isTrending = true;
  }

  // Tags filter
  if (tags) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    matchStage.tags = { $in: tagArray };
  }

  // Text search - only add if search term exists
  if (search && search.trim()) {
    // Use $or for flexible search across multiple fields
    matchStage.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
      { categories: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Stage 2: Add computed fields for sorting
  const addFieldsStage: any = {
    // Calculate discount percentage for sorting
    discountPercentage: {
      $cond: {
        if: { $gt: ['$costPrice', 0] },
        then: { $multiply: [{ $divide: ['$discount', '$costPrice'] }, 100] },
        else: 0
      }
    },
    // Add popularity score (can be enhanced with actual analytics data)
    popularityScore: {
      $add: [
        { $cond: { if: '$isTrending', then: 10, else: 0 } },
        { $cond: { if: { $gt: ['$stock', 0] }, then: 5, else: 0 } },
        { $cond: { if: { $gt: ['$discount', 0] }, then: 3, else: 0 } }
      ]
    }
  };

  // Stage 3: Sort stage
  let sortStage: any = {};
  switch (sort) {
    case 'newest':
      sortStage = { createdAt: -1 };
      break;
    case 'price-low':
      sortStage = { sellingPrice: 1 };
      break;
    case 'price-high':
      sortStage = { sellingPrice: -1 };
      break;
    case 'popular':
      sortStage = { popularityScore: -1, createdAt: -1 };
      break;
    case 'trending':
      sortStage = { isTrending: -1, popularityScore: -1, createdAt: -1 };
      break;
    case 'discount':
      sortStage = { discountPercentage: -1, createdAt: -1 };
      break;
    case 'name-asc':
      sortStage = { name: 1 };
      break;
    case 'name-desc':
      sortStage = { name: -1 };
      break;
    default: // 'featured' - default sorting
      sortStage = { 
        isTrending: -1, 
        popularityScore: -1, 
        createdAt: -1 
      };
      break;
  }

  // Stage 4: Facet stage for pagination and total count
  const facetStage = {
    $facet: {
      products: [
        { $skip: skip },
        { $limit: limit },
        // Project only necessary fields for performance
        {
          $project: {
            _id: 1,
            productId: 1,
            name: 1,
            description: 1,
            sellingPrice: 1,
            costPrice: 1,
            discount: 1,
            images: 1,
            categories: 1,
            stock: 1,
            tags: 1,
            isTrending: 1,
            discountPercentage: 1,
            createdAt: 1
          }
        }
      ],
      totalCount: [{ $count: 'count' }],
      // Add aggregation for price ranges
      priceRanges: [
        {
          $group: {
            _id: null,
            minPrice: { $min: '$sellingPrice' },
            maxPrice: { $max: '$sellingPrice' }
          }
        }
      ]
    }
  };

  return [
    { $match: matchStage },
    { $addFields: addFieldsStage },
    { $sort: sortStage },
    facetStage
  ];
}

export async function GET(request: NextRequest) {
  try {
    console.log('Products API: Starting database connection...');
    
    // Add a small delay to see if it's a timing issue
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Try to connect with retry logic
    const connection = await connectWithRetry();
    
    if (!connection) {
      console.error('Products API: Failed to establish database connection after retries');
      return NextResponse.json(
        { 
          products: [],
          pagination: { page: 1, limit: 40, total: 0, pages: 0 },
          message: 'Database connection not available. Please try again later.'
        },
        { status: 503 }
      );
    }

    console.log('Products API: Database connection established successfully');

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters with validation
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '40'))); // Default to 40, cap at 50 for performance
    
    // Filter parameters
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const tags = searchParams.get('tags') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    
    // Sort parameter
    const sort = searchParams.get('sort') || 'featured';
    
    // Additional filter parameters
    const inStockOnly = searchParams.get('inStockOnly') === 'true';
    const onSale = searchParams.get('onSale') === 'true';
    const trending = searchParams.get('trending') === 'true';

    console.log('Products API: Query parameters:', { 
      category, search, tags, minPrice, maxPrice, sort, page, limit, inStockOnly, onSale, trending 
    });

    // Build aggregation pipeline
    const pipeline = buildAggregationPipeline({
      category,
      search,
      tags,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
      inStockOnly,
      onSale,
      trending
    });

    console.log('Products API: Executing aggregation pipeline');

    // Execute aggregation with performance monitoring
    const startTime = Date.now();
    const [result] = await Product.aggregate(pipeline);
    const executionTime = Date.now() - startTime;

    console.log(`Products API: Aggregation completed in ${executionTime}ms`);

    // Extract results from aggregation
    const products = result.products || [];
    const totalCount = result.totalCount[0]?.count || 0;
    const priceRanges = result.priceRanges[0] || { minPrice: 0, maxPrice: 0 };

    // Calculate pagination
    const totalPages = Math.ceil(totalCount / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Add cache headers for performance
    const response = NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: totalPages,
        hasNext,
        hasPrev,
        currentPage: page,
        productsPerPage: limit
      },
      filters: {
        applied: {
          category: category || null,
          search: search || null,
          minPrice: minPrice || null,
          maxPrice: maxPrice || null,
          sort,
          inStockOnly,
          onSale,
          trending
        },
        available: {
          priceRanges,
          categories: ['All Categories', 'Kitchen Essentials', 'Dining Collection', 'Tableware', 'Cutlery', 'Serveware', 'Storage Solutions'],
          sortOptions: [
            { value: 'featured', label: 'Featured' },
            { value: 'newest', label: 'Newest Arrivals' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' },
            { value: 'popular', label: 'Most Popular' },
            { value: 'trending', label: 'Trending Now' },
            { value: 'discount', label: 'Best Deals' },
            { value: 'name-asc', label: 'Name: A to Z' },
            { value: 'name-desc', label: 'Name: Z to A' }
          ]
        }
      },
      performance: {
        executionTime: `${executionTime}ms`,
        resultCount: products.length,
        totalCount
      }
    });

    // Add performance and caching headers
    response.headers.set('X-Execution-Time', `${executionTime}ms`);
    response.headers.set('X-Result-Count', products.length.toString());
    response.headers.set('X-Total-Count', totalCount.toString());
    
    // Cache control headers for better performance
    if (executionTime < 100) { // Fast queries can be cached longer
      response.headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    } else {
      response.headers.set('Cache-Control', 'public, max-age=60'); // 1 minute
    }

    return response;

  } catch (error) {
    console.error('Products API: Error fetching products:', error);
    return NextResponse.json(
      { 
        products: [],
        pagination: { page: 1, limit: 40, total: 0, pages: 0 },
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
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

export async function HEAD(request: NextRequest) {
  try {
    console.log('Products API HEAD: Testing database connection...');
    const isHealthy = await checkDatabaseHealth();
    
    if (isHealthy) {
      console.log('Products API HEAD: Database connection healthy');
      return new NextResponse(null, { status: 200 });
    } else {
      console.log('Products API HEAD: Database connection unhealthy');
      return new NextResponse(null, { status: 503 });
    }
  } catch (error) {
    console.error('Products API HEAD: Error:', error);
    return new NextResponse(null, { status: 503 });
  }
} 