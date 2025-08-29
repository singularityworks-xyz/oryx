import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockProducts } from '@/data/mock-data';

const PERCENTAGE_MULTIPLIER = 100;

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const resolvedParams = await params;
  const product = mockProducts.find((p) => p._id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  const displayPrice = product.sellingPrice || product.costPrice || 0;
  const originalPrice = product.costPrice || product.sellingPrice || 0;
  const discount = product.discount || 0;
  const discountPercentage =
    originalPrice > 0
      ? Math.round((discount / originalPrice) * PERCENTAGE_MULTIPLIER)
      : 0;

  const similar = mockProducts
    .filter((p) => p._id !== product._id)
    .map((p) => ({
      item: p,
      overlap: p.categories.filter((c) => product.categories.includes(c))
        .length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    // biome-ignore lint/style/noMagicNumbers: TODO
    .slice(0, 8)
    .map(({ item }) => item);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="py-4">
            <Link
              className="inline-flex items-center font-light font-outfit text-gray-600 text-sm hover:text-gray-900 sm:text-base"
              href="/products"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </div>
        </div>
      </div>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="grid grid-cols-1 gap-8 sm:gap-12 md:gap-16 lg:grid-cols-2 lg:gap-20">
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <Image
                  alt={product.name}
                  className="h-full w-full object-cover"
                  height={600}
                  src={product.images[0]}
                  width={600}
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(1).map((image, index) => (
                    <div
                      className="aspect-square overflow-hidden rounded-lg bg-gray-100"
                      key={image}
                    >
                      <Image
                        alt={`${product.name} view ${index + 2}`}
                        className="h-full w-full object-cover"
                        height={150}
                        src={image}
                        width={150}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div>
                <h1 className="mb-4 font-light font-playfair text-2xl text-gray-900 sm:text-3xl md:text-4xl">
                  {product.name}
                </h1>
                <div className="mb-4 flex items-baseline gap-4">
                  <span className="font-light font-outfit text-2xl text-gray-900 sm:text-3xl">
                    QAR {displayPrice.toFixed(2)}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="font-light font-outfit text-gray-400 text-lg line-through">
                      QAR {originalPrice.toFixed(2)}
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="rounded bg-red-50 px-2 py-1 font-light font-outfit text-red-600 text-sm">
                      -{discountPercentage}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="prose prose-sm sm:prose max-w-none font-light font-outfit text-gray-600">
                <p className="text-base leading-relaxed sm:text-lg">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4 border-gray-200 border-t pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-light font-outfit text-gray-500">
                      SKU:
                    </span>
                    <span className="ml-2 font-light font-outfit text-gray-900">
                      {product.sku}
                    </span>
                  </div>
                  <div>
                    <span className="font-light font-outfit text-gray-500">
                      Stock:
                    </span>
                    <span className="ml-2 font-light font-outfit text-gray-900">
                      {product.stock} available
                    </span>
                  </div>
                  <div>
                    <span className="font-light font-outfit text-gray-500">
                      Brand:
                    </span>
                    <span className="ml-2 font-light font-outfit text-gray-900">
                      {product.brand}
                    </span>
                  </div>
                  <div>
                    <span className="font-light font-outfit text-gray-500">
                      Material:
                    </span>
                    <span className="ml-2 font-light font-outfit text-gray-900">
                      {product.material}
                    </span>
                  </div>
                  <div>
                    <span className="font-light font-outfit text-gray-500">
                      Weight:
                    </span>
                    <span className="ml-2 font-light font-outfit text-gray-900">
                      {product.weight} kg
                    </span>
                  </div>
                  <div>
                    <span className="font-light font-outfit text-gray-500">
                      Warranty:
                    </span>
                    <span className="ml-2 font-light font-outfit text-gray-900">
                      {product.warranty}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-light font-outfit text-gray-500">
                    Dimensions:
                  </span>
                  <span className="ml-2 font-light font-outfit text-gray-900">
                    {product.dimensions?.length} × {product.dimensions?.width} ×{' '}
                    {product.dimensions?.height} cm
                  </span>
                </div>

                <div>
                  <span className="font-light font-outfit text-gray-500">
                    Categories:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <span
                        className="rounded bg-gray-100 px-2 py-1 font-light font-outfit text-gray-600 text-xs"
                        key={category}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  className="mb-4 w-full cursor-not-allowed bg-gray-400 px-8 py-4 font-light font-outfit text-base text-white sm:text-lg"
                  disabled
                  type="button"
                >
                  Add to Cart - Coming Soon
                </button>
                <p className="text-center font-light font-outfit text-gray-500 text-xs">
                  Shopping functionality will be available in future updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="pb-12 sm:pb-16 md:pb-20 lg:pb-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="mb-6 sm:mb-8">
              <h2 className="font-light font-playfair text-2xl text-gray-900 sm:text-3xl">
                Similar products
              </h2>
              <div className="mt-3 h-px w-16 bg-gray-300 sm:w-20" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {similar.map((sp) => (
                <Link
                  className="group block border border-gray-200 bg-white p-2 transition-shadow hover:shadow-sm"
                  href={`/products/${sp._id}`}
                  key={sp._id}
                >
                  <div className="relative aspect-square w-full bg-gray-50">
                    <Image
                      alt={sp.name}
                      className="object-cover"
                      fill
                      src={sp.images[0]}
                    />
                  </div>
                  <p className="mt-2 truncate font-light font-outfit text-gray-900 text-sm">
                    {sp.name}
                  </p>
                  <p className="font-light font-outfit text-gray-600 text-xs">
                    QAR {sp.sellingPrice.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
