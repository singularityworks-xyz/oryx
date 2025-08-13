'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

import Link from 'next/link';
import { Lock } from 'lucide-react';

interface ProtectedCartRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedCartRoute: React.FC<ProtectedCartRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { data: session, status } = useSession();


  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-4 text-lg font-medium text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (status !== 'authenticated' || !(session?.user as { id: string })?.id) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">Authentication Required</h2>
          <p className="mt-2 text-sm text-gray-500">
            You need to be signed in to access this page.
          </p>
          <div className="mt-6 space-x-4">
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};
