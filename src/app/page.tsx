import Link from 'next/link';
import { ShoppingBag, Star, Truck, Shield, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-white">
      {/* First Section - Blank State */}
      <section className="h-[calc(100vh-64px)] bg-white">
        {/* Starting Div */}
        <div className="h-full max-w-[1240px] mx-auto flex">
          {/* Left Section - 60% */}
          <div className="w-[70%] overflow-hidden">
            {/* Plates Container */}
            <div className="flex items-center justify-end px-8 py-8">
              <Image
                  src="/white-plate.png"
                  alt="White Plate"
                  width={300}
                  height={300}
                  className="w-2/5 h-auto object-contain mr-8"
                  quality={100}
                  priority
              />
              <Image
                src="/black-plate.png"
                alt="Black Plate"
                width={300}
                height={300}
                className="w-2/5 h-auto object-contain"
                quality={100}
                priority
              />
              
            </div>
            
            {/* Text Section */}
            <div className="my-8 pb-8 overflow-hidden">
              <h1 className="text-4xl md:text-4xl lg:text-6xl font-playfair font-normal text-gray-900 leading-tight">
                Every <span className="italic font-medium">detail</span> matters.<br />
                <span className="whitespace-nowrap">Every meal deserves <span className="italic font-medium">elegance</span>.</span>
              </h1>
                
                {/* Shop Now Button */}
                <div className="mt-8">
                  <Link
                    href="/products"
                    className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-medium text-lg hover:bg-gray-800 transition-colors duration-300 border border-gray-900 hover:border-gray-800"
                  >
                    Shop Now
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Link>
                </div>
                
                {/* Wooden Bowl */}
                <div className="mt-8 relative overflow-hidden">
                  <Image
                    src="/wooden-bowl.png"
                    alt="Wooden Bowl"
                    width={2000}
                    height={3000}
                    className="w-4/5 h-auto object-cover object-top"
                    quality={100}
                    priority
                  />
                </div>
              </div>
            </div>
          
          {/* Right Section - 40% */}
          <div className="w-[30%] flex flex-col">
            {/* Top Section */}
            <div className="h-1/2 relative">
              {/* Logo in top-right corner */}
              <div className="absolute top-4 right-4 mt-8 mr-8">
                <Image
                  src="/oryx-logo-full.svg"
                  alt="Oryx Logo"
                  width={120}
                  height={40}
                  className="h-20 w-auto"
                  quality={100}
                  priority
                />
              </div>
              {/* Top content will go here */}
            </div>
            
            {/* Bottom Section */}
            <div className="h-1/2 flex items-center justify-center overflow-hidden">
              <div className="flex w-full h-full justify-between ">
                <Image
                    src="/fork.png"
                    alt="Fork"
                    width={2500}
                    height={3000}
                    className="w-3/5 h-full object-cover object-top"
                    quality={100}
                    priority
                />
                <Image
                  src="/spoon.png"
                  alt="Spoon"
                  width={2000}
                  height={3000}
                  className="w-3/5 h-full object-cover object-top"
                  quality={100}
                  priority
                />
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
