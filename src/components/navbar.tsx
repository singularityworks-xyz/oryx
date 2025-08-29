'use client';

import { Search, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import DesktopSearch from '@/components/search/desktop-search';
import MobileSearch from '@/components/search/mobile-search';
import { mockCartItems } from '@/data/mock-data';
import { useSession } from '@/lib/auth-client';
import UserButton from './user-button';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const cartCount = mockCartItems.reduce(
    (accumulator, item) => accumulator + item.quantity,
    0
  );

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!isSearchOpen) {
        return;
      }
      const target = e.target as Node;
      if (
        mobileSearchRef.current?.contains(target) ||
        desktopSearchRef.current?.contains(target)
      ) {
        return;
      }
      setIsSearchOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [isSearchOpen]);

  const openMobileSearch = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(true);
  };

  return (
    <>
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
              <button
                aria-label="Open search"
                className="px-3 py-2 text-gray-700 transition-colors hover:text-gray-900"
                onClick={() => setIsSearchOpen(true)}
                type="button"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            <div className="items-center space-x-4 md:flex">
              <UserButton />
              {session && (
                <Link
                  className="relative flex items-center p-2 font-light text-5 text-gray-700 hover:text-gray-900"
                  href="/cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="-top-1 -right-1 absolute flex h-4 min-w-[0.9rem] items-center justify-center rounded-full bg-gray-900 px-1 font-medium text-[10px] text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>

          <div className="flex h-16 items-center justify-between md:hidden">
            <div className="flex items-center">
              <button
                className="p-2 text-gray-700 outline-none transition-colors hover:text-gray-900 focus:outline-none"
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
              {isMenuOpen && (
                <button
                  aria-label="Open search"
                  className="ml-2 p-2 text-gray-700 transition-colors hover:text-gray-900"
                  onClick={openMobileSearch}
                  type="button"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            <Link className="flex flex-shrink-0 items-center" href="/">
              <Image
                alt="Oryx Logo"
                className="h-6 w-auto"
                height={32}
                src="/oryx-logo.svg"
                width={96}
              />
            </Link>

            <div className="flex items-center space-x-3">
              {session && (
                <Link
                  aria-label="Cart"
                  className="relative p-2 text-gray-700 transition-colors hover:text-gray-900"
                  href="/cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="-top-1 -right-1 absolute flex h-4 min-w-[0.9rem] items-center justify-center rounded-full bg-gray-900 px-[0.2rem] font-medium text-[10px] text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
              <UserButton />
            </div>
          </div>
        </div>

        {!(isMenuOpen || isSearchOpen) && (
          <div className="border-gray-200 border-t bg-white px-4 py-3 md:hidden">
            <button
              className="flex w-full items-center space-x-3 border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100"
              onClick={() => setIsSearchOpen(true)}
              type="button"
            >
              <Search className="h-5 w-5 flex-shrink-0" />
              <span className="font-light font-outfit text-sm">
                Search products...
              </span>
            </button>
          </div>
        )}
      </nav>

      <div ref={desktopSearchRef}>
        <DesktopSearch
          onClose={() => setIsSearchOpen(false)}
          open={isSearchOpen}
        />
      </div>

      {isSearchOpen && (
        <div className="md:hidden" ref={mobileSearchRef}>
          <MobileSearch autoFocus onClose={() => setIsSearchOpen(false)} />
        </div>
      )}

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
    </>
  );
}
