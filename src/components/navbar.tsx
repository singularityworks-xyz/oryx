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
        <div className="hidden h-16 items-center justify-between md:flex">
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

          <div className="items-center space-x-8 md:flex">
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
              href="/products"
            >
              <Search className="h-5 w-5" />
            </Link>
          </div>

          <div className="items-center space-x-4 md:flex">
            <UserButton />
            {session && (
              <Link
                className="relative flex items-center p-2 font-light text-5 text-gray-700 hover:text-gray-900"
                href="/cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center bg-red-500 text-white text-xs">
                  3
                </span>
              </Link>
            )}
          </div>
        </div>

        <div className="flex h-16 items-center justify-between md:hidden">
          <button
            className="p-2 text-gray-700 transition-colors hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
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

          <Link className="flex flex-shrink-0 items-center" href="/">
            <Image
              alt="Oryx Logo"
              className="h-6 w-auto"
              height={32}
              src="/oryx-logo.svg"
              width={96}
            />
          </Link>

          <div className="flex items-center">
            <UserButton />
          </div>
        </div>

        <div className="border-gray-200 border-t bg-white px-0 py-3 md:hidden">
          <Link
            className="flex w-full items-center space-x-3 border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100"
            href="/products"
          >
            <Search className="h-5 w-5 flex-shrink-0" />
            <span className="font-light font-outfit text-sm">
              Search products...
            </span>
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="border-gray-200 border-t bg-white px-4 py-4 shadow-lg">
            <div className="space-y-2">
              <Link
                className="block px-4 py-3 font-light font-outfit text-base text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                href="/products"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                className="block px-4 py-3 font-light font-outfit text-base text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                className="block px-4 py-3 font-light font-outfit text-base text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                href="/about"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              {session && (
                <Link
                  className="flex items-center px-4 py-3 font-light font-outfit text-base text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  href="/cart"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="mr-3 h-5 w-5" />
                  Cart
                  <span className="ml-3 flex h-5 w-5 items-center justify-center bg-red-500 text-white text-xs">
                    3
                  </span>
                </Link>
              )}

              {session && (
                <Link
                  className="flex items-center px-4 py-3 font-light font-outfit text-base text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              )}

              {!session && (
                <div className="mt-4 border-gray-200 border-t pt-4">
                  <div className="mt-2 flex items-center space-x-3 px-4">
                    <Link
                      className="flex-1 border border-gray-300 bg-white px-4 py-3 text-center font-light font-outfit text-gray-700 text-sm transition-colors hover:border-gray-400 hover:text-gray-900"
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      className="flex-1 border border-gray-900 bg-gray-900 px-4 py-3 text-center font-light font-outfit text-sm text-white transition-colors hover:border-gray-800 hover:bg-gray-800"
                      href="/auth/signup"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
