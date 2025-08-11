'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Star, MessageCircle, Package, Clock } from 'lucide-react';
import { useRatingsAndComments } from '@/hooks/useRatingsAndComments';
import Image from 'next/image';
import Link from 'next/link';

// Define proper types for ratings and comments
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

interface UserComment {
  _id: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  product: {
    _id: string;
    productId: string;
    name: string;
    images?: string[];
  };
}

export const UserProfile: React.FC = () => {
  const { data: session } = useSession();
  const {
    loading,
    error,
    clearError,
    getUserRatings,
    getUserComments,
  } = useRatingsAndComments();

  const [activeTab, setActiveTab] = useState<'ratings' | 'comments'>('ratings');
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [ratingsPagination, setRatingsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRatings: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [commentsPagination, setCommentsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalComments: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const loadUserRatings = useCallback(async (page: number = 1) => {
    const result = await getUserRatings(page, 10);
    if (result) {
      setRatings(result.ratings);
      setRatingsPagination(result.pagination);
    }
  }, [getUserRatings]);

  const loadUserComments = useCallback(async (page: number = 1) => {
    const result = await getUserComments(page, 10);
    if (result) {
      setComments(result.comments);
      setCommentsPagination(result.pagination);
    }
  }, [getUserComments]);

  useEffect(() => {
    if (session?.user) {
      loadUserRatings();
      loadUserComments();
    }
  }, [session, loadUserRatings, loadUserComments]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  if (!session?.user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <button
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* User Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center space-x-4">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-2xl font-bold">
                {(session.user.name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {session.user.name || 'User'}
            </h1>
            <p className="text-gray-600">{session.user.email}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>{ratingsPagination.totalRatings} ratings</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{commentsPagination.totalComments} comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('ratings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ratings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>My Ratings</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'comments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>My Comments</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Ratings Tab */}
          {activeTab === 'ratings' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Products You&apos;ve Rated</h3>
              
              {ratings.length > 0 ? (
                <div className="space-y-4">
                  {ratings.map((rating) => (
                    <div key={rating._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {rating.product.images && rating.product.images[0] ? (
                            <Image
                              src={rating.product.images[0]}
                              alt={rating.product.name}
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-15 h-15 bg-gray-200 rounded-md flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <Link
                                href={`/products/${rating.product.productId}`}
                                className="text-lg font-medium text-gray-900 hover:text-blue-600"
                              >
                                {rating.product.name}
                              </Link>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="flex">
                                  {renderStars(rating.rating)}
                                </div>
                                <span className="text-sm text-gray-600">({rating.rating}/5)</span>
                              </div>
                            </div>
                            
                            <div className="text-right text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(rating.createdAt)}</span>
                              </div>
                              {rating.product.averageRating > 0 && (
                                <div className="mt-1">
                                  <span className="text-xs text-gray-400">
                                    Product avg: {rating.product.averageRating.toFixed(1)}/5
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Ratings Pagination */}
                  {ratingsPagination.totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-6">
                      <button
                        onClick={() => loadUserRatings(ratingsPagination.currentPage - 1)}
                        disabled={!ratingsPagination.hasPrevPage}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      
                      <span className="px-3 py-2 text-sm text-gray-600">
                        Page {ratingsPagination.currentPage} of {ratingsPagination.totalPages}
                      </span>
                      
                      <button
                        onClick={() => loadUserRatings(ratingsPagination.currentPage + 1)}
                        disabled={!ratingsPagination.hasNextPage}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>You haven&apos;t rated any products yet.</p>
                  <p className="text-sm mt-1">Start exploring products and share your ratings!</p>
                </div>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Comments You&apos;ve Made</h3>
              
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {comment.product.images && comment.product.images[0] ? (
                            <Image
                              src={comment.product.images[0]}
                              alt={comment.product.name}
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-15 h-15 bg-gray-200 rounded-md flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <Link
                                href={`/products/${comment.product.productId}`}
                                className="text-lg font-medium text-gray-900 hover:text-blue-600"
                              >
                                {comment.product.name}
                              </Link>
                              <p className="text-gray-700 mt-2">{comment.content}</p>
                              {comment.isEdited && (
                                <span className="text-xs text-gray-400 mt-1">(edited)</span>
                              )}
                            </div>
                            
                            <div className="text-right text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(comment.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Comments Pagination */}
                  {commentsPagination.totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-6">
                      <button
                        onClick={() => loadUserComments(commentsPagination.currentPage - 1)}
                        disabled={!commentsPagination.hasPrevPage}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      
                      <span className="px-3 py-2 text-sm text-gray-600">
                        Page {commentsPagination.currentPage} of {commentsPagination.totalPages}
                      </span>
                      
                      <button
                        onClick={() => loadUserComments(commentsPagination.currentPage + 1)}
                        disabled={!commentsPagination.hasNextPage}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>You haven&apos;t commented on any products yet.</p>
                  <p className="text-sm mt-1">Rate a product first, then share your thoughts!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}
    </div>
  );
};
