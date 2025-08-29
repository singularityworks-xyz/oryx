'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ChangePasswordDialog() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="border border-gray-300 bg-white px-4 py-2 font-light font-outfit text-gray-700 text-sm hover:bg-gray-50">
          Change
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-light font-outfit text-gray-900">
            Change Password
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="mt-2 space-y-3">
          <Input
            className="rounded-none border-gray-300 focus:border-gray-900 focus:ring-0"
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Current password"
            type="password"
            value={current}
          />
          <Input
            className="rounded-none border-gray-300 focus:border-gray-900 focus:ring-0"
            onChange={(e) => setNext(e.target.value)}
            placeholder="New password"
            type="password"
            value={next}
          />
          <Input
            className="rounded-none border-gray-300 focus:border-gray-900 focus:ring-0"
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            type="password"
            value={confirm}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-none border border-gray-300 bg-white font-light font-outfit text-gray-700 hover:bg-gray-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="rounded-none bg-gray-900 font-light font-outfit text-white hover:bg-gray-800">
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
