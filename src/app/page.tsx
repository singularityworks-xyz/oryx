import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/product-card';
import { mockProducts } from '@/data/mock-data';

export default function Home() {
  return (
    <div className="bg-white">
      <section className="h-[calc(100vh-64px)] bg-white">
        <div className="mx-auto flex h-full max-w-[1240px] flex-col lg:flex-row">
          <div className="order-2 flex h-full w-full flex-col justify-between overflow-hidden lg:order-1 lg:w-[70%] lg:justify-start">
            <div className="flex flex-1 items-center justify-center px-4 py-4 sm:px-6 lg:flex-none lg:justify-end lg:px-8 lg:py-8">
              <Image
                alt="White Plate"
                className="mr-4 h-auto w-1/3 object-contain sm:w-2/5 lg:mr-8 lg:w-2/5"
                height={300}
                priority
                quality={100}
                src="/white-plate.png"
                width={300}
              />
              <Image
                alt="Black Plate"
                className="h-auto w-1/3 object-contain sm:w-2/5 lg:w-2/5"
                height={300}
                priority
                quality={100}
                src="/black-plate.png"
                width={300}
              />
            </div>

            <div className="my-4 flex-shrink-0 px-4 pb-4 sm:px-6 lg:my-8 lg:px-8 lg:pb-8">
              <h1 className="font-normal font-playfair text-2xl text-gray-900 leading-tight sm:text-3xl md:text-4xl lg:text-6xl">
                Every <span className="font-medium italic">detail</span>{' '}
                matters.
                <br />
                <span>
                  Every meal deserves{' '}
                  <span className="font-medium italic">elegance</span>.
                </span>
              </h1>

              <div className="mt-4 lg:mt-8">
                <Link
                  className="inline-flex items-center border border-gray-900 bg-gray-900 px-6 py-3 font-medium text-base text-white transition-colors duration-300 hover:border-gray-800 hover:bg-gray-800 lg:px-8 lg:py-4 lg:text-lg"
                  href="/products"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 lg:ml-3 lg:h-5 lg:w-5" />
                </Link>
              </div>

              <div className="relative mt-4 hidden overflow-hidden lg:mt-8 lg:block">
                <Image
                  alt="Wooden Bowl"
                  className="h-auto w-4/5 object-cover object-top"
                  height={3000}
                  priority
                  quality={100}
                  src="/wooden-bowl.png"
                  width={2000}
                />
              </div>
            </div>
          </div>

          <div className="order-1 flex w-full flex-col lg:order-2 lg:w-[30%]">
            <div className="relative h-32 sm:h-40 lg:h-1/2">
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 lg:top-4 lg:right-4 lg:mt-8 lg:mr-8">
                <Image
                  alt="Oryx Logo"
                  className="h-12 w-auto sm:h-16 lg:h-20"
                  height={40}
                  priority
                  quality={100}
                  src="/oryx-logo-full.svg"
                  width={120}
                />
              </div>
            </div>

            <div className="flex h-32 items-center justify-center overflow-hidden sm:h-40 lg:flex lg:h-1/2">
              <div className="flex h-full w-full justify-between px-4 sm:px-6 lg:px-0">
                <Image
                  alt="Fork"
                  className="h-full w-2/5 object-cover object-top sm:w-3/5 lg:w-3/5"
                  height={3000}
                  priority
                  quality={100}
                  src="/fork.png"
                  width={2500}
                />
                <Image
                  alt="Spoon"
                  className="h-full w-2/5 object-cover object-top sm:w-3/5 lg:w-3/5"
                  height={3000}
                  priority
                  quality={100}
                  src="/spoon.png"
                  width={2000}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="mb-12 text-center sm:mb-16 md:mb-20 lg:mb-24">
            <h2 className="mb-6 font-light font-playfair text-2xl text-gray-900 tracking-wide sm:mb-8 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              CURATED COLLECTION
            </h2>
            <div className="mx-auto h-px w-20 bg-gray-300 sm:w-24 md:w-28 lg:w-32" />
            <p className="mx-auto mt-6 max-w-xs px-4 font-light font-outfit text-gray-600 text-sm leading-relaxed sm:mt-8 sm:max-w-sm sm:px-0 sm:text-base md:max-w-xl md:text-lg lg:max-w-2xl">
              Discover our handpicked selection of premium kitchen essentials,
              each piece crafted with attention to detail and timeless elegance.
            </p>
          </div>

          <div className="mb-12 grid grid-cols-2 gap-4 sm:mb-16 sm:gap-6 md:mb-20 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-10 xl:gap-12">
            {mockProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link
              className="inline-flex transform items-center border border-gray-900 bg-gray-900 px-6 py-3 font-light font-outfit text-sm text-white tracking-widest transition-all duration-500 hover:scale-105 hover:border-gray-800 hover:bg-gray-800 sm:px-8 sm:py-4 sm:text-base md:px-10 md:py-5 md:text-lg lg:px-12"
              href="/products"
            >
              EXPLORE COLLECTION
              <ArrowRight className="ml-2 h-4 w-4 sm:ml-3 sm:h-5 sm:w-5 md:ml-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
