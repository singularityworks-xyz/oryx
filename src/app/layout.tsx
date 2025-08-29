import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Geist, Geist_Mono, Outfit, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import FooterSwitcher from '@/components/footer-switcher';
import Navbar from '@/components/navbar';
import { QueryProvider } from '@/lib/query-client';
import SessionHydrator from '@/components/session-hydrator';
import { auth } from '@/lib/auth';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Oryx - Hotel Supplies',
  description: 'Qatar’s trusted partner in premium hotel supplies',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${playfairDisplay.variable} bg-gray-50 antialiased`}
      >
        <Script
          data-website-id="8ea5396e-6ac6-4ede-a92d-d0b476d9bf3b"
          src="https://tracking.zephyyrr.in/script.js"
          strategy="afterInteractive"
        />
        <QueryProvider>
          <SessionHydrator session={session} />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <FooterSwitcher />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
