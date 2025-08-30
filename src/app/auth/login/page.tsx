'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2Icon, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTwoFactor } from '@/contexts/two-factor-context';
import { signIn } from '@/lib/auth-client';

const REDIRECT_DELAY = 800;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showTwoFactorModal } = useTwoFactor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error?.message ?? 'Sign in failed');
        toast.error('Sign in failed', {
          description:
            result.error?.message ??
            'Please check your credentials and try again.',
        });
        // biome-ignore lint/suspicious/noExplicitAny: Could be any
      } else if ((result as any).data?.twoFactorRedirect) {
        toast.info('Two-factor authentication required', {
          description: 'Please complete the verification process.',
        });
        showTwoFactorModal(async () => {
          await queryClient.invalidateQueries({ queryKey: ['session'] });
          await queryClient.refetchQueries({ queryKey: ['session'] });
          toast.success('Successfully signed in!', {
            description: 'Welcome back to Oryx.',
          });
          router.push('/');
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['session'] });
        await queryClient.refetchQueries({ queryKey: ['session'] });

        toast.success('Successfully signed in!', {
          description: 'Welcome back to Oryx.',
        });

        setTimeout(() => {
          router.push('/');
        }, REDIRECT_DELAY);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An error occurred during sign in');
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

      toast.success('Successfully signed in with Google!', {
        description: 'Welcome back to Oryx.',
      });

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
              WELCOME BACK
            </h1>
            <div className="mx-auto mt-4 h-px w-16 bg-gray-300" />
            <p className="mt-4 font-light font-outfit text-gray-600 text-sm">
              Sign in to your account to continue
            </p>
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-600">
                <p className="font-light font-outfit text-sm">{error}</p>
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
                {/** biome-ignore lint/a11y/noSvgWithoutTitle: noobs have alt */}
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
              className="w-full border border-gray-900 bg-gray-900 px-8 py-4 font-light font-outfit text-base text-white transition-colors duration-300 hover:border-gray-800 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center">
            <p className="font-light font-outfit text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link
                className="font-medium text-gray-900 transition-colors hover:text-gray-700"
                href="/auth/signup"
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
