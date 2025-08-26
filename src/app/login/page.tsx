'use client';

import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-1 items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="font-light font-playfair text-2xl text-gray-900 tracking-wide sm:text-3xl">
              WELCOME BACK
            </h1>
            <div className="mx-auto mt-4 h-px w-16 bg-gray-300" />
            <p className="mt-4 font-light font-outfit text-gray-600 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-2 block font-light font-outfit text-gray-700 text-sm"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  className="w-full border border-gray-200 bg-white px-4 py-3 pl-12 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  type="email"
                  value={email}
                />
                <Mail className="-translate-y-1/2 absolute top-1/2 left-4 h-4 w-4 transform text-gray-400" />
              </div>
            </div>

            <div>
              <label
                className="mb-2 block font-light font-outfit text-gray-700 text-sm"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full border border-gray-200 bg-white px-4 py-3 pr-12 pl-12 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                  id="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <Lock className="-translate-y-1/2 absolute top-1/2 left-4 h-4 w-4 transform text-gray-400" />
                <button
                  className="-translate-y-1/2 absolute top-1/2 right-4 transform text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
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
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-0"
                  type="checkbox"
                />
                <span className="ml-2 font-light font-outfit text-gray-700 text-sm">
                  Remember me
                </span>
              </label>
              <Link
                className="font-light font-outfit text-gray-600 text-sm transition-colors hover:text-gray-900"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>

            <button
              className="w-full border border-gray-900 bg-gray-900 px-8 py-4 font-light font-outfit text-base text-white transition-colors duration-300 hover:border-gray-800 hover:bg-gray-800"
              type="submit"
            >
              Sign In
            </button>
          </form>

          <div className="text-center">
            <p className="font-light font-outfit text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link
                className="font-medium text-gray-900 transition-colors hover:text-gray-700"
                href="/signup"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden flex-1 items-center justify-center bg-gray-50 p-12 lg:flex">
        <div className="relative max-w-lg">
          <div className="relative">
            <Image
              alt="Elegant dinnerware collection"
              className="h-auto w-full rounded-lg shadow-2xl"
              height={500}
              src="/crimson-scallop-jewels.png"
              width={500}
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          <div className="-bottom-6 -left-6 absolute rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
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
