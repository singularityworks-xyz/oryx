import { CartItem } from '@/store/cart';

export interface CartApiResponse {
  success: boolean;
  message?: string;
  items?: CartItem[];
  total?: number;
  itemCount?: number;
  lastSynced?: string;
  cart?: {
    items: CartItem[];
    total: number;
    itemCount: number;
    lastSynced?: string;
  };
  error?: string;
}

class CartService {
  private baseUrl = '/api/cart';

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async getCart(): Promise<CartApiResponse> {
    return this.makeRequest<CartApiResponse>('');
  }

  async addToCart(productId: string, quantity: number = 1): Promise<CartApiResponse> {
    return this.makeRequest<CartApiResponse>('', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId: string, quantity: number): Promise<CartApiResponse> {
    return this.makeRequest<CartApiResponse>('', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: string): Promise<CartApiResponse> {
    return this.makeRequest<CartApiResponse>(`?productId=${encodeURIComponent(productId)}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<CartApiResponse> {
    return this.makeRequest<CartApiResponse>('/clear', {
      method: 'DELETE',
    });
  }
}

export const cartService = new CartService();
export default cartService;
