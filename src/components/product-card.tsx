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

      <div className="relative aspect-square w-full flex-shrink-0 overflow-hidden bg-gray-50">
        <Link href={`/products/${product._id}`}>
          <Image
            alt={product.name}
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            fill
            priority={false}
            quality={90}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            src={product.images[0]}
          />
          <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-700 group-hover:opacity-5" />
        </Link>

        <div className="absolute inset-2 flex flex-col justify-between sm:inset-3">
          <div className="flex items-start justify-between gap-2">
            {discountPercentage > 0 && (
              <div className="flex-shrink-0 bg-black px-2 py-1 font-light font-outfit text-white text-xs tracking-widest shadow-lg sm:px-3 sm:py-1.5">
                -{discountPercentage}%
              </div>
            )}

            {product.isTrending && (
              <div className="flex-shrink-0 border border-gray-200 bg-white px-2 py-1 font-light font-outfit text-black text-xs tracking-widest shadow-lg sm:px-3 sm:py-1.5">
                <Star className="mr-1 inline h-3 w-3 fill-current" />
                <span className="hidden sm:inline">TRENDING</span>
                <span className="sm:hidden">TOP</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-3 sm:p-4 md:p-6">
        <Link className="flex-1" href={`/products/${product._id}`}>
          <h3 className="mb-3 font-medium font-outfit text-gray-900 text-xs leading-relaxed tracking-wide transition-colors duration-300 hover:text-gray-600 sm:mb-4 sm:text-sm md:text-base lg:text-lg">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-baseline gap-2 sm:gap-3">
          <div className="flex flex-col">
            <span className="font-light font-outfit text-gray-500 text-xs tracking-wider">
              QAR
            </span>
            <span className="font-light font-outfit text-gray-900 text-sm tracking-wide sm:text-base md:text-lg lg:text-xl">
              {displayPrice.toFixed(2)}
            </span>
          </div>
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
