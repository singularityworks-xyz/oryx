import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';

export const useAuthenticatedCart = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const cartStore = useCartStore();

  const isAuthenticated = status === 'authenticated' && !!(session?.user as { id: string })?.id;
  const isLoading = status === 'loading' || cartStore.isLoading;

  // Wrapper functions that check authentication and use database operations
  const addItem = async (item: Parameters<typeof cartStore.addItem>[0]) => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }
    await cartStore.addItem(item);
  };

  const removeItem = async (id: string) => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }
    await cartStore.removeItem(id);
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }
    await cartStore.updateQuantity(id, quantity);
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }
    await cartStore.clearCart();
  };

  const loadCart = async () => {
    if (!isAuthenticated) {
      return;
    }
    await cartStore.loadCart();
  };

  return {
    // Authentication state
    isAuthenticated,
    isLoading,
    session,
    
    // Cart data (only accessible when authenticated)
    items: isAuthenticated ? cartStore.items : [],
    total: isAuthenticated ? cartStore.total : 0,
    itemCount: isAuthenticated ? cartStore.itemCount : 0,
    error: cartStore.error,
    
    // Cart operations (with auth checks)
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadCart,
  };
};
