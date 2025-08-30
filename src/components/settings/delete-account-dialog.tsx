'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

const SESSION_UPDATE_DELAY = 500;

export default function DeleteAccountDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }

      return response.json();
    },
    onMutate: async () => {
      await queryClient.setQueryData(['session'], null);
      queryClient.clear();

      return toast.loading('Deleting your account...', {
        description: 'This may take a few moments',
      });
    },
    onSuccess: async (_data, _variables, context) => {
      if (context) {
        toast.dismiss(context);
      }

      // Ensure session data is completely cleared and all components update &
      // Force clear any cached session data that might persist
      await queryClient.setQueryData(['session'], null);
      await queryClient.invalidateQueries({
        queryKey: ['session'],
        refetchType: 'none',
      });
      queryClient.clear();
      localStorage.removeItem('oryx_session');
      sessionStorage.clear();

      window.dispatchEvent(new CustomEvent('session-cleared'));

      toast.success('Account deleted successfully', {
        description:
          'Your account and all associated data have been permanently removed.',
      });

      setIsOpen(false);

      setTimeout(async () => {
        try {
          await authClient.signOut();
          // Force a hard navigation to ensure all components re-render with cleared state
          window.location.href = '/';
        } catch (signOutError) {
          console.error('Sign out error:', signOutError);
          window.location.href = '/';
        }
      }, SESSION_UPDATE_DELAY);
    },
    onError: async (error, _variables, context) => {
      if (context) {
        toast.dismiss(context);
      }

      // Restore session data if the mutation failed (rollback optimistic update)
      // Refetch the session data to restore the user's session
      try {
        await queryClient.invalidateQueries({ queryKey: ['session'] });
        await queryClient.refetchQueries({ queryKey: ['session'] });
      } catch (refetchError) {
        console.error('Failed to refetch session data:', refetchError);
      }

      toast.error('Failed to delete account', {
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
      });
    },
  });

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="border border-red-300 bg-white px-4 py-2 font-light font-outfit text-red-700 text-sm hover:bg-red-50"
          disabled={deleteAccountMutation.isPending}
        >
          {deleteAccountMutation.isPending ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-none border-2 border-red-200 bg-white shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-light font-outfit text-red-900 text-xl">
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="font-light font-outfit text-gray-600 text-sm">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers, including:
          </AlertDialogDescription>
          <ul className="mt-4 list-inside list-disc space-y-1 font-light font-outfit text-gray-600 text-sm">
            <li>Your profile information and settings</li>
            <li>All your purchase history and orders</li>
            <li>Your saved preferences and notifications</li>
            <li>Any connected accounts and social logins</li>
            <li>Your two-factor authentication settings</li>
          </ul>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel
            className="rounded-none border border-gray-300 bg-white px-6 py-2 font-light font-outfit text-gray-700 hover:bg-gray-50"
            disabled={deleteAccountMutation.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="rounded-none border border-red-600 bg-red-600 px-6 py-2 font-light font-outfit text-white hover:bg-red-700 disabled:opacity-50"
            disabled={deleteAccountMutation.isPending}
            onClick={() => deleteAccountMutation.mutate()}
          >
            {deleteAccountMutation.isPending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Account'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
