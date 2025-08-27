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
      <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 sm:py-12 md:py-16 lg:px-8 lg:py-20 xl:py-24">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-12">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="mb-6 sm:mb-8">
              <Image
                alt="Oryx Logo"
                className="mx-auto h-10 w-auto sm:mx-0 sm:h-12"
                height={50}
                quality={100}
                src="/oryx-logo-full.svg"
                width={140}
              />
            </div>
            <p className="mx-auto mb-6 max-w-sm text-center font-light font-outfit text-gray-600 text-sm leading-relaxed sm:mx-0 sm:mb-8 sm:text-left sm:text-base">
              Crafting exceptional dining experiences through thoughtfully
              designed kitchen essentials. Every piece tells a story of elegance
              and functionality.
            </p>
            <div className="hidden space-x-3 sm:flex sm:justify-start sm:space-x-4">
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

          <div className="col-span-2 divide-y divide-gray-200 border-gray-200 border-y sm:hidden">
            <details>
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium font-playfair text-base text-gray-900 tracking-wide">
                SHOP
                <span className="ml-2">+</span>
              </summary>
              <ul className="space-y-2 px-4 pb-4">
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/products"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/products?category=cookware"
                  >
                    Cookware
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/products?category=dinnerware"
                  >
                    Dinnerware
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/products?category=cutlery"
                  >
                    Cutlery
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/products?category=accessories"
                  >
                    Accessories
                  </Link>
                </li>
              </ul>
            </details>

            <details>
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium font-playfair text-base text-gray-900 tracking-wide">
                COMPANY
                <span className="ml-2">+</span>
              </summary>
              <ul className="space-y-2 px-4 pb-4">
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/about"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/contact"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/careers"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/press"
                  >
                    Press
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/sustainability"
                  >
                    Sustainability
                  </Link>
                </li>
              </ul>
            </details>

            <details>
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-medium font-playfair text-base text-gray-900 tracking-wide">
                SUPPORT
                <span className="ml-2">+</span>
              </summary>
              <ul className="space-y-2 px-4 pb-4">
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/help"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/shipping"
                  >
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/returns"
                  >
                    Returns
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/warranty"
                  >
                    Warranty
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900"
                    href="/size-guide"
                  >
                    Size Guide
                  </Link>
                </li>
              </ul>
            </details>
          </div>

          <div className="hidden sm:block">
            <h3 className="mb-4 font-medium font-playfair text-base text-gray-900 tracking-wide sm:mb-6 sm:text-lg">
              SHOP
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/products"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/products?category=cookware"
                >
                  Cookware
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/products?category=dinnerware"
                >
                  Dinnerware
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/products?category=cutlery"
                >
                  Cutlery
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/products?category=accessories"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden sm:block">
            <h3 className="mb-4 font-medium font-playfair text-base text-gray-900 tracking-wide sm:mb-6 sm:text-lg">
              COMPANY
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/careers"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/press"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/sustainability"
                >
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden sm:block">
            <h3 className="mb-4 font-medium font-playfair text-base text-gray-900 tracking-wide sm:mb-6 sm:text-lg">
              SUPPORT
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/help"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/shipping"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/returns"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/warranty"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link
                  className="font-light font-outfit text-gray-600 text-sm transition-colors duration-300 hover:text-gray-900 sm:text-base"
                  href="/size-guide"
                >
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 ml-4 pt-6 sm:mt-10 sm:pt-10 md:mt-14 lg:mt-18 xl:mt-22">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 md:gap-12">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <Mail className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400 sm:h-5 sm:w-5" />
              <div>
                <h4 className="mb-2 font-medium font-outfit text-gray-900 text-sm tracking-wide sm:text-base">
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
                <h4 className="mb-2 font-medium font-outfit text-gray-900 text-sm tracking-wide sm:text-base">
                  CONTACT
                </h4>
                <p className="font-light font-outfit text-gray-600 text-sm sm:text-base">
                  +1 (555) 123-4567
                </p>
                <div className="mt-2 flex space-x-3 sm:hidden">
                  <button
                    aria-label="Instagram"
                    className="text-gray-400 transition-colors duration-300 hover:text-gray-600"
                    type="button"
                  >
                    <Instagram className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Twitter"
                    className="text-gray-400 transition-colors duration-300 hover:text-gray-600"
                    type="button"
                  >
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Facebook"
                    className="text-gray-400 transition-colors duration-300 hover:text-gray-600"
                    type="button"
                  >
                    <Facebook className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-span-2 flex items-start space-x-3 sm:col-span-1 sm:space-x-4">
              <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400 sm:h-5 sm:w-5" />
              <div className="w-full">
                <h4 className="mb-2 font-medium font-outfit text-gray-900 text-sm tracking-wide sm:text-base">
                  ADDRESS
                </h4>
                <div className="space-y-1">
                  <div className="font-light font-outfit text-gray-600 text-sm sm:text-base">
                    123 Design District
                  </div>
                  <span className="font-light font-outfit text-gray-600 text-sm sm:text-base">
                    New York, NY 10001
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-gray-100 border-t bg-gray-50/30">
        <div className="mx-auto max-w-[1240px] px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="hidden items-center space-x-6 font-light font-outfit text-gray-500 text-sm sm:flex sm:text-base">
              <span>&copy; 2024 Oryx. All rights reserved.</span>
              <div className="flex space-x-6">
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

            <div className="flex items-center space-x-2 font-light font-outfit text-gray-500 text-sm sm:text-base">
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
