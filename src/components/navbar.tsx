"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart } from "lucide-react";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav className="bg-white shadow-lg font-outfit font-light sticky top-0 z-50">
			<div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<Link href="/" className="flex-shrink-0 flex items-center">
							<Image
								src="/oryx-logo.svg"
								alt="Oryx Logo"
								width={120}
								height={40}
								className="h-8 w-auto"
							/>
						</Link>
					</div>

					<div className="hidden md:flex items-center space-x-8">
						<Link
							href="/products"
							className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-5 font-light"
						>
							shop
						</Link>
						<Link
							href="/contact"
							className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-5 font-light"
						>
							contact
						</Link>
						<Link
							href="/about"
							className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-5 font-light"
						>
							about
						</Link>
						<button
							type="button"
							className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-5 font-light"
						>
							<Search className="w-5 h-5" />
						</button>
					</div>

					<div className="hidden md:flex items-center space-x-4">
						<Link
							href="/cart"
							className="text-gray-700 hover:text-gray-900 p-2 rounded-md text-5 font-light flex items-center relative"
						>
							<ShoppingCart className="w-5 h-5" />
							<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
								3
							</span>
						</Link>
					</div>

					<div className="md:hidden">
						<button
							type="button"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-gray-700 hover:text-gray-900 p-2"
						>
							{isMenuOpen ? (
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>

			{isMenuOpen && (
				<div className="md:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
						<Link
							href="/products"
							className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-light"
							onClick={() => setIsMenuOpen(false)}
						>
							Shop
						</Link>
						<Link
							href="/contact"
							className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-light"
							onClick={() => setIsMenuOpen(false)}
						>
							Contact
						</Link>
						<Link
							href="/about"
							className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-light"
							onClick={() => setIsMenuOpen(false)}
						>
							About
						</Link>
						<button
							type="button"
							className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-light w-full text-left flex items-center"
						>
							<Search className="w-5 h-5 mr-2" />
							Search
						</button>

						<Link
							href="/auth/signin"
							className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-light"
							onClick={() => setIsMenuOpen(false)}
						>
							Sign In
						</Link>
						<Link
							href="/auth/signup"
							className="bg-blue-600 text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-light"
							onClick={() => setIsMenuOpen(false)}
						>
							Sign Up
						</Link>

						<Link
							href="/cart"
							className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-light flex items-center"
							onClick={() => setIsMenuOpen(false)}
						>
							<ShoppingCart className="w-5 h-5 mr-2" />
							Cart
							<span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
								3
							</span>
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
}
