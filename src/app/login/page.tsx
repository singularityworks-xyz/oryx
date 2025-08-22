'use client';

import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-light font-playfair text-gray-900 tracking-wide sm:text-3xl">
              WELCOME BACK
            </h1>
            <div className="mx-auto h-px w-16 bg-gray-300 mt-4" />
            <p className="mt-4 font-light font-outfit text-gray-600 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block font-light font-outfit text-gray-700 text-sm mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 bg-white px-4 py-3 pl-12 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block font-light font-outfit text-gray-700 text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 bg-white px-4 py-3 pl-12 pr-12 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-0"
                />
                <span className="ml-2 font-light font-outfit text-gray-700 text-sm">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="font-light font-outfit text-gray-600 text-sm hover:text-gray-900 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full border border-gray-900 bg-gray-900 px-8 py-4 font-light font-outfit text-base text-white transition-colors duration-300 hover:border-gray-800 hover:bg-gray-800"
            >
              Sign In
            </button>
          </form>

          <div className="text-center">
            <p className="font-light font-outfit text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 bg-gray-50 items-center justify-center p-12">
        <div className="relative max-w-lg">
          <div className="relative">
            <Image
              alt="Elegant dinnerware collection"
              className="w-full h-auto rounded-lg shadow-2xl"
              height={500}
              src="/crimson-scallop-jewels.png"
              width={500}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-lg" />
          </div>

          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-light font-outfit text-gray-900 text-sm">
                Premium Collection
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
