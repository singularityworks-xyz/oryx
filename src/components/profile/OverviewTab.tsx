import React from 'react';
import { ShoppingBag, Star, MessageCircle, Package, Settings } from 'lucide-react';
import Link from 'next/link';

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

interface OverviewTabProps {
  orders: Order[];
  totalRatings: number;
  totalComments: number;
  onTabChange: (tab: string) => void;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
}

export default function OverviewTab({
  orders,
  totalRatings,
  totalComments,
  onTabChange,
  formatDate,
  getStatusColor
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-playfair font-light text-gray-900">{orders.length}</p>
              <p className="text-sm font-outfit font-light text-gray-600">Total Orders</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-playfair font-light text-gray-900">{totalRatings}</p>
              <p className="text-sm font-outfit font-light text-gray-600">Products Rated</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-playfair font-light text-gray-900">{totalComments}</p>
              <p className="text-sm font-outfit font-light text-gray-600">Comments Made</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-playfair font-light text-gray-900">Recent Orders</h3>
        </div>
        <div className="p-6">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-outfit font-medium text-gray-900">Order #{order._id.slice(-8)}</p>
                      <p className="text-sm text-gray-600 font-outfit font-light">
                        {order.items.length} items • {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-playfair font-light text-gray-900">${order.totalAmount}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length > 3 && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => onTabChange('orders')}
                    className="text-gray-600 hover:text-gray-900 font-outfit font-light text-sm hover:underline"
                  >
                    View all {orders.length} orders →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-outfit font-light mb-2">No orders yet</p>
              <p className="text-sm font-outfit font-light mb-4">Start shopping to see your order history here.</p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-outfit font-light text-sm hover:bg-gray-800 transition-all duration-300 border border-gray-900 hover:border-gray-800 tracking-wider"
              >
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-playfair font-light text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/products"
            className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <span className="font-outfit font-light text-gray-700">Continue Shopping</span>
          </Link>
          <button
            onClick={() => onTabChange('settings')}
            className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
          >
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="font-outfit font-light text-gray-700">Update Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
