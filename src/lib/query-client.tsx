'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { PropsWithChildren } from 'react';

// biome-ignore lint/style/noMagicNumbers: it's time sar
const QUERY_STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes
// biome-ignore lint/style/noMagicNumbers: it's time sar
const QUERY_GC_TIME_MS = 30 * 60 * 1000; // 30 minutes

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MS,
      gcTime: QUERY_GC_TIME_MS,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
