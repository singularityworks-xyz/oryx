'use client';

import { useQuery } from '@tanstack/react-query';

export type SessionResponse = {
  session: null | {
    user: {
      id: string;
      name: string | null;
      email: string;
      image?: string | null;
    };
  };
};

async function fetchSession(): Promise<SessionResponse['session']> {
  const res = await fetch('/api/me', { credentials: 'include' });
  if (!res.ok) {
    return null;
  }
  const data: SessionResponse = await res.json();
  return data.session ?? null;
}

export function useSessionQuery() {
  return useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    placeholderData: (prev) => prev,
  });
}
