'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import OptimizedImage from '@/components/OptimizedImage';
import { useCartStore } from '@/store/cart';
import { ShoppingCart, Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

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

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product._id,
      name: product.name,
      price: product.sellingPrice,
      image: product.images[0],
      quantity,
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.costPrice > 0 ? Math.round((product.discount / product.costPrice) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/products" className="text-gray-700 hover:text-gray-900">
                Products
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
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
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
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
        <div className="space-y-6">
          {/* Product Header */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {product.isTrending && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  <Star className="w-3 h-3 mr-1" />
                  Trending
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  -{discountPercentage}% OFF
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                QAR {product.sellingPrice.toFixed(2)}
              </span>
              {discountPercentage > 0 && (
                <span className="text-lg text-gray-500 line-through">
                  QAR {product.costPrice.toFixed(2)}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <p className="text-sm text-green-600">
                You save QAR {product.discount.toFixed(2)} ({discountPercentage}% off)
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              product.stock > 10 ? 'bg-green-100 text-green-800' :
              product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-600 hover:text-gray-900"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1 text-gray-600 hover:text-gray-900"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">SKU:</span>
                <span className="ml-2 text-gray-600">{product.sku}</span>
              </div>
              {product.brand && (
                <div>
                  <span className="font-medium text-gray-700">Brand:</span>
                  <span className="ml-2 text-gray-600">{product.brand}</span>
                </div>
              )}
              {product.material && (
                <div>
                  <span className="font-medium text-gray-700">Material:</span>
                  <span className="ml-2 text-gray-600">{product.material}</span>
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="font-medium text-gray-700">Weight:</span>
                  <span className="ml-2 text-gray-600">{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Dimensions:</span>
                  <span className="ml-2 text-gray-600">
                    {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                  </span>
                </div>
              )}
              {product.warranty && (
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Warranty:</span>
                  <span className="ml-2 text-gray-600">{product.warranty}</span>
                </div>
              )}
            </div>

            {/* Categories */}
            <div>
              <span className="font-medium text-gray-700">Categories:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Free shipping on orders over QAR 200</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Secure payment processing</span>
              </div>
              {product.warranty && (
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">{product.warranty} warranty</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 