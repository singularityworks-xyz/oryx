'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { SessionResponse } from '@/lib/session-query';

export default function SessionHydrator({
  session,
}: {
  session: SessionResponse['session'];
}) {
  const client = useQueryClient();

  useEffect(() => {
    client.setQueryData(['session'], session ?? null);
  }, [client, session]);

  return null;
}
