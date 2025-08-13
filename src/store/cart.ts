import { create } from 'zustand';
import { cartService } from '@/services/cartService';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sku?: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  total: number;
  itemCount: number;
  
  // Database operations
  loadCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Local state updates
  setItems: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTotal: (total: number) => void;
  setItemCount: (count: number) => void;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  total: 0,
  itemCount: 0,
  
  loadCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await cartService.getCart();
      
      if (response.success) {
        set({
          items: response.items || [],
          total: response.total || 0,
          itemCount: response.itemCount || 0,
        });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load cart' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addItem: async (item) => {
    try {
      set({ isLoading: true, error: null });
      
      // Find the product ID from the existing items or use the item.id
      const productId = item.id;
      const response = await cartService.addToCart(productId, 1);
      
      if (response.success && response.cart) {
        set({
          items: response.cart.items,
          total: response.cart.total,
          itemCount: response.cart.itemCount,
        });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add item to cart' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  removeItem: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await cartService.removeFromCart(id);
      
      if (response.success && response.cart) {
        set({
          items: response.cart.items,
          total: response.cart.total,
          itemCount: response.cart.itemCount,
        });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to remove item from cart' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateQuantity: async (id, quantity) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await cartService.updateCartItem(id, quantity);
      
      if (response.success && response.cart) {
        set({
          items: response.cart.items,
          total: response.cart.total,
          itemCount: response.cart.itemCount,
        });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update cart item' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  clearCart: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await cartService.clearCart();
      
      if (response.success && response.cart) {
        set({
          items: response.cart.items,
          total: response.cart.total,
          itemCount: response.cart.itemCount,
        });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to clear cart' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  setItems: (items) => set({ items }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setTotal: (total) => set({ total }),
  setItemCount: (itemCount) => set({ itemCount }),
})); 