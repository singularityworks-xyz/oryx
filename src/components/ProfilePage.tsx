'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Star, User, Settings, ShoppingBag, MessageCircle, AlertCircle, XCircle } from 'lucide-react';
import { useRatingsAndComments } from '@/hooks/useRatingsAndComments';
import Link from 'next/link';

// Import organized components
import {
  ProfileHeader,
  ProfileSidebar,
  OverviewTab,
  OrdersTab,
  RatingsTab,
  CommentsTab,
  SettingsTab
} from './profile';

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
  status: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const {
    loading,
    error,
    clearError,
    getUserRatings,
    getUserComments,
  } = useRatingsAndComments();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'ratings' | 'comments' | 'settings'>(() => {
    // Try to get the saved tab from localStorage, default to 'overview'
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('profileActiveTab');
      if (savedTab && ['overview', 'orders', 'ratings', 'comments', 'settings'].includes(savedTab)) {
        console.log('Restored tab from localStorage:', savedTab);
        return savedTab as 'overview' | 'orders' | 'ratings' | 'comments' | 'settings';
      }
    }
    console.log('Using default tab: overview');
    return 'overview';
  });
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

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Wrapper function to handle tab changes with proper typing
  const handleTabChange = useCallback((tab: string) => {
    const newTab = tab as 'overview' | 'orders' | 'ratings' | 'comments' | 'settings';
    setActiveTab(newTab);
    
    // Save the active tab to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('profileActiveTab', newTab);
      console.log('Tab saved to localStorage:', newTab);
    }
  }, []);

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

  const loadUserProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setProfileForm({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            address: {
              fullName: data.user.address?.fullName || '',
              mobileNumber: data.user.address?.mobileNumber || '',
              buildingNumber: data.user.address?.buildingNumber || '',
              streetName: data.user.address?.streetName || '',
              zoneNumber: data.user.address?.zoneNumber || '',
              area: data.user.address?.area || '',
              city: data.user.address?.city || '',
              poBox: data.user.address?.poBox || ''
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }, []);

  const saveProfile = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileForm.name,
          phone: profileForm.phone,
          address: profileForm.address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setSaveMessage(data.message || 'Profile updated successfully!');
          
          // Reload profile to get updated data
          loadUserProfile();
          
          // Update the session with the new name so it reflects in the sidebar
          if (data.user?.name && data.user.name !== session?.user?.name) {
            try {
              console.log('Updating session with new name:', data.user.name);
              
              // Try to update the session
              const result = await update({
                ...session,
                user: {
                  ...session?.user,
                  name: data.user.name
                }
              });
              
              console.log('Session update result:', result);
              
              // Check if the session was actually updated
              if (result && result.user?.name === data.user.name) {
                console.log('Session updated successfully');
              } else {
                console.log('Session update failed or incomplete, refreshing page in 1 second...');
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }
            } catch (error) {
              console.error('Failed to update session:', error);
              // Session update failed, but profile update was successful
              // Refresh the page to show updated data
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          }
        }
      } else {
        if (data.details && Array.isArray(data.details)) {
          setSaveMessage(`Validation errors: ${data.details.join(', ')}`);
        } else {
          setSaveMessage(`Error: ${data.error || 'Failed to update profile'}`);
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage('Error: Failed to save profile');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  useEffect(() => {
    if (session?.user) {
      loadUserRatings();
      loadUserComments();
      loadUserOrders();
      loadUserProfile();
    }
  }, [session, loadUserRatings, loadUserComments, loadUserOrders, loadUserProfile]);



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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleProfileFormChange = (field: string, value: string | { [key: string]: string }) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
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

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: User, count: null },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
    { id: 'ratings', label: 'Ratings', icon: Star, count: ratingsPagination.totalRatings },
    { id: 'comments', label: 'Comments', icon: MessageCircle, count: commentsPagination.totalComments },
    { id: 'settings', label: 'Settings', icon: Settings, count: null },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            orders={orders}
            totalRatings={ratingsPagination.totalRatings}
            totalComments={commentsPagination.totalComments}
            onTabChange={handleTabChange}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
          />
        );
      case 'orders':
        return (
          <OrdersTab
            orders={orders}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
          />
        );
      case 'ratings':
        return (
          <RatingsTab
            ratings={ratings}
            pagination={ratingsPagination}
            onPageChange={loadUserRatings}
            formatDate={formatDate}
            renderStars={renderStars}
          />
        );
      case 'comments':
        return (
          <CommentsTab
            comments={comments}
            pagination={commentsPagination}
            onPageChange={loadUserComments}
            formatDate={formatDate}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            profileForm={profileForm}
            onProfileFormChange={handleProfileFormChange}
            onSave={saveProfile}
            isSaving={isSaving}
            saveMessage={saveMessage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <ProfileHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600 font-outfit font-light">Loading your profile...</p>
          </div>
        )}

        {!loading && (
          <>
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

            <div className="flex flex-col lg:flex-row gap-8">
                             <ProfileSidebar
                 key={session.user?.name} // Force re-render when name changes
                 user={{
                   name: session.user?.name || undefined,
                   email: session.user?.email || undefined,
                   image: session.user?.image || undefined
                 }}
                 navigationItems={navigationItems}
                 activeTab={activeTab}
                 onTabChange={handleTabChange}
                 onSignOut={() => signOut()}
               />

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {renderActiveTab()}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
