import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cart';

export const useCartSync = () => {
  const { data: session, status } = useSession();
  const { loadCart, items } = useCartStore();

  const syncCart = useCallback(async () => {
    if (!(session?.user as { id: string })?.id) {
      return;
    }

    try {
      await loadCart();
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  }, [(session?.user as { id: string })?.id, loadCart]);

  return {
    syncCart,
    isAuthenticated: status === 'authenticated',
    hasItems: items.length > 0,
  };
};
