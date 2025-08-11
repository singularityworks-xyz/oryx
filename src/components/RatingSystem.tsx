'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Star, StarHalf } from 'lucide-react';
import { useRatingsAndComments } from '@/hooks/useRatingsAndComments';

interface RatingSystemProps {
  productId: string;
  initialAverageRating?: number;
  initialTotalRatings?: number;
}

export const RatingSystem: React.FC<RatingSystemProps> = ({
  productId,
  initialAverageRating = 0,
  initialTotalRatings = 0,
}) => {
  const { data: session } = useSession();
  const {
    loading,
    error,
    clearError,
    rateProduct,
    getProductRatings,
    deleteRating,
  } = useRatingsAndComments();

  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [totalRatings, setTotalRatings] = useState(initialTotalRatings);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  });
  const [showRatingForm, setShowRatingForm] = useState(false);

  const loadRatings = useCallback(async () => {
    const ratings = await getProductRatings(productId);
    if (ratings) {
      setAverageRating(ratings.averageRating);
      setTotalRatings(ratings.totalRatings);
      setRatingDistribution(ratings.ratingDistribution);
    }
  }, [productId, getProductRatings]);

  useEffect(() => {
    loadRatings();
  }, [productId, loadRatings]);

  const handleRateProduct = async (rating: number) => {
    if (!session?.user) {
      return;
    }

    const result = await rateProduct(productId, rating);
    if (result) {
      setUserRating(rating);
      setShowRatingForm(false);
      await loadRatings(); // Refresh ratings
    }
  };

  const handleDeleteRating = async () => {
    if (!session?.user) {
      return;
    }

    const success = await deleteRating(productId);
    if (success) {
      setUserRating(null);
      await loadRatings(); // Refresh ratings
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className={`text-yellow-400 fill-current ${
              size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
            }`}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className={`text-yellow-400 fill-current ${
              size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
            }`}
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            className={`text-gray-300 ${
              size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
            }`}
          />
        );
      }
    }

    return stars;
  };

  const renderRatingBar = (rating: number, count: number) => {
    const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
    
    return (
      <div key={rating} className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 w-4">{rating}</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Overall Rating Display */}
      <div className="flex items-center space-x-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center mt-1">
            {renderStars(averageRating, 'lg')}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map(rating => renderRatingBar(rating, ratingDistribution[rating]))}
        </div>
      </div>

      {/* User Rating Section */}
      {session?.user && (
        <div className="border-t pt-4">
          {userRating ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Your rating:</span>
                <div className="flex">
                  {renderStars(userRating, 'sm')}
                </div>
                <span className="text-sm text-gray-900">({userRating})</span>
              </div>
              <button
                onClick={() => setShowRatingForm(true)}
                className="text-blue-600 hover:text-blue-800 text-sm"
                disabled={loading}
              >
                Change
              </button>
              <button
                onClick={handleDeleteRating}
                className="text-red-600 hover:text-red-800 text-sm"
                disabled={loading}
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowRatingForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              Rate this product
            </button>
          )}

          {/* Rating Form */}
          {showRatingForm && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm text-gray-600">Select rating:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleRateProduct(rating)}
                      className="text-2xl hover:scale-110 transition-transform"
                      disabled={loading}
                    >
                      {renderStars(rating, 'md')[rating - 1]}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowRatingForm(false)}
                className="text-gray-600 hover:text-gray-800 text-sm"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}
    </div>
  );
};
