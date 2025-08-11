import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { ProductsFiltersState, FilterState } from '@/hooks/useProducts';

interface ProductsSearchProps {
  filters: ProductsFiltersState;
  filtering: boolean;
  showFilters: boolean;
  categories: string[];
  sortOptions: { value: string; label: string }[];
  onSearch: (e: React.FormEvent) => void;
  onSearchTermChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onFilterChange: (filterType: keyof FilterState, value: boolean) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

export default function ProductsSearch({
  filters,
  filtering,
  showFilters,
  categories,
  sortOptions,
  onSearch,
  onSearchTermChange,
  onCategoryChange,
  onSortChange,
  onFilterChange,
  onClearFilters,
  onToggleFilters,
  onPriceRangeChange,
}: ProductsSearchProps) {
  const hasActiveFilters = 
    filters.searchTerm || 
    filters.selectedCategory || 
    filters.selectedSort !== 'featured' || 
    filters.filters.inStockOnly || 
    filters.filters.onSale || 
    filters.filters.trending || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 10000;

  return (
    <section className="py-8 lg:py-12 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={onSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for premium kitchen essentials..."
                value={filters.searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="w-full pl-16 pr-6 py-4 lg:py-5 bg-gray-50 border border-gray-200 rounded-none focus:ring-0 focus:border-gray-300 focus:bg-white transition-all duration-300 text-lg font-outfit font-light placeholder-gray-400 text-gray-900"
              />
              <button
                type="submit"
                disabled={filtering}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-6 py-2 hover:bg-gray-800 transition-colors duration-300 font-outfit font-light tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {filtering ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left Side - Filters and Category */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filter Toggle */}
            <button
              onClick={onToggleFilters}
              disabled={filtering}
              className="inline-flex items-center gap-3 px-6 py-3 border border-gray-200 hover:border-gray-300 transition-colors duration-300 font-outfit font-light tracking-wide text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={filters.selectedCategory || 'All Categories'}
                onChange={(e) => onCategoryChange(e.target.value)}
                disabled={filtering}
                className="appearance-none px-6 py-3 border border-gray-200 hover:border-gray-300 transition-colors duration-300 font-outfit font-light tracking-wide bg-white cursor-pointer pr-12 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="text-gray-900">
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Right Side - Sort and View Toggle */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.selectedSort}
                onChange={(e) => onSortChange(e.target.value)}
                disabled={filtering}
                className="appearance-none px-6 py-3 border border-gray-200 hover:border-gray-300 transition-colors duration-300 font-outfit font-light tracking-wide bg-white cursor-pointer pr-12 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="text-gray-900">
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-outfit font-light text-gray-600">Active filters:</span>
            {filters.searchTerm && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
                Search: &ldquo;{filters.searchTerm}&rdquo;
                <button 
                  onClick={() => onSearchTermChange('')} 
                  className="hover:text-gray-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.selectedCategory && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
                Category: {filters.selectedCategory}
                <button 
                  onClick={() => onCategoryChange('')} 
                  className="hover:text-gray-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.selectedSort !== 'featured' && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
                Sort: {sortOptions.find(opt => opt.value === filters.selectedSort)?.label}
                <button 
                  onClick={() => onSortChange('featured')} 
                  className="hover:text-gray-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
                Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                <button 
                  onClick={() => onPriceRangeChange([0, 10000])} 
                  className="hover:text-gray-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.filters.inStockOnly && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
                In Stock Only
                <button 
                  onClick={() => onFilterChange('inStockOnly', false)} 
                  className="hover:text-gray-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.filters.onSale && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
                On Sale
                <button 
                  onClick={() => onFilterChange('onSale', false)} 
                  className="hover:text-gray-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.filters.trending && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
                Trending
                <button 
                  onClick={() => onFilterChange('trending', false)} 
                  className="hover:text-gray-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={onClearFilters}
              className="text-sm font-outfit font-light text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Loading Indicator for Filters */}
        {filtering && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-sm font-outfit font-light text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              Updating results...
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
