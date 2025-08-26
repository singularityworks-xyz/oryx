'use client';

import { Search, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import UserButton from './user-button';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-white font-light font-outfit shadow-lg">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link className="flex flex-shrink-0 items-center" href="/">
              <Image
                alt="Oryx Logo"
                className="h-8 w-auto"
                height={40}
                src="/oryx-logo.svg"
                width={120}
              />
            </Link>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <Link
              className="px-3 py-2 font-light text-5 text-gray-700 hover:text-gray-900"
              href="/products"
            >
              shop
            </Link>
            <Link
              className="px-3 py-2 font-light text-5 text-gray-700 hover:text-gray-900"
              href="/contact"
            >
              contact
            </Link>
            <Link
              className="px-3 py-2 font-light text-5 text-gray-700 hover:text-gray-900"
              href="/about"
            >
              about
            </Link>
            <Link
              className="px-3 py-2 font-light text-5 text-gray-700 hover:text-gray-900"
              href="/search"
            >
              <Search className="h-5 w-5" />
            </Link>
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            <UserButton />
            {session && (
              <Link
                className="relative flex items-center p-2 font-light text-5 text-gray-700 hover:text-gray-900"
                href="/cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                  3
                </span>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              className="p-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Close menu</title>
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Open menu</title>
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-t bg-white px-2 pt-2 pb-3 sm:px-3">
            <Link
              className="block px-3 py-2 font-light text-base text-gray-700 hover:text-gray-900"
              href="/products"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              className="block px-3 py-2 font-light text-base text-gray-700 hover:text-gray-900"
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              className="block px-3 py-2 font-light text-base text-gray-700 hover:text-gray-900"
              href="/about"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              className="block w-full items-center px-3 py-2 text-left font-light text-base text-gray-700 hover:text-gray-900"
              href="/search"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className="mr-2 h-5 w-5" />
              Search
            </Link>

            {session && (
              <Link
                className="block items-center px-3 py-2 font-light text-base text-gray-700 hover:text-gray-900"
                href="/cart"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Cart
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                  3
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
