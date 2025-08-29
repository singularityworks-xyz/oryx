'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/footer';

export default function FooterSwitcher() {
  const pathname = usePathname();
  const hideOn =
    pathname === '/' ||
    pathname === '/auth/login' ||
    pathname === '/auth/signup';
  if (hideOn) {
    return null;
  }
  return <Footer />;
}
