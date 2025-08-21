import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const PERCENTAGE_MULTIPLIER = 100;

type ProductCardProps = {
  product: {
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
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.sellingPrice || product.price || 0;
  const originalPrice = product.costPrice || product.price || 0;
  const discount = product.discount || 0;
  const discountPercentage =
    originalPrice > 0
      ? Math.round((discount / originalPrice) * PERCENTAGE_MULTIPLIER)
      : 0;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden border border-gray-100 bg-white transition-all duration-700 hover:border-gray-200 hover:shadow-2xl">
      <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <div className="relative h-48 w-full flex-shrink-0 overflow-hidden bg-gray-50 sm:h-64 md:h-72 lg:h-80">
        <Link href={`/products/${product._id}`}>
          <Image
            alt={product.name}
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            fill
            priority={false}
            quality={90}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw"
            src={product.images[0]}
          />
          <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-700 group-hover:opacity-5" />
        </Link>

        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-black px-2 py-1 font-light font-outfit text-white text-xs tracking-widest shadow-lg sm:top-4 sm:left-4 sm:px-3 sm:py-1.5">
            -{discountPercentage}%
          </div>
        )}

        {product.isTrending && (
          <div className="absolute top-2 right-2 border border-gray-200 bg-white px-2 py-1 font-light font-outfit text-black text-xs tracking-widest shadow-lg sm:top-4 sm:right-4 sm:px-3 sm:py-1.5">
            <Star className="mr-1 inline h-3 w-3 fill-current" />
            TRENDING
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-4 sm:p-6 md:p-8">
        <Link className="flex-1" href={`/products/${product._id}`}>
          <h3 className="mb-4 font-medium font-outfit text-gray-900 text-sm leading-relaxed tracking-wide transition-colors duration-300 hover:text-gray-600 sm:mb-6 sm:text-base md:text-lg">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-baseline gap-2 sm:gap-4">
          <span className="font-light font-outfit text-gray-900 text-lg tracking-wide sm:text-xl md:text-2xl">
            <span className="font-light font-outfit text-gray-500 text-xs tracking-wider sm:text-sm">
              QAR
            </span>
            <br />
            {displayPrice.toFixed(2)}
          </span>
          {discountPercentage > 0 && (
            <span className="font-light font-outfit text-gray-400 text-xs tracking-wide line-through sm:text-sm">
              QAR {originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
