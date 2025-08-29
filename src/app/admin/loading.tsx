'use client';

import { Skeleton } from '@/components/ui/skeleton';

const ADMIN_LOADING_KEYS = {
  section1: ['s1-1', 's1-2', 's1-3', 's1-4'],
  section2: ['s2-1', 's2-2', 's2-3', 's2-4', 's2-5'],
  section3: ['s3-1', 's3-2', 's3-3', 's3-4'],
};

export default function AdminLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="rounded-none border p-4">
        <Skeleton className="h-4 w-32" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          {ADMIN_LOADING_KEYS.section1.map((id) => (
            <Skeleton className="h-16 w-full" key={id} />
          ))}
        </div>
      </div>
      <div className="rounded-none border p-4 xl:col-span-2">
        <Skeleton className="h-4 w-48" />
        <div className="mt-3 space-y-2">
          {ADMIN_LOADING_KEYS.section2.map((id) => (
            <Skeleton className="h-8 w-full" key={id} />
          ))}
        </div>
      </div>
      <div className="rounded-none border p-4 xl:col-span-3">
        <Skeleton className="h-4 w-40" />
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {ADMIN_LOADING_KEYS.section3.map((id) => (
            <Skeleton className="h-24 w-full" key={id} />
          ))}
        </div>
      </div>
    </div>
  );
}
