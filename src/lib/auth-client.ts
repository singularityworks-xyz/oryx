import { createAuthClient } from 'better-auth/react';
import { queryClient } from './query-client';
import { env } from './env';

export const authClient = createAuthClient({
  baseURL:
    env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000'),
});

export const { signIn, signUp, signOut: rawSignOut, useSession } = authClient;

export async function signOut(options?: {
  fetchOptions?: {
    onRequest?: () => void;
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  };
}) {
  await rawSignOut({
    fetchOptions: {
      onRequest: options?.fetchOptions?.onRequest,
      onSuccess: async () => {
        try {
          await queryClient.invalidateQueries({ queryKey: ['session'] });
          queryClient.setQueryData(['session'], null);
        } finally {
          options?.fetchOptions?.onSuccess?.();
        }
      },
      onError: (error) => {
        options?.fetchOptions?.onError?.(error);
      },
    },
  });
}
