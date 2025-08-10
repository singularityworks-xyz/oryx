import ProductCard from '@/components/ProductCard';
import { Product } from '@/hooks/useProducts';
import Pagination from './Pagination';

interface ProductsGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  totalProducts?: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onClearFilters: () => void;
}

export default function ProductsGrid({
  products,
  loading,
  error,
  currentPage,
  totalPages,
  hasMore,
  totalProducts,
  onPageChange,
  onRetry,
  onClearFilters,
}: ProductsGridProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Loading State */}
        {loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-6"></div>
            <p className="text-lg font-outfit font-light text-gray-600">Loading the best cutlery...</p>
          </div>
        )}

        {/* Page Loading State */}
        {loading && products.length > 0 && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-sm font-outfit font-light text-gray-600">Loading page {currentPage}...</p>
          </div>
        )}

        {/* Error State */}
        {error && products.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-6">
              <p className="text-lg font-outfit font-light text-red-600 mb-4">{error}</p>
              <button 
                onClick={onRetry}
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-outfit font-light hover:bg-gray-800 transition-colors duration-300 border border-gray-900 hover:border-gray-800"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-12">
            <p className="text-lg font-outfit font-light text-gray-600">
              Showing <span className="font-medium text-gray-900">{products.length}</span> products
              {totalProducts && totalProducts > products.length && (
                <span className="ml-2 text-gray-500">of {totalProducts} total</span>
              )}
              {totalPages > 1 && (
                <span className="ml-2 text-gray-500">(Page {currentPage} of {totalPages})</span>
              )}
              {totalPages > 1 && (
                <span className="ml-2 text-gray-500">• Up to 40 products per page</span>
              )}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* No Products State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg font-outfit font-light text-gray-600 mb-6">
              No products found matching your criteria.
            </p>
            <button 
              onClick={onClearFilters}
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-outfit font-light hover:bg-gray-800 transition-colors duration-300 border border-gray-900 hover:border-gray-800"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            loading={loading}
          />
        )}
      </div>
    </section>
  );
}
