import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Oryx - Hotel Supplies",
	description: "Qatar’s trusted partner in premium hotel supplies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${playfairDisplay.variable} antialiased bg-gray-50`}
				>
					<div className="min-h-screen flex flex-col">
						<Navbar />
						<main className="flex-1">{children}</main>
						<Footer />
					</div>
				</body>
			</html>
		);
}
