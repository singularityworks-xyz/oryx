'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cart';
import { Session } from 'next-auth';

interface CartContextType {
  loadCart: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const { loadCart, isLoading, error } = useCartStore();

  // Load cart data when user is authenticated
  useEffect(() => {
    if (status === 'authenticated' && (session?.user as { id: string })?.id) {
      loadCart();
    }
  }, [status, (session?.user as { id: string })?.id, loadCart]);

  // Only provide cart context when authenticated
  if (status !== 'authenticated' || !(session?.user as { id: string })?.id) {
    return <>{children}</>;
  }

  return (
    <CartContext.Provider value={{ loadCart, isLoading, error }}>
      {children}
    </CartContext.Provider>
  );
};
