'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminIndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/overview');
  }, [router]);
  return null;
}
