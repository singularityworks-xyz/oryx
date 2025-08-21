import Link from "next/link";
import Image from "next/image";
import {
	Mail,
	Phone,
	MapPin,
	Instagram,
	Twitter,
	Facebook,
	Heart,
} from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-white border-t border-gray-100">
			<div className="w-full h-px bg-gray-200"></div>
			<div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
					<div className="sm:col-span-2 lg:col-span-1">
						<div className="mb-6 sm:mb-8">
							<Image
								src="/oryx-logo-full.svg"
								alt="Oryx Logo"
								width={140}
								height={50}
								className="h-10 sm:h-12 w-auto"
								quality={100}
							/>
						</div>
						<p className="text-gray-600 text-sm sm:text-base font-outfit font-light leading-relaxed mb-6 sm:mb-8 max-w-sm">
							Crafting exceptional dining experiences through thoughtfully
							designed kitchen essentials. Every piece tells a story of elegance
							and functionality.
						</p>
						<div className="flex space-x-3 sm:space-x-4">
							<a
								href="#"
								className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
							>
								<Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
							>
								<Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
							>
								<Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
							</a>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-playfair font-medium text-gray-900 mb-8 tracking-wide">
							SHOP
						</h3>
						<ul className="space-y-4">
							<li>
								<Link
									href="/products"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									All Products
								</Link>
							</li>
							<li>
								<Link
									href="/products?category=cookware"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									Cookware
								</Link>
							</li>
							<li>
								<Link
									href="/products?category=dinnerware"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									Dinnerware
								</Link>
							</li>
							<li>
								<Link
									href="/products?category=cutlery"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									Cutlery
								</Link>
							</li>
							<li>
								<Link
									href="/products?category=accessories"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									Accessories
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-playfair font-medium text-gray-900 mb-8 tracking-wide">
							COMPANY
						</h3>
						<ul className="space-y-4">
							<li>
								<Link
									href="/about"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									Contact
								</Link>
							</li>
							<li>
								<Link
									href="/careers"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									Careers
								</Link>
							</li>
							<li>
								<Link
									href="/press"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									Press
								</Link>
							</li>
							<li>
								<Link
									href="/sustainability"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									Sustainability
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-playfair font-medium text-gray-900 mb-8 tracking-wide">
							SUPPORT
						</h3>
						<ul className="space-y-4">
							<li>
								<Link
									href="/help"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									Help Center
								</Link>
							</li>
							<li>
								<Link
									href="/shipping"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									Shipping Info
								</Link>
							</li>
							<li>
								<Link
									href="/returns"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									Returns
								</Link>
							</li>
							<li>
								<Link
									href="/warranty"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									Warranty
								</Link>
							</li>
							<li>
								<Link
									href="/size-guide"
									className="text-gray-600 hover:text-gray-900 font-outfit font-light transition-colors duration-300"
								>
									Size Guide
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-32 pt-12 sm:pt-16 border-t border-gray-100">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-16">
						<div className="flex items-start space-x-3 sm:space-x-4">
							<Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" />
							<div>
								<h4 className="text-xs sm:text-sm font-outfit font-medium text-gray-900 mb-2 tracking-wide">
									EMAIL
								</h4>
								<p className="text-sm sm:text-base text-gray-600 font-outfit font-light">
									hello@oryx.com
								</p>
							</div>
						</div>

						<div className="flex items-start space-x-3 sm:space-x-4">
							<Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" />
							<div>
								<h4 className="text-xs sm:text-sm font-outfit font-medium text-gray-900 mb-2 tracking-wide">
									PHONE
								</h4>
								<p className="text-sm sm:text-base text-gray-600 font-outfit font-light">
									+1 (555) 123-4567
								</p>
							</div>
						</div>

						<div className="flex items-start space-x-3 sm:space-x-4">
							<MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" />
							<div>
								<h4 className="text-xs sm:text-sm font-outfit font-medium text-gray-900 mb-2 tracking-wide">
									ADDRESS
								</h4>
								<p className="text-sm sm:text-base text-gray-600 font-outfit font-light">
									123 Design District
									<br />
									New York, NY 10001
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="border-t border-gray-100 bg-gray-50/30">
				<div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
					<div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
						<div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-500 font-outfit font-light">
							<span>&copy; 2024 Oryx. All rights reserved.</span>
							<div className="flex space-x-4 sm:space-x-6">
								<Link
									href="/privacy"
									className="hover:text-gray-700 transition-colors duration-300"
								>
									Privacy Policy
								</Link>
								<Link
									href="/terms"
									className="hover:text-gray-700 transition-colors duration-300"
								>
									Terms of Service
								</Link>
							</div>
						</div>

						<div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 font-outfit font-light">
							<span>Made with</span>
							<Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
							<span>in New York</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
