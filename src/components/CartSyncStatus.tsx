import React from 'react';
import { useCartSync } from '@/hooks/useCartSync';
import { RefreshCw, Clock } from 'lucide-react';

interface CartSyncStatusProps {
  showSyncButton?: boolean;
  className?: string;
}

export const CartSyncStatus: React.FC<CartSyncStatusProps> = ({
  showSyncButton = true,
  className = '',
}) => {
  const {
    syncCart,
    isAuthenticated,
  } = useCartSync();

  if (!isAuthenticated) {
    return (
      <div className="text-sm text-gray-500">
        <span>Sign in to sync cart</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showSyncButton && (
        <button
          onClick={syncCart}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          title="Sync cart with server"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync
        </button>
      )}
      
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="flex items-center space-x-1 text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Manual sync</span>
        </div>
      </div>
    </div>
  );
};
