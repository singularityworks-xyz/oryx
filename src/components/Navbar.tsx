'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store/cart';
import { ShoppingCart, User, Search, Settings, LogOut, Heart, Package, Shield } from 'lucide-react';
import { Session } from 'next-auth';

export default function Navbar() {
  const { data: session } = useSession();
  const { getItemCount } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const itemCount = getItemCount();

  // Type assertion for session
  const typedSession = session as Session | null;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg font-outfit sticky top-0 z-50">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/oryx-logo.svg"
                alt="Oryx Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Middle Section - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-5 font-medium"
            >
              shop
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-5 font-medium"
            >
              contact
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-5 font-medium"
            >
              about
            </Link>
            <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-5 font-medium">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Right Section - Profile and Cart */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="text-gray-700 hover:text-gray-900 p-2 rounded-md text-5 font-medium flex items-center relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {typedSession ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="text-gray-700 hover:text-gray-900 p-2 rounded-md text-5 font-medium flex items-center"
                >
                  <User className="w-5 h-5" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    {/* User Info */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{typedSession.user?.name}</p>
                      <p className="text-xs text-gray-500">{typedSession.user?.email}</p>
                    </div>

                    {/* Profile Options */}
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>

                    <Link
                      href="/orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Package className="w-4 h-4 mr-3" />
                      Your Orders
                    </Link>

                    <Link
                      href="/favorites"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Heart className="w-4 h-4 mr-3" />
                      Favorites
                    </Link>

                    {/* Admin Dashboard - Only show for admin users */}
                    {typedSession?.user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Shield className="w-4 h-4 mr-3" />
                        Admin Dashboard
                      </Link>
                    )}

                    {/* Settings */}
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-gray-900 p-2 rounded-md text-5 font-medium flex items-center"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-gray-900 p-2"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <button className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
            
            {typedSession ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Your Orders
                </Link>
                <Link
                  href="/favorites"
                  className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favorites
                </Link>
                {typedSession.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-blue-600 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/settings"
                  className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-red-600 hover:text-red-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}

            <Link
              href="/cart"
              className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
              {itemCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 