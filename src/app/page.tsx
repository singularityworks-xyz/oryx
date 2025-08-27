'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import ProductCard from '@/components/product-card';
import { mockProducts } from '@/data/mock-data';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playVideo = async () => {
        try {
          await video.play();
        } catch {
          const handleUserInteraction = () => {
            video.play().catch(console.error);
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
          };
          document.addEventListener('click', handleUserInteraction);
          document.addEventListener('touchstart', handleUserInteraction);
        }
      };

      playVideo();
    }
  }, []);

  return (
    <div className="bg-white">
      <section className="relative h-96 w-full overflow-hidden lg:hidden">
        <video
          autoPlay
          className="h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="auto"
          ref={videoRef}
        >
          <source src="/mobile_intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 flex items-end justify-center bg-black/40">
          <div className="px-4 pb-8 text-center text-white">
            <h2 className="mb-4 font-light font-playfair text-2xl tracking-wide sm:text-3xl md:text-4xl">
              Experience Culinary Excellence
            </h2>
            <p className="mx-auto max-w-xs font-light font-outfit text-sm leading-relaxed sm:max-w-sm sm:text-base md:max-w-xl md:text-lg">
              Discover the art of fine dining with our premium collection of
              elegant kitchen essentials
            </p>
          </div>
        </div>
      </section>

      <section className="hidden h-[calc(100vh-64px)] bg-white lg:block">
        <div className="mx-auto flex h-full max-w-[1240px] flex-row">
          <div className="flex h-full w-[70%] flex-col overflow-hidden">
            <div className="flex items-center justify-end px-8 py-8">
              <Image
                alt="White Plate"
                className="mr-8 h-auto w-2/5 object-contain"
                height={300}
                priority
                quality={100}
                src="/white-plate.png"
                width={300}
              />
              <Image
                alt="Black Plate"
                className="h-auto w-2/5 object-contain"
                height={300}
                priority
                quality={100}
                src="/black-plate.png"
                width={300}
              />
            </div>

            <div className="flex flex-1 flex-col px-8 pb-0">
              <h1 className="font-normal font-playfair text-6xl text-gray-900 leading-tight">
                Every <span className="font-medium italic">detail</span>{' '}
                matters.
                <br />
                <span>
                  Every meal deserves{' '}
                  <span className="font-medium italic">elegance</span>.
                </span>
              </h1>

              <div className="relative mt-10 flex-1 overflow-hidden">
                <video
                  autoPlay
                  className="h-full w-full object-cover"
                  loop
                  muted
                  playsInline
                  preload="auto"
                >
                  <source src="/mobile_intro.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="mb-8 text-center text-white">
                    <p className="mb-6 font-light font-outfit text-sm tracking-wide">
                      Culinary Excellence
                    </p>
                    <Link
                      className="inline-flex items-center border border-white bg-transparent px-8 py-4 font-medium text-lg text-white transition-all duration-300 hover:bg-white hover:text-gray-900"
                      href="/products"
                    >
                      Shop Now
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-[30%] flex-col">
            <div className="relative h-1/2">
              <div className="absolute top-4 right-4 mt-8 mr-8">
                <Image
                  alt="Oryx Logo"
                  className="h-20 w-auto"
                  height={40}
                  priority
                  quality={100}
                  src="/oryx-logo-full.svg"
                  width={120}
                />
              </div>
            </div>

            <div className="flex h-1/2 items-center justify-center">
              <div className="flex h-full w-full justify-between">
                <Image
                  alt="Fork"
                  className="h-full w-3/5 object-cover object-top"
                  height={3000}
                  priority
                  quality={100}
                  src="/fork.png"
                  width={2500}
                />
                <Image
                  alt="Spoon"
                  className="h-full w-3/5 object-cover object-top"
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

          <div className="mb-12 grid grid-cols-2 gap-8 sm:grid-cols-2 sm:gap-8 md:mb-20 md:grid-cols-3 md:gap-10 lg:grid-cols-4 lg:gap-12 xl:gap-16">
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
