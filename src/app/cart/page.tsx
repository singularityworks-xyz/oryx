'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthenticatedCart } from '@/hooks/useAuthenticatedCart';
import { CartSyncStatus } from '@/components/CartSyncStatus';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, removeItem, updateQuantity, total, itemCount, clearCart, isAuthenticated, isLoading } = useAuthenticatedCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (items.length === 0) {
      return;
    }

    setIsCheckingOut(true);

    try {
      // For now, we'll just redirect to a checkout page
      // In a real implementation, you would create a checkout session
      router.push('/checkout');
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
          <h2 className="mt-6 text-xl font-light text-gray-600">Loading your cart...</h2>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="w-20 h-px bg-gray-300 mx-auto mb-6"></div>
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
            <div className="w-20 h-px bg-gray-300 mx-auto mt-6"></div>
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">Sign in to view your cart</h2>
          <p className="text-gray-600 font-light leading-relaxed mb-8">
            You need to be signed in to access your shopping cart and continue your journey with us.
          </p>
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center w-full px-8 py-4 bg-gray-900 text-white font-light text-sm tracking-widest hover:bg-gray-800 transition-all duration-300 border border-gray-900 hover:border-gray-800 hover:scale-[1.02] transform"
            >
              Sign In
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center w-full px-8 py-4 border border-gray-300 text-gray-700 font-light text-sm tracking-widest bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] transform"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
              <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="w-20 h-px bg-gray-300 mx-auto mb-6"></div>
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
            <div className="w-20 h-px bg-gray-300 mx-auto mt-6"></div>
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 font-light leading-relaxed mb-8">
            Start shopping to add items to your cart and discover our curated collection.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-light text-sm tracking-widest hover:bg-gray-800 transition-all duration-300 border border-gray-900 hover:border-gray-800 hover:scale-[1.02] transform"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header Section */}
        <div className="mb-12 lg:mb-16">
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200 font-light"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <Sparkles className="w-6 h-6 text-gray-400 mr-3" />
                <h1 className="text-4xl lg:text-5xl font-light text-gray-900">Shopping Cart</h1>
              </div>
              <p className="text-lg text-gray-600 font-light">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            {/* Sync Status */}
            <CartSyncStatus />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-xl font-light text-gray-900">Cart Items</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="px-8 py-6 flex items-center space-x-6 hover:bg-gray-50/50 transition-colors duration-200">
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-xl object-cover shadow-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-lg font-light text-gray-600">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 border border-gray-200 hover:border-gray-300"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-lg font-medium text-gray-900 w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 border border-gray-200 hover:border-gray-300"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors duration-200 border border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-xl font-light text-gray-900">Order Summary</h2>
              </div>
              <div className="px-8 py-6 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-light">Subtotal</span>
                  <span className="font-medium text-lg">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-light">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-light">Tax</span>
                  <span className="font-medium text-lg">${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-light text-gray-900">Total</span>
                    <span className="text-2xl font-light text-gray-900">${(total * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-light text-sm tracking-widest hover:scale-[1.02] transform border border-gray-900 hover:border-gray-800"
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={clearCart}
                className="w-full text-gray-600 py-4 px-6 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-light text-sm tracking-widest hover:scale-[1.02] transform"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 