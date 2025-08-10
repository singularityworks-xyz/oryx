import { ProductsFilters, FilterState } from '@/hooks/useProducts';

interface ProductsFiltersProps {
  showFilters: boolean;
  filters: ProductsFilters;
  categories: string[];
  onCategoryChange: (category: string) => void;
  onFilterChange: (filterType: keyof FilterState, value: boolean) => void;
  onPriceRangeChange: (range: [number, number]) => void;
}

export default function ProductsFilters({
  showFilters,
  filters,
  categories,
  onCategoryChange,
  onFilterChange,
  onPriceRangeChange,
}: ProductsFiltersProps) {
  if (!showFilters) return null;

  return (
    <section className="py-8 bg-gray-50/50 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Price Range */}
          <div>
            <h3 className="text-lg font-outfit font-medium text-gray-900 mb-4 tracking-wide">Price Range</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0]}
                  onChange={(e) => onPriceRangeChange([Number(e.target.value) || 0, filters.priceRange[1]])}
                  className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-gray-300 font-outfit font-light text-gray-600"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1]}
                  onChange={(e) => onPriceRangeChange([filters.priceRange[0], Number(e.target.value) || 10000])}
                  className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-gray-300 font-outfit font-light text-gray-600"
                />
              </div>
              <div className="text-sm text-gray-500 font-outfit font-light">
                Current range: QAR {filters.priceRange[0]} - QAR {filters.priceRange[1]}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-outfit font-medium text-gray-900 mb-4 tracking-wide">Categories</h3>
            <div className="space-y-3">
              {categories.slice(1).map((category) => (
                <label key={category} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.selectedCategory === category}
                    onChange={() => onCategoryChange(category)}
                    className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-500"
                  />
                  <span className="font-outfit font-light text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div>
            <h3 className="text-lg font-outfit font-medium text-gray-900 mb-4 tracking-wide">Additional Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.filters.inStockOnly} 
                  onChange={(e) => onFilterChange('inStockOnly', e.target.checked)} 
                  className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-500" 
                />
                <span className="font-outfit font-light text-gray-700">In Stock Only</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.filters.onSale} 
                  onChange={(e) => onFilterChange('onSale', e.target.checked)} 
                  className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-500" 
                />
                <span className="font-outfit font-light text-gray-700">On Sale</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.filters.trending} 
                  onChange={(e) => onFilterChange('trending', e.target.checked)} 
                  className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-500" 
                />
                <span className="font-outfit font-light text-gray-700">Trending</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
