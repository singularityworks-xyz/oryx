import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auth - Oryx',
  description: 'Sign in to your Oryx account',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="min-h-screen">{children}</main>;
}
