'use client';

import LazyImage from './LazyImage';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: {
    _id: string;
    productId?: string;
    name: string;
    description: string;
    sellingPrice?: number;
    price?: number;
    costPrice?: number;
    discount?: number;
    images: string[];
    categories?: string[];
    category?: string;
    stock: number;
    tags?: string[];
    isTrending?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  
  // Use sellingPrice if available, otherwise fall back to price
  const displayPrice = product.sellingPrice || product.price || 0;
  const originalPrice = product.costPrice || product.price || 0;
  const discount = product.discount || 0;
  const discountPercentage = originalPrice > 0 ? Math.round((discount / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: displayPrice,
      image: product.images[0],
    });
  };

  return (
    <div className="group bg-white overflow-hidden hover:shadow-2xl transition-all duration-700 border border-gray-100 hover:border-gray-200 flex flex-col h-full relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Image Container */}
      <div className="relative h-80 w-full overflow-hidden bg-gray-50 flex-shrink-0">
        <Link href={`/products/${product._id}`}>
          <LazyImage
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            quality="auto:best"
            priority={false}
            threshold={0.1}
            rootMargin="100px"
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-700"></div>
        </Link>
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 bg-black text-white text-xs font-outfit font-light px-3 py-1.5 tracking-widest shadow-lg">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Trending Badge */}
        {product.isTrending && (
          <div className="absolute top-4 right-4 bg-white text-black text-xs font-outfit font-light px-3 py-1.5 tracking-widest border border-gray-200 shadow-lg">
            <Star className="w-3 h-3 fill-current inline mr-1" />
            TRENDING
          </div>
        )}
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="absolute bottom-4 right-4 bg-black text-white p-3.5 rounded-full hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-500 opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 shadow-lg hover:shadow-xl hover:scale-110"
          title="Add to cart"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-8 flex flex-col flex-1 relative z-10">
        <Link href={`/products/${product._id}`} className="flex-1">
          <h3 className="text-lg font-outfit font-medium text-gray-900 mb-6 hover:text-gray-600 transition-colors duration-300 leading-relaxed tracking-wide">
            {product.name}
          </h3>
        </Link>
        
        {/* Price Section - Moved to bottom */}
        <div className="flex items-baseline gap-4 mt-auto">
          <span className="text-2xl font-outfit font-light text-gray-900 tracking-wide">
            <span className='text-gray-500 text-sm font-outfit font-light tracking-wider'>QAR</span><br />
            {displayPrice.toFixed(2)}
          </span>
          {discountPercentage > 0 && (
            <span className="text-sm font-outfit font-light text-gray-400 line-through tracking-wide">
              QAR {originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 