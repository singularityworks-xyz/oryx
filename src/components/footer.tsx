import {
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-gray-100 border-t bg-white">
      <div className="h-px w-full bg-gray-200" />
      <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24 xl:py-32">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-6 sm:mb-8">
              <Image
                alt="Oryx Logo"
                className="h-10 w-auto sm:h-12"
                height={50}
                quality={100}
                src="/oryx-logo-full.svg"
                width={140}
              />
            </div>
            <p className="mb-6 max-w-sm font-light font-outfit text-gray-600 text-sm leading-relaxed sm:mb-8 sm:text-base">
              Crafting exceptional dining experiences through thoughtfully
              designed kitchen essentials. Every piece tells a story of elegance
              and functionality.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <button
                aria-label="Instagram"
                className="text-gray-400 transition-colors duration-300 hover:text-gray-600"
                type="button"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                aria-label="Twitter"
                className="text-gray-400 transition-colors duration-300 hover:text-gray-600"
                type="button"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                aria-label="Facebook"
                className="text-gray-400 transition-colors duration-300 hover:text-gray-600"
                type="button"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="mb-8 font-medium font-playfair text-gray-900 text-lg tracking-wide">
              SHOP
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/products"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/products?category=cookware"
                >
                  Cookware
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/products?category=dinnerware"
                >
                  Dinnerware
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/products?category=cutlery"
                >
                  Cutlery
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/products?category=accessories"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-8 font-medium font-playfair text-gray-900 text-lg tracking-wide">
              COMPANY
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/careers"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/press"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/sustainability"
                >
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-8 font-medium font-playfair text-gray-900 text-lg tracking-wide">
              SUPPORT
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/help"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/shipping"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/returns"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/warranty"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 transition-colors duration-300 hover:text-gray-900"
                  href="/size-guide"
                >
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-gray-100 border-t pt-12 sm:mt-16 sm:pt-16 md:mt-20 lg:mt-24 xl:mt-32">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:gap-16">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <Mail className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400 sm:h-5 sm:w-5" />
              <div>
                <h4 className="mb-2 font-medium font-outfit text-gray-900 text-xs tracking-wide sm:text-sm">
                  EMAIL
                </h4>
                <p className="font-light font-outfit text-gray-600 text-sm sm:text-base">
                  hello@oryx.com
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <Phone className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400 sm:h-5 sm:w-5" />
              <div>
                <h4 className="mb-2 font-medium font-outfit text-gray-900 text-xs tracking-wide sm:text-sm">
                  PHONE
                </h4>
                <p className="font-light font-outfit text-gray-600 text-sm sm:text-base">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400 sm:h-5 sm:w-5" />
              <div>
                <h4 className="mb-2 font-medium font-outfit text-gray-900 text-xs tracking-wide sm:text-sm">
                  ADDRESS
                </h4>
                <p className="font-light font-outfit text-gray-600 text-sm sm:text-base">
                  123 Design District
                  <br />
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-gray-100 border-t bg-gray-50/30">
        <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex flex-col items-center space-y-2 font-light font-outfit text-gray-500 text-xs sm:flex-row sm:space-x-6 sm:space-y-0 sm:text-sm">
              <span>&copy; 2024 Oryx. All rights reserved.</span>
              <div className="flex space-x-4 sm:space-x-6">
                <Link
                  className="transition-colors duration-300 hover:text-gray-700"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
                <Link
                  className="transition-colors duration-300 hover:text-gray-700"
                  href="/terms"
                >
                  Terms of Service
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-2 font-light font-outfit text-gray-500 text-xs sm:text-sm">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-400 sm:h-4 sm:w-4" />
              <span>in New York</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
