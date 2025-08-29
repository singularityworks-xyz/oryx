'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function EditPhotoDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="rounded-none bg-gray-900 px-4 py-2 font-light font-outfit text-white hover:bg-gray-800"
          variant="default"
        >
          Change Photo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-light font-outfit text-gray-900">
            Change Profile Photo
          </AlertDialogTitle>
          <AlertDialogDescription className="font-light font-outfit text-gray-600">
            This feature is coming soon. You will be able to upload and update
            your profile photo here.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="rounded-none bg-gray-900 font-light font-outfit text-white hover:bg-gray-800">
            Okay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
