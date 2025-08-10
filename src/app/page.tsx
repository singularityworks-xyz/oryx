import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

// Interface for the product data that ProductCard expects
interface ProductCardData {
  _id: string;
  productId?: string;
  name: string;
  description: string;
  sellingPrice?: number;
  price?: number;
  costPrice?: number;
  discount?: number;
  images: string[];
  categories?: string[];
  category?: string;
  stock: number;
  tags?: string[];
  isTrending?: boolean;
}

// Add this function to fetch homepage products
async function getHomepageProducts(): Promise<ProductCardData[]> {
  try {
    const connection = await dbConnect();
    
    if (!connection) {
      // Silently handle missing database connection - this is expected in development
      return [];
    }

    const products = await Product.find({ 
      isActive: true, 
      tags: { $in: ['homepage'] } 
    })
    .sort({ createdAt: -1 })
    .limit(16)
    .lean();

    // Transform the data to match the ProductCard interface
    return products.map((product: Record<string, unknown>) => ({
      _id: (product._id as { toString(): string }).toString(),
      productId: product.productId as string | undefined,
      name: product.name as string,
      description: product.description as string,
      sellingPrice: product.sellingPrice as number | undefined,
      costPrice: product.costPrice as number | undefined,
      discount: product.discount as number | undefined,
      images: product.images as string[],
      categories: product.categories as string[] | undefined,
      stock: product.stock as number,
      tags: product.tags as string[] | undefined,
      isTrending: product.isTrending as boolean | undefined,
    })) || [];
  } catch (error) {
    // Only log errors in development, silently handle in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching homepage products:', error);
    }
    return [];
  }
}

export default async function Home() {
  const homepageProducts = await getHomepageProducts();

  return (
    <div className="bg-white">
      {/* First Section - Blank State */}
      <section className="h-[calc(100vh-64px)] bg-white">
        {/* Starting Div */}
        <div className="h-full max-w-[1240px] mx-auto flex flex-col lg:flex-row">
          {/* Left Section - 60% */}
          <div className="w-full lg:w-[70%] overflow-hidden order-2 lg:order-1 flex flex-col justify-between lg:justify-start h-full">
            {/* Plates Container */}
            <div className="flex items-center justify-center lg:justify-end px-4 sm:px-6 lg:px-8 py-4 lg:py-8 flex-1 lg:flex-none">
              <Image
                  src="/white-plate.png"
                  alt="White Plate"
                  width={300}
                  height={300}
                  className="w-1/3 sm:w-2/5 lg:w-2/5 h-auto object-contain mr-4 lg:mr-8"
                  quality={100}
                  priority
              />
              <Image
                src="/black-plate.png"
                alt="Black Plate"
                width={300}
                height={300}
                className="w-1/3 sm:w-2/5 lg:w-2/5 h-auto object-contain"
                quality={100}
                priority
              />
              
            </div>
            
            {/* Text Section */}
            <div className="my-4 lg:my-8 pb-4 lg:pb-8 px-4 sm:px-6 lg:px-8 flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-playfair font-normal text-gray-900 leading-tight">
                Every <span className="italic font-medium">detail</span> matters.<br />
                <span>Every meal deserves <span className="italic font-medium">elegance</span>.</span>
              </h1>
                
                {/* Shop Now Button */}
                <div className="mt-4 lg:mt-8 ">
                  <Link
                    href="/products"
                    className="inline-flex items-center px-6 lg:px-8 py-3 lg:py-4 bg-gray-900 text-white font-medium text-base lg:text-lg hover:bg-gray-800 transition-colors duration-300 border border-gray-900 hover:border-gray-800"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 lg:ml-3 w-4 h-4 lg:w-5 lg:h-5" />
                  </Link>
                </div>
                
                {/* Wooden Bowl */}
                <div className="mt-4 lg:mt-8 relative overflow-hidden hidden lg:block">
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
          <div className="w-full lg:w-[30%] flex flex-col order-1 lg:order-2">
            {/* Top Section */}
            <div className="h-32 sm:h-40 lg:h-1/2 relative">
              {/* Logo in top-right corner */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 lg:top-4 lg:right-4 lg:mt-8 lg:mr-8">
                <Image
                  src="/oryx-logo-full.svg"
                  alt="Oryx Logo"
                  width={120}
                  height={40}
                  className="h-12 sm:h-16 lg:h-20 w-auto"
                  quality={100}
                  priority
                />
              </div>
              {/* Top content will go here */}
            </div>
            
            {/* Bottom Section */}
            <div className="h-32 sm:h-40 lg:h-1/2 flex items-center justify-center overflow-hidden hidden lg:flex">
              <div className="flex w-full h-full justify-between px-4 sm:px-6 lg:px-0">
                <Image
                    src="/fork.png"
                    alt="Fork"
                    width={2500}
                    height={3000}
                    className="w-2/5 sm:w-3/5 lg:w-3/5 h-full object-cover object-top"
                    quality={100}
                    priority
                />
                <Image
                  src="/spoon.png"
                  alt="Spoon"
                  width={2000}
                  height={3000}
                  className="w-2/5 sm:w-3/5 lg:w-3/5 h-full object-cover object-top"
                  quality={100}
                  priority
                />
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section - SHOP */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-playfair font-light text-gray-900 mb-6 sm:mb-8 tracking-wide">
              CURATED COLLECTION
            </h2>
            <div className="w-20 sm:w-24 md:w-28 lg:w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-6 sm:mt-8 max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl mx-auto font-outfit font-light leading-relaxed px-4 sm:px-0">
              Discover our handpicked selection of premium kitchen essentials, each piece crafted with attention to detail and timeless elegance.
            </p>
          </div>

                     {/* Products Grid - 8x2 Layout (4 columns x 2 rows) */}
           {homepageProducts.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 mb-12 sm:mb-16 md:mb-20">
               {homepageProducts.slice(0, 8).map((product) => (
                 <ProductCard key={product._id} product={product} />
               ))}
             </div>
           ) : (
             <div className="text-center py-12 sm:py-16 md:py-20">
               <p className="text-gray-500 text-sm sm:text-base md:text-lg font-outfit font-light">No products available for homepage display.</p>
             </div>
           )}

           {/* Second Row - 8x2 Layout */}
           {homepageProducts.length > 8 && (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 mb-12 sm:mb-16 md:mb-20">
               {homepageProducts.slice(8, 16).map((product) => (
                 <ProductCard key={product._id} product={product} />
               ))}
             </div>
           )}

          {/* View All Products Button */}
          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 md:py-5 bg-gray-900 text-white font-outfit font-light text-sm sm:text-base md:text-lg hover:bg-gray-800 transition-all duration-500 border border-gray-900 hover:border-gray-800 tracking-widest hover:scale-105 transform"
            >
              EXPLORE COLLECTION
              <ArrowRight className="ml-2 sm:ml-3 md:ml-4 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
