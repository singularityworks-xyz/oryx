import React from 'react';
import { Star, Package, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface UserRating {
  _id: string;
  rating: number;
  createdAt: string;
  product: {
    _id: string;
    productId: string;
    name: string;
    images?: string[];
    averageRating: number;
  };
}

interface RatingsTabProps {
  ratings: UserRating[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange: (page: number) => void;
  formatDate: (dateString: string) => string;
  renderStars: (rating: number) => React.ReactNode;
}

export default function RatingsTab({
  ratings,
  pagination,
  onPageChange,
  formatDate,
  renderStars
}: RatingsTabProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-playfair font-light text-gray-900">Products You&apos;ve Rated</h3>
      </div>
      
      <div className="p-6">
        {ratings.length > 0 ? (
          <div className="space-y-6">
            {ratings.map((rating) => (
              <div key={rating._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {rating.product.images && rating.product.images[0] ? (
                      <Image
                        src={rating.product.images[0]}
                        alt={rating.product.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/products/${rating.product.productId}`}
                          className="text-xl font-playfair font-light text-gray-900 hover:text-gray-700 transition-colors"
                        >
                          {rating.product.name}
                        </Link>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex">
                            {renderStars(rating.rating)}
                          </div>
                          <span className="text-sm text-gray-600 font-outfit font-light">({rating.rating}/5)</span>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-500 font-outfit font-light">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(rating.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-outfit font-light mb-2">No ratings yet</p>
            <p className="text-sm font-outfit font-light">Start exploring products and share your ratings!</p>
            <Link
              href="/products"
              className="inline-flex items-center mt-4 px-6 py-3 bg-gray-900 text-white font-outfit font-light text-sm hover:bg-gray-800 transition-all duration-300 border border-gray-900 hover:border-gray-800 tracking-wider"
            >
              Explore Products
            </Link>
          </div>
        )}
        
        {/* Ratings Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-3 mt-8">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-outfit font-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-sm text-gray-600 font-outfit font-light">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-outfit font-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
