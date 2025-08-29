'use client';

import { LogOut, Settings, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/auth-client';
import { useSessionQuery } from '@/lib/session-query';

export default function UserButton() {
  const { data: session, isPending } = useSessionQuery();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          // Handle sign out request
        },
        onSuccess: () => {
          router.push('/');
        },
        onError: (error) => {
          console.error('Sign out error:', error);
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 animate-pulse bg-gray-200" />
      </div>
    );
  }

  if (session?.user) {
    const userInitials = session.user.name
      ? session.user.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'U';

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="relative h-9 w-9 p-0 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            variant="ghost"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                alt={session.user.name || 'User'}
                src={session.user.image || ''}
              />
              <AvatarFallback className="bg-gray-100 font-light text-gray-600 text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 border border-gray-200 bg-white shadow-lg"
          forceMount
        >
          <DropdownMenuLabel className="font-light text-gray-700">
            <div className="flex flex-col space-y-1">
              <p className="font-light text-sm leading-none">
                {session.user.name || 'User'}
              </p>
              <p className="text-gray-500 text-xs leading-none">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200" />
          <DropdownMenuItem
            className="cursor-pointer font-light text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
            onClick={() => router.push('/profile')}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer font-light text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
            onClick={() => router.push('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-200" />
          <DropdownMenuItem
            className="cursor-pointer font-light text-red-600 hover:bg-red-50 focus:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="hidden items-center space-x-3 md:flex">
      <Link
        className="px-3 py-2 font-light text-gray-700 text-sm transition-colors hover:text-gray-900"
        href="/auth/login"
      >
        Sign In
      </Link>
      <Link
        className="border border-gray-900 bg-gray-900 px-4 py-2 font-light text-sm text-white transition-colors hover:border-gray-800 hover:bg-gray-800"
        href="/auth/signup"
      >
        Sign Up
      </Link>
    </div>
  );
}
