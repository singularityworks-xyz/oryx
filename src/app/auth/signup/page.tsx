'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2Icon, Lock, Mail, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { signIn, signUp } from '@/lib/auth-client';

const MIN_PASSWORD_LENGTH = 6;
const REDIRECT_DELAY = 1000;

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
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
      );
      return false;
    }

    return true;
  };

  const handleAutoLoginFailure = () => {
    toast.warning('Account created but auto-login failed', {
      description: 'Please sign in manually.',
    });
    setTimeout(() => {
      router.push('/auth/login');
    }, REDIRECT_DELAY);
  };

  const handleAutoLoginSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ['session'] });
    await queryClient.refetchQueries({ queryKey: ['session'] });

    window.dispatchEvent(new CustomEvent('session-cleared'));

    toast.success('Welcome to Oryx!', {
      description: "Your account has been created and you're now signed in.",
    });

    setTimeout(() => {
      router.push('/');
    }, REDIRECT_DELAY);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    if (!validateForm()) {
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
        toast.error('Account creation failed', {
          description:
            result.error.message ??
            'Please check your information and try again.',
        });
      } else {
        setSuccess(true);
        toast.success('Account created successfully!', {
          description: 'Signing you in automatically...',
        });

        // Automatically sign in the user after successful account creation
        try {
          const signInResult = await signIn.email({
            email: formData.email,
            password: formData.password,
          });

          if (signInResult.error) {
            handleAutoLoginFailure();
            return;
          }

          await handleAutoLoginSuccess();
        } catch (signInError) {
          console.error('Auto sign-in error:', signInError);
          handleAutoLoginFailure();
        }
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError('An error occurred during sign up');
      toast.error('Connection error', {
        description:
          'Unable to connect to server. Please check your internet connection.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: socialError } = await signIn.social({
        provider: 'google',
      });

      if (socialError) {
        setError(socialError.message ?? 'Google sign in failed');
        toast.error('Google sign in failed', {
          description:
            socialError.message ?? 'Please try again or use email/password.',
        });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['session'] });
      await queryClient.refetchQueries({ queryKey: ['session'] });

      window.dispatchEvent(new CustomEvent('session-cleared'));

      toast.success('Account created with Google!', {
        description: "Welcome to Oryx! You're now signed in.",
      });

      // Redirect with a shorter delay to show the success message
      setTimeout(() => {
        router.push('/');
      }, REDIRECT_DELAY);
    } catch (err) {
      console.error('Google sign in error:', err);
      setError('Google sign in failed');
      toast.error('Connection error', {
        description: 'Unable to connect to Google. Please try again.',
      });
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
                  Account created successfully! Redirecting to home...
                </p>
              </div>
            )}
          </div>

          <button
            className="flex w-full items-center justify-center gap-3 border border-gray-200 bg-white px-4 py-3 font-light font-outfit text-gray-700 text-sm transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
            type="button"
          >
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: only noobs require alts */}
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-gray-200 border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 font-light font-outfit text-gray-500">
                or
              </span>
            </div>
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
