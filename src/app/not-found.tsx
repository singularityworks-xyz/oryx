import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-light font-outfit text-6xl text-gray-700 md:text-8xl">
            404
          </h1>
          <h2 className="font-light font-outfit text-2xl text-gray-600 md:text-3xl">
            Page Not Found
          </h2>
          <p className="max-w-md font-light font-outfit text-gray-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link
          className="inline-flex items-center space-x-2 bg-gray-700 px-6 py-3 font-light font-outfit text-white transition-colors hover:bg-gray-800"
          href="/"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
