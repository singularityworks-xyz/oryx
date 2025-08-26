import type { Metadata } from 'next';
import { Geist, Geist_Mono, Outfit, Playfair_Display } from 'next/font/google';
import '../globals.css';

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
  title: 'Auth - Oryx',
  description: 'Sign in to your Oryx account',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          data-website-id="8ea5396e-6ac6-4ede-a92d-d0b476d9bf3b"
          defer
          src="https://tracking.zephyyrr.in/script.js"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${playfairDisplay.variable} bg-gray-50 antialiased`}
      >
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
