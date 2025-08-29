import Image from 'next/image';
import Link from 'next/link';
import { mockProducts } from '@/data/mock-data';

const MAX_PURCHASES: number = 6;

export default function PastPurchases() {
  const purchases = mockProducts.slice(0, MAX_PURCHASES);

  return (
    <section>
      <h2 className="mb-3 font-light font-playfair text-gray-900 text-lg sm:text-xl">
        Your past purchases
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {purchases.map((product) => (
          <Link
            className="group block border border-gray-200 bg-white p-2 transition-shadow hover:shadow-sm"
            href={`/products/${product._id}`}
            key={product._id}
          >
            <div className="overflow-hidden bg-gray-50">
              <Image
                alt={product.name}
                className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-32 md:h-36"
                height={144}
                src={product.images[0]}
                width={144}
              />
            </div>
            <p className="mt-2 truncate font-light font-outfit text-gray-900 text-sm">
              {product.name}
            </p>
            <p className="font-light font-outfit text-gray-600 text-xs">
              QAR {product.sellingPrice.toFixed(2)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
