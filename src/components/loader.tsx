'use client';

import { cn } from '@/lib/utils';

type LoaderProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export default function Loader({ size = 'md', className }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gray-700" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1 w-1 rounded-full bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

export function InlineLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className="flex space-x-1">
        <div className="h-1 w-1 animate-bounce rounded-full bg-gray-700 [animation-delay:-0.3s]" />
        <div className="h-1 w-1 animate-bounce rounded-full bg-gray-700 [animation-delay:-0.15s]" />
        <div className="h-1 w-1 animate-bounce rounded-full bg-gray-700" />
      </div>
    </div>
  );
}

export function PageLoader() {
  const funFacts = [
    'Did you know? The hospitality industry generates over $2.4 trillion annually worldwide',
    'Fun fact: A single hotel room can contain up to 50+ different types of supplies',
    'Interesting: Hotel towels are designed to be more absorbent than regular towels',
    'Did you know? The first hotel was built in 700 BC in Mesopotamia',
    'Fun fact: Hotels worldwide use over 1 billion towels annually',
    'Interesting: The hospitality industry employs over 300 million people globally',
  ];

  const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="space-y-6 text-center">
        <Loader size="lg" />
        <div className="space-y-2">
          <p className="font-light font-outfit text-gray-700 text-sm">
            Loading...
          </p>
          <p className="max-w-md font-light font-outfit text-gray-600 text-xs leading-relaxed">
            {randomFact}
          </p>
        </div>
      </div>
    </div>
  );
}
