'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Star, MessageCircle, Package, Clock, User, Settings, ShoppingBag, Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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

interface Order {
  _id: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderStatus: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'Pending';
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    mobileNumber: string;
    buildingNumber: string;
    streetName: string;
    zoneNumber: string;
    area: string;
    city: string;
    poBox?: string;
  };
  createdAt: string;
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

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'ratings' | 'comments' | 'settings'>('overview');
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      fullName: '',
      mobileNumber: '',
      buildingNumber: '',
      streetName: '',
      zoneNumber: '',
      area: '',
      city: '',
      poBox: ''
    }
  });

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

  const loadUserOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      loadUserRatings();
      loadUserComments();
      loadUserOrders();
      
      // Initialize profile form
      setProfileForm({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '',
        address: {
          fullName: '',
          mobileNumber: '',
          buildingNumber: '',
          streetName: '',
          zoneNumber: '',
          area: '',
          city: '',
          poBox: ''
        }
      });
    }
  }, [session, loadUserRatings, loadUserComments, loadUserOrders]);

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'paid':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'shipped':
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
      case 'processing':
        return <Truck className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-playfair font-light text-gray-900 mb-4">Profile Access</h2>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 mb-8 max-w-md mx-auto font-outfit font-light">
            Please sign in to view your profile and manage your account.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-outfit font-light text-lg hover:bg-gray-800 transition-all duration-300 border border-gray-900 hover:border-gray-800 tracking-widest"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/30">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-playfair font-light text-gray-900 mb-8 tracking-wide">
              MY PROFILE
            </h1>
            <div className="w-24 lg:w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-8"></div>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-outfit font-light leading-relaxed">
              Manage your account, track orders, and review your activity with elegance and precision.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-16 lg:pb-24">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* User Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex-shrink-0">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-gray-100 shadow-lg"
                />
              ) : (
                <div className="w-30 h-30 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center border-4 border-gray-100 shadow-lg">
                  <span className="text-gray-600 text-4xl font-bold font-outfit">
                    {(session.user.name || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-3xl font-playfair font-light text-gray-900 mb-2">
                    {session.user.name || 'User'}
                  </h2>
                  <p className="text-lg text-gray-600 font-outfit font-light mb-4">
                    {session.user.email}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-500 font-outfit font-light">
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>{orders.length} orders</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>{ratingsPagination.totalRatings} ratings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{commentsPagination.totalComments} comments</span>
                    </div>
                  </div>
                </div>
                

              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-1 p-2">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                { id: 'ratings', label: 'Ratings', icon: Star },
                { id: 'comments', label: 'Comments', icon: MessageCircle },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'overview' | 'orders' | 'ratings' | 'comments' | 'settings')}
                    className={`flex items-center space-x-2 px-6 py-4 rounded-xl font-outfit font-light text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-outfit font-light text-gray-600">Total Orders</p>
                        <p className="text-2xl font-playfair font-light text-gray-900">{orders.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Star className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-outfit font-light text-gray-600">Total Ratings</p>
                        <p className="text-2xl font-playfair font-light text-gray-900">{ratingsPagination.totalRatings}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-outfit font-light text-gray-600">Total Comments</p>
                        <p className="text-2xl font-playfair font-light text-gray-900">{commentsPagination.totalComments}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-xl font-playfair font-light text-gray-900 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-outfit font-medium text-gray-900">Order #{order._id.slice(-8)}</p>
                          <p className="text-sm text-gray-600 font-outfit font-light">
                            {order.items.length} items • ${order.totalAmount}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-xl font-playfair font-light text-gray-900 mb-6">Order History</h3>
                
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-outfit font-medium text-gray-900 mb-2">
                              Order #{order._id.slice(-8)}
                            </h4>
                            <p className="text-sm text-gray-600 font-outfit font-light">
                              Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>
                          
                          <div className="mt-4 lg:mt-0 flex flex-col items-start lg:items-end space-y-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status}</span>
                            </span>
                            <p className="text-lg font-playfair font-light text-gray-900">
                              ${order.totalAmount}
                            </p>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-outfit font-medium text-gray-900 mb-2">Items</h5>
                              <div className="space-y-2">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex items-center space-x-3">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={40}
                                      height={40}
                                      className="rounded-md object-cover"
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm font-outfit font-medium text-gray-900">{item.name}</p>
                                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-outfit font-medium text-gray-900">${item.price}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-outfit font-medium text-gray-900 mb-2">Shipping Address</h5>
                              <div className="text-sm text-gray-600 font-outfit font-light space-y-1">
                                                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.buildingNumber} {order.shippingAddress.streetName}</p>
                    <p>Zone {order.shippingAddress.zoneNumber}, {order.shippingAddress.area}</p>
                    <p>{order.shippingAddress.city}</p>
                    {order.shippingAddress.poBox && <p>PO Box: {order.shippingAddress.poBox}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-outfit font-light mb-2">No orders yet</p>
                    <p className="text-sm font-outfit font-light">Start shopping to see your order history here.</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center mt-4 px-6 py-3 bg-gray-900 text-white font-outfit font-light text-sm hover:bg-gray-800 transition-all duration-300 border border-gray-900 hover:border-gray-800 tracking-wider"
                    >
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Ratings Tab */}
            {activeTab === 'ratings' && (
              <div>
                <h3 className="text-xl font-playfair font-light text-gray-900 mb-6">Products You&apos;ve Rated</h3>
                
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
                                {rating.product.averageRating > 0 && (
                                  <div className="mt-2">
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
                      <div className="flex items-center justify-center space-x-3 mt-8">
                        <button
                          onClick={() => loadUserRatings(ratingsPagination.currentPage - 1)}
                          disabled={!ratingsPagination.hasPrevPage}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-outfit font-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          Previous
                        </button>
                        
                        <span className="px-4 py-2 text-sm text-gray-600 font-outfit font-light">
                          Page {ratingsPagination.currentPage} of {ratingsPagination.totalPages}
                        </span>
                        
                        <button
                          onClick={() => loadUserRatings(ratingsPagination.currentPage + 1)}
                          disabled={!ratingsPagination.hasNextPage}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-outfit font-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
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
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div>
                <h3 className="text-xl font-playfair font-light text-gray-900 mb-6">Comments You&apos;ve Made</h3>
                
                {comments.length > 0 ? (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {comment.product.images && comment.product.images[0] ? (
                              <Image
                                src={comment.product.images[0]}
                                alt={comment.product.name}
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
                                  href={`/products/${comment.product.productId}`}
                                  className="text-xl font-playfair font-light text-gray-900 hover:text-gray-700 transition-colors"
                                >
                                  {comment.product.name}
                                </Link>
                                <p className="text-gray-700 mt-3 font-outfit font-light leading-relaxed">{comment.content}</p>
                                {comment.isEdited && (
                                  <span className="text-xs text-gray-400 mt-2 inline-block font-outfit font-light">(edited)</span>
                                )}
                              </div>
                              
                              <div className="text-right text-sm text-gray-500 font-outfit font-light">
                                <div className="flex items-center space-x-2">
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
                      <div className="flex items-center justify-center space-x-3 mt-8">
                        <button
                          onClick={() => loadUserComments(commentsPagination.currentPage - 1)}
                          disabled={!commentsPagination.hasPrevPage}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-outfit font-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          Previous
                        </button>
                        
                        <span className="px-4 py-2 text-sm text-gray-600 font-outfit font-light">
                          Page {commentsPagination.currentPage} of {commentsPagination.totalPages}
                        </span>
                        
                        <button
                          onClick={() => loadUserComments(commentsPagination.currentPage + 1)}
                          disabled={!commentsPagination.hasNextPage}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-outfit font-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-outfit font-light mb-2">No comments yet</p>
                    <p className="text-sm font-outfit font-light">Rate a product first, then share your thoughts!</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center mt-4 px-6 py-3 bg-gray-900 text-white font-outfit font-light text-sm hover:bg-gray-800 transition-all duration-300 border border-gray-900 hover:border-gray-800 tracking-wider"
                    >
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-xl font-playfair font-light text-gray-900 mb-6">Account Settings</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-playfair font-light text-gray-900">Personal Information</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-colors"
                          placeholder="Enter your email"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-colors"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Address Information */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-playfair font-light text-gray-900">Shipping Address</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.address.fullName}
                          onChange={(e) => setProfileForm({
                            ...profileForm, 
                            address: {...profileForm.address, fullName: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-colors"
                          placeholder="Enter full name for delivery"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Mobile Number</label>
                        <input
                          type="tel"
                          value={profileForm.address.mobileNumber}
                          onChange={(e) => setProfileForm({
                            ...profileForm, 
                            address: {...profileForm.address, mobileNumber: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-colors"
                          placeholder="Enter mobile number for delivery"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Building Number</label>
                          <input
                            type="text"
                            value={profileForm.address.buildingNumber}
                            onChange={(e) => setProfileForm({
                              ...profileForm, 
                              address: {...profileForm.address, buildingNumber: e.target.value}
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-colors"
                            placeholder="Building No."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Zone Number</label>
                          <input
                            type="text"
                            value={profileForm.address.zoneNumber}
                            onChange={(e) => setProfileForm({
                              ...profileForm, 
                              address: {...profileForm.address, zoneNumber: e.target.value}
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-colors"
                            placeholder="Zone No."
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Street Name</label>
                        <input
                          type="text"
                          value={profileForm.address.streetName}
                          onChange={(e) => setProfileForm({
                            ...profileForm, 
                            address: {...profileForm.address, streetName: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-colors"
                          placeholder="Enter street name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">Area/Neighborhood</label>
                          <input
                            type="text"
                            value={profileForm.address.area}
                            onChange={(e) => setProfileForm({
                              ...profileForm, 
                              address: {...profileForm.address, area: e.target.value}
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-colors"
                            placeholder="Area/Neighborhood"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            value={profileForm.address.city}
                            onChange={(e) => setProfileForm({
                              ...profileForm, 
                              address: {...profileForm.address, city: e.target.value}
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-colors"
                            placeholder="City (e.g., Doha)"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-outfit font-medium text-gray-700 mb-2">PO Box (Optional)</label>
                        <input
                          type="text"
                          value={profileForm.address.poBox}
                          onChange={(e) => setProfileForm({
                            ...profileForm, 
                            address: {...profileForm.address, poBox: e.target.value}
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-outfit font-light transition-colors"
                          placeholder="PO Box (optional)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      // Handle save logic here
                    }}
                    className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-outfit font-light text-lg hover:bg-gray-800 transition-all duration-300 border border-gray-900 hover:border-gray-800 tracking-widest"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};
