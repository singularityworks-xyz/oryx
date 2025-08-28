import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { mockCartItems } from '@/data/mock-data';
import { auth } from '@/lib/auth';

const FREE_SHIPPING_THRESHOLD = 200;
const SHIPPING_COST = 25;

export default async function CartPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/login');
  }
  const subtotal = mockCartItems.reduce(
    (accumulator, item) => accumulator + item.price * item.quantity,
    0
  );
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="py-4">
            <Link
              className="inline-flex items-center font-light font-outfit text-gray-600 text-sm hover:text-gray-900 sm:text-base"
              href="/"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-10 xl:px-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="mb-4 font-light font-playfair text-2xl text-gray-900 sm:text-3xl md:text-4xl">
            Shopping Cart
          </h1>
          <div className="h-px w-20 bg-gray-300 sm:w-24 md:w-28 lg:w-32" />
        </div>

        {mockCartItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="space-y-4 sm:space-y-6 lg:col-span-2">
              {mockCartItems.map((item) => (
                <div
                  className="relative border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
                  key={item.id}
                >
                  <button
                    className="absolute top-2 right-2 p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-[5rem_1fr] gap-3 sm:flex sm:items-center sm:gap-4">
                    <div className="h-20 w-20 flex-shrink-0 sm:h-24 sm:w-24">
                      <Image
                        alt={item.name}
                        className="h-full w-full object-cover"
                        height={96}
                        src={item.image}
                        width={96}
                      />
                    </div>

                    <div className="min-w-0">
                      <Link className="block" href={`/products/${item.id}`}>
                        <h3 className="font-light font-outfit text-gray-900 text-sm transition-colors hover:text-gray-700 sm:text-base">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="mt-1 font-light font-outfit text-gray-500 text-xs sm:text-sm">
                        QAR {item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="col-span-2 mt-1 flex items-center justify-between sm:col-span-1 sm:mt-0 sm:ml-auto">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-300 bg-gray-50">
                          <button
                            className="p-2 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:opacity-50"
                            disabled
                            type="button"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-[2rem] px-3 py-2 text-center font-light font-outfit text-gray-900 text-sm">
                            {item.quantity}
                          </span>
                          <button
                            className="p-2 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:opacity-50"
                            disabled
                            type="button"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-light font-outfit text-gray-900 text-sm sm:text-base">
                          QAR {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
                <h2 className="mb-6 font-light font-playfair text-gray-900 text-lg sm:text-xl">
                  Order Summary
                </h2>

                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between font-light font-outfit text-sm">
                    <span className="text-gray-600">
                      Subtotal ({mockCartItems.length} items)
                    </span>
                    <span className="text-gray-900">
                      QAR {subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-light font-outfit text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span
                      className={
                        shipping === 0 ? 'text-green-600' : 'text-gray-900'
                      }
                    >
                      {shipping === 0 ? 'FREE' : `QAR ${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <p className="font-light font-outfit text-gray-500 text-xs">
                      Add QAR {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}{' '}
                      more for free shipping
                    </p>
                  )}

                  <div className="border-gray-200 border-t pt-4">
                    <div className="flex items-center justify-between font-light font-outfit text-base sm:text-lg">
                      <span className="text-gray-900">Total</span>
                      <span className="font-medium text-gray-900">
                        QAR {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className="mb-4 w-full cursor-not-allowed bg-gray-400 px-6 py-4 font-light font-outfit text-base text-white sm:text-lg"
                  disabled
                  type="button"
                >
                  Proceed to Checkout
                </button>

                <p className="text-center font-light font-outfit text-gray-500 text-xs">
                  Checkout functionality will be available in future updates
                </p>

                <div className="mt-6 border-gray-200 border-t pt-4">
                  <Link
                    className="inline-flex items-center font-light font-outfit text-gray-600 text-sm hover:text-gray-900"
                    href="/products"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center sm:py-16">
            <div className="mb-6">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 sm:h-20 sm:w-20" />
            </div>
            <h2 className="mb-4 font-light font-playfair text-gray-900 text-xl sm:text-2xl">
              Your cart is empty
            </h2>
            <p className="mx-auto mb-8 max-w-md font-light font-outfit text-gray-600 text-sm sm:text-base">
              Looks like you haven&apos;t added anything to your cart yet. Start
              exploring our collection of premium kitchen essentials.
            </p>
            <Link
              className="inline-flex items-center bg-gray-900 px-8 py-4 font-light font-outfit text-base text-white transition-colors duration-300 hover:bg-gray-800"
              href="/products"
            >
              Start Shopping
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
