'use client';

import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Signup attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-light font-playfair text-gray-900 tracking-wide sm:text-3xl">
              JOIN ORYX
            </h1>
            <div className="mx-auto h-px w-16 bg-gray-300 mt-4" />
            <p className="mt-4 font-light font-outfit text-gray-600 text-sm">
              Create your account to start your culinary journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block font-light font-outfit text-gray-700 text-sm mb-2">
                  First Name
                </label>
                <div className="relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-200 bg-white px-4 py-3 pl-12 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                    placeholder="First name"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block font-light font-outfit text-gray-700 text-sm mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-white px-4 py-3 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                  placeholder="Last name"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
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
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-white px-4 py-3 pl-12 pr-12 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                  placeholder="Create a password"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block font-light font-outfit text-gray-700 text-sm mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-white px-4 py-3 pl-12 pr-12 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-0"
              />
              <label htmlFor="terms" className="ml-2 font-light font-outfit text-gray-700 text-sm">
                I agree to the{' '}
                <Link href="/terms" className="text-gray-900 hover:text-gray-700 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-gray-900 hover:text-gray-700 underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full border border-gray-900 bg-gray-900 px-8 py-4 font-light font-outfit text-base text-white transition-colors duration-300 hover:border-gray-800 hover:bg-gray-800"
            >
              Create Account
            </button>
          </form>

          <div className="text-center">
            <p className="font-light font-outfit text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
              >
                Sign in here
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
              alt="Premium kitchen collection"
              className="w-full h-auto rounded-lg shadow-2xl"
              height={500}
              src="/golden-sear-scallops.png"
              width={500}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-lg" />
          </div>

          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="font-light font-outfit text-gray-900 text-sm">
                Exclusive Collection
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
