import { twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { env } from './env';
import { queryClient } from './query-client';

export const authClient = createAuthClient({
  baseURL:
    env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000'),
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        // Instead of redirecting, we'll handle this in the UI
        // The signIn function will return twoFactorRedirect: true
        // and the UI can show a modal
      },
    }),
  ],
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
