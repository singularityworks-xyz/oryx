'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import OptimizedImage from '@/components/OptimizedImage';
import { useAuthenticatedCart } from '@/hooks/useAuthenticatedCart';
import { ShoppingCart, Star, ArrowLeft, Heart, Share2, Check } from 'lucide-react';
import Link from 'next/link';
import { RatingSystem } from '@/components/RatingSystem';
import { CommentSystem } from '@/components/CommentSystem';
import ProductCard from '@/components/ProductCard';

interface Product {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useAuthenticatedCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchRelatedProducts = useCallback(async () => {
    if (!product) return;
    
    try {
      setLoadingRelated(true);
      
      console.log('Fetching related products for:', product._id);
      console.log('Product categories:', product.categories);
      
      // Try to fetch products from the same category first
      if (product.categories && product.categories.length > 0) {
        const url = `/api/products?category=${product.categories[0]}&limit=8&exclude=${product._id}`;
        console.log('Fetching from category URL:', url);
        
        const response = await fetch(url);
        const data = await response.json();

        console.log('Category response:', data);
        console.log('Products found:', data.products?.length || 0);

        if (response.ok && data.products && data.products.length > 0) {
          // Filter out the current product as a safety measure
          const filteredProducts = data.products.filter((p: Product) => p._id !== product._id);
          console.log('Setting related products from category:', filteredProducts.map((p: Product) => ({ id: p._id, name: p.name })));
          console.log('Filtered out current product:', product._id);
          setRelatedProducts(filteredProducts);
          return;
        }
      }
      
      // Fallback to trending products if no category products found
      const url = `/api/products?trending=true&limit=8&exclude=${product._id}`;
      console.log('Fallback to trending URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();

      console.log('Trending response:', data);
      console.log('Products found:', data.products?.length || 0);

      if (response.ok && data.products) {
        // Filter out the current product as a safety measure
        const filteredProducts = data.products.filter((p: Product) => p._id !== product._id);
        console.log('Setting related products from trending:', filteredProducts.map((p: Product) => ({ id: p._id, name: p.name })));
        console.log('Filtered out current product:', product._id);
        setRelatedProducts(filteredProducts);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoadingRelated(false);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [product, fetchRelatedProducts]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();

      if (response.ok) {
        setProduct(data);
      } else {
        console.error('Failed to fetch product:', data.error);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleAddToCart = async () => {
    if (!product) return;

    await addItem({
      id: product._id,
      name: product.name,
      price: product.sellingPrice,
      image: product.images[0],
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-6"></div>
          <p className="text-gray-600 font-outfit font-light text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-3xl font-playfair font-light text-gray-900 mb-6">Product Not Found</h1>
          <p className="text-gray-600 mb-8 font-outfit font-light leading-relaxed">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-outfit font-light text-lg hover:bg-gray-800 transition-all duration-500 tracking-widest hover:scale-105 transform"
          >
            <ArrowLeft className="w-5 h-5 mr-3" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.costPrice > 0 ? Math.round((product.discount / product.costPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8">
        <ol className="inline-flex items-center space-x-2 text-sm font-outfit font-light text-gray-600">
          <li>
            <Link href="/" className="hover:text-gray-900 transition-colors duration-300">
              Home
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-gray-900 transition-colors duration-300">
              Products
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </li>
        </ol>
      </nav>

      {/* Main Product Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden bg-gray-50">
              <OptimizedImage
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality="auto:best"
                format="auto"
                responsive
                priority={true}
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative overflow-hidden bg-gray-50 transition-all duration-300 ${
                      selectedImage === index
                        ? 'ring-2 ring-gray-900'
                        : 'hover:ring-1 ring-gray-300'
                    }`}
                  >
                    <OptimizedImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                      quality="good"
                      format="auto"
                      responsive
                      priority={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex items-center space-x-3">
                {product.isTrending && (
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-outfit font-light bg-white text-gray-900 border border-gray-200 tracking-widest">
                    <Star className="w-3 h-3 mr-2 fill-current" />
                    TRENDING
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-outfit font-light bg-gray-900 text-white tracking-widest">
                    -{discountPercentage}% OFF
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-light text-gray-900 leading-tight tracking-wide">
                {product.name}
              </h1>
              
              <p className="text-lg font-outfit font-light text-gray-600 leading-relaxed max-w-lg">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="space-y-3">
              <div className="flex items-baseline space-x-4">
                <span className="text-4xl lg:text-5xl font-playfair font-light text-gray-900">
                  QAR {product.sellingPrice.toFixed(2)}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-xl font-outfit font-light text-gray-500 line-through">
                    QAR {product.costPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {discountPercentage > 0 && (
                <p className="text-sm font-outfit font-light text-green-600">
                  You save QAR {product.discount.toFixed(2)} ({discountPercentage}% off)
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                product.stock > 10 ? 'bg-green-500' :
                product.stock > 0 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></div>
              <span className={`text-sm font-outfit font-light ${
                product.stock > 10 ? 'text-green-700' :
                product.stock > 0 ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-outfit font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-200 rounded-none">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors duration-300 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="px-6 py-3 border-x border-gray-200 font-outfit font-medium text-gray-900 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors duration-300 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 border transition-all duration-300 ${
                    isWishlisted 
                      ? 'border-red-300 bg-red-50 text-red-600' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <button className="p-3 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 transition-all duration-300">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-gray-900 text-white py-4 px-8 font-outfit font-light text-lg tracking-widest hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-500 hover:scale-[1.02] transform disabled:hover:scale-100"
              >
                <div className="flex items-center justify-center space-x-3">
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </div>
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-100 pt-8 space-y-4">
              <h3 className="text-lg font-playfair font-light text-gray-900">Features</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-outfit font-light text-gray-600">Free shipping on orders over QAR 200</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-outfit font-light text-gray-600">Secure payment processing</span>
                </div>
                {product.warranty && (
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-outfit font-light text-gray-600">{product.warranty} warranty</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-100 pt-8 space-y-6">
              <h3 className="text-lg font-playfair font-light text-gray-900">Product Details</h3>
              
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="font-outfit font-medium text-gray-700 block mb-1">SKU</span>
                  <span className="font-outfit font-light text-gray-600">{product.sku}</span>
                </div>
                {product.brand && (
                  <div>
                    <span className="font-outfit font-medium text-gray-700 block mb-1">Brand</span>
                    <span className="font-outfit font-light text-gray-600">{product.brand}</span>
                  </div>
                )}
                {product.material && (
                  <div>
                    <span className="font-outfit font-medium text-gray-700 block mb-1">Material</span>
                    <span className="font-outfit font-light text-gray-600">{product.material}</span>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <span className="font-outfit font-medium text-gray-700 block mb-1">Weight</span>
                    <span className="font-outfit font-light text-gray-600">{product.weight} kg</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="col-span-2">
                    <span className="font-outfit font-medium text-gray-700 block mb-1">Dimensions</span>
                    <span className="font-outfit font-light text-gray-600">
                      {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                    </span>
                  </div>
                )}
                {product.warranty && (
                  <div className="col-span-2">
                    <span className="font-outfit font-medium text-gray-700 block mb-1">Warranty</span>
                    <span className="font-outfit font-light text-gray-600">{product.warranty}</span>
                  </div>
                )}
              </div>

              {/* Categories */}
              <div>
                <span className="font-outfit font-medium text-gray-700 block mb-3">Categories</span>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-outfit font-light bg-gray-100 text-gray-800 tracking-wide"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div>
                  <span className="font-outfit font-medium text-gray-700 block mb-3">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-outfit font-light bg-gray-900 text-white tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-light text-gray-900 mb-6 tracking-wide">
              CUSTOMER RATINGS
            </h2>
            <div className="w-20 sm:w-24 md:w-28 lg:w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
            <p className="text-base md:text-lg text-gray-600 mt-6 max-w-2xl mx-auto font-outfit font-light leading-relaxed">
              See what our customers think about this product
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <RatingSystem 
              productId={product._id} 
              initialAverageRating={4.5}
              initialTotalRatings={127}
            />
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-light text-gray-900 mb-6 tracking-wide">
              CUSTOMER COMMENTS
            </h2>
            <div className="w-20 sm:w-24 md:w-28 lg:w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
            <p className="text-base md:text-lg text-gray-600 mt-6 max-w-2xl mx-auto font-outfit font-light leading-relaxed">
              Share your thoughts and read what others have to say
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <CommentSystem productId={product._id} />
          </div>
        </div>
      </section>

      {/* You May Also Like Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-light text-gray-900 mb-6 tracking-wide">
              YOU MAY ALSO LIKE
            </h2>
            <div className="w-20 sm:w-24 md:w-28 lg:w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
            <p className="text-base md:text-lg text-gray-600 mt-6 max-w-2xl mx-auto font-outfit font-light leading-relaxed">
              Discover more premium kitchen essentials from our curated collection
            </p>
          </div>

          {loadingRelated ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-6"></div>
              <p className="text-gray-600 font-outfit font-light">Loading related products...</p>
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-600 font-outfit font-light text-lg mb-4">No related products found</p>
              <p className="text-gray-500 font-outfit font-light">Explore our full collection for more premium kitchen essentials</p>
            </div>
          )}

          {/* View All Products Button */}
          <div className="text-center mt-16 lg:mt-20">
            <Link
              href="/products"
              className="inline-flex items-center px-8 lg:px-12 py-4 lg:py-5 bg-gray-900 text-white font-outfit font-light text-lg tracking-widest hover:bg-gray-800 transition-all duration-500 hover:scale-105 transform"
            >
              EXPLORE FULL COLLECTION
              <ArrowLeft className="ml-3 lg:ml-4 w-5 h-5 rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 