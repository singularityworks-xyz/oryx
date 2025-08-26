'use client';

import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { signUp } from '@/lib/auth-client';

const MIN_PASSWORD_LENGTH = 6;
const REDIRECT_DELAY = 2000;

export default function SignupPage() {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getButtonText = () => {
    if (isLoading) {
      return 'Creating Account...';
    }
    if (success) {
      return 'Account Created!';
    }
    return 'Create Account';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
      );
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      });

      if (result.error) {
        setError(result.error.message ?? 'Sign up failed');
      } else {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, REDIRECT_DELAY);
      }
    } catch (_err) {
      setError('An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-1 items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="font-light font-playfair text-2xl text-gray-900 tracking-wide sm:text-3xl">
              JOIN ORYX
            </h1>
            <div className="mx-auto mt-4 h-px w-16 bg-gray-300" />
            <p className="mt-4 font-light font-outfit text-gray-600 text-sm">
              Create your account to start your culinary journey
            </p>
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-600">
                <p className="font-light font-outfit text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-600">
                <p className="font-light font-outfit text-sm">
                  Account created successfully! Redirecting to login...
                </p>
              </div>
            )}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="mb-2 block font-light font-outfit text-gray-700 text-sm"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <div className="relative">
                  <input
                    className="w-full border border-gray-200 bg-white px-4 py-3 pl-12 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                    id="firstName"
                    name="firstName"
                    onChange={handleChange}
                    placeholder="First name"
                    required
                    type="text"
                    value={formData.firstName}
                  />
                  <User className="-translate-y-1/2 absolute top-1/2 left-4 h-4 w-4 transform text-gray-400" />
                </div>
              </div>
              <div>
                <label
                  className="mb-2 block font-light font-outfit text-gray-700 text-sm"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  className="w-full border border-gray-200 bg-white px-4 py-3 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                  id="lastName"
                  name="lastName"
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                  type="text"
                  value={formData.lastName}
                />
              </div>
            </div>

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
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  type="email"
                  value={formData.email}
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
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  type="password"
                  value={formData.password}
                />
                <Lock className="-translate-y-1/2 absolute top-1/2 left-4 h-4 w-4 transform text-gray-400" />
              </div>
            </div>

            <div>
              <label
                className="mb-2 block font-light font-outfit text-gray-700 text-sm"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  className="w-full border border-gray-200 bg-white px-4 py-3 pr-12 pl-12 font-light font-outfit text-gray-900 text-sm placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                />
                <Lock className="-translate-y-1/2 absolute top-1/2 left-4 h-4 w-4 transform text-gray-400" />
                <button
                  className="-translate-y-1/2 absolute top-1/2 right-4 transform text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  type="button"
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
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-0"
                id="terms"
                name="terms"
                required
                type="checkbox"
              />
              <label
                className="ml-2 font-light font-outfit text-gray-700 text-sm"
                htmlFor="terms"
              >
                I agree to the{' '}
                <Link
                  className="text-gray-900 underline hover:text-gray-700"
                  href="/terms"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  className="text-gray-900 underline hover:text-gray-700"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              className="w-full border border-gray-900 bg-gray-900 px-8 py-4 font-light font-outfit text-base text-white transition-colors duration-300 hover:border-gray-800 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading || success}
              type="submit"
            >
              {getButtonText()}
            </button>
          </form>

          <div className="text-center">
            <p className="font-light font-outfit text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                className="font-medium text-gray-900 transition-colors hover:text-gray-700"
                href="/auth/login"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden flex-1 items-center justify-center bg-gray-50 p-12 lg:flex">
        <div className="relative max-w-lg">
          <div className="relative">
            <Image
              alt="Premium kitchen collection"
              className="h-auto w-full rounded-lg shadow-2xl"
              height={500}
              src="/golden-sear-scallops.png"
              width={500}
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          <div className="-bottom-6 -left-6 absolute rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
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
