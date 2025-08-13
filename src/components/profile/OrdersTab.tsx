import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';
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

interface OrdersTabProps {
  orders: Order[];
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
}

export default function OrdersTab({
  orders,
  formatDate,
  getStatusColor
}: OrdersTabProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-playfair font-light text-gray-900">Order History</h3>
      </div>
      
      <div className="p-6">
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-outfit font-medium text-gray-900 mb-2">
                      Order #{order._id.slice(-8)}
                    </h4>
                    <p className="text-sm text-gray-600 font-outfit font-light">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 flex flex-col items-start lg:items-end space-y-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-lg font-playfair font-light text-gray-900">
                      ${order.totalAmount}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-outfit font-medium text-gray-900 mb-2">Items</h5>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-outfit font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-outfit font-medium text-gray-900">${item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-outfit font-light mb-2">No orders yet</p>
            <p className="text-sm font-outfit font-light">Start shopping to see your order history here.</p>
            <Link
              href="/products"
              className="inline-flex items-center mt-4 px-6 py-3 bg-gray-900 text-white font-outfit font-light text-sm hover:bg-gray-800 transition-all duration-300 border border-gray-900 hover:border-gray-800 tracking-wider"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
