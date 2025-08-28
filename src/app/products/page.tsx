'use client';

import { ChevronDown, Filter, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/product-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { categories, mockProducts, sortOptions } from '@/data/mock-data';

const MAX_PRICE_RANGE = 300;

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: MAX_PRICE_RANGE,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  useEffect(() => {
    let filtered = mockProducts;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.categories.some((category) =>
            category.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.some((category) =>
          product.categories.includes(category)
        )
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.sellingPrice >= priceRange.min &&
        product.sellingPrice <= priceRange.max
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.sellingPrice - b.sellingPrice;
        case 'price-high':
          return b.sellingPrice - a.sellingPrice;
        case 'newest':
          return Number.parseInt(b._id, 10) - Number.parseInt(a._id, 10);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategories, sortBy, priceRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSortBy('name');
    setPriceRange({ min: 0, max: 300 });
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="mb-8 text-center sm:mb-12 md:mb-16 lg:mb-20">
            <h1 className="mb-4 font-light font-playfair text-2xl text-gray-900 tracking-wide sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              SHOP COLLECTION
            </h1>
            <div className="mx-auto h-px w-16 bg-gray-300 sm:w-20 md:w-24 lg:w-28" />
            <p className="mx-auto mt-4 max-w-xs px-2 font-light font-outfit text-gray-600 text-sm leading-relaxed sm:mt-6 sm:max-w-sm sm:px-0 sm:text-base md:max-w-xl md:text-lg lg:max-w-2xl">
              Discover our curated selection of premium kitchen essentials, each
              piece chosen for its quality, craftsmanship, and timeless design.
            </p>
          </div>
        </div>
      </section>

      <section className="border-gray-100 border-b bg-white py-6 shadow-sm sm:py-8 lg:py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="mb-6 hidden sm:mb-8 sm:block">
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-6 h-5 w-5 transform text-gray-400" />
                <input
                  className="w-full rounded-none border border-gray-200 bg-gray-50 py-4 pr-24 pl-16 font-light font-outfit text-base text-gray-900 placeholder-gray-400 transition-all duration-300 focus:border-gray-300 focus:bg-white focus:ring-0 lg:py-5 lg:text-lg"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for premium kitchen essentials..."
                  type="text"
                  value={searchTerm}
                />
                <button
                  className="-translate-y-1/2 absolute top-1/2 right-2 transform bg-gray-900 px-4 py-2 font-light font-outfit text-sm text-white tracking-wide transition-colors duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 lg:px-6"
                  disabled
                  type="button"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                className="inline-flex items-center justify-center gap-2 border border-gray-300 px-4 py-2.5 font-light font-outfit text-gray-700 text-sm tracking-wide transition-all duration-300 hover:bg-gray-50 focus:outline-none sm:gap-3 sm:px-6 sm:py-3 sm:text-base"
                onClick={() => setShowFilters(!showFilters)}
                type="button"
              >
                <Filter className="h-4 w-4 text-gray-700" />
                Filters
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}
                />
              </button>

              <div className="relative hidden sm:block">
                <Select
                  onValueChange={(val) =>
                    setSelectedCategories(val === 'all' ? [] : [val])
                  }
                  value={
                    selectedCategories.length === 1
                      ? selectedCategories[0]
                      : undefined
                  }
                >
                  <SelectTrigger className="rounded-none border-gray-300 bg-white px-4 py-2.5 text-gray-700">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-gray-200 bg-white">
                    <SelectItem className="text-gray-700" value="all">
                      All Categories
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        className="text-gray-700 capitalize"
                        key={category}
                        value={category}
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="hidden items-center sm:flex">
              <div className="relative w-full sm:w-auto">
                <Select onValueChange={setSortBy} value={sortBy}>
                  <SelectTrigger className="rounded-none border-gray-300 bg-white px-4 py-2.5 text-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-gray-200 bg-white">
                    {sortOptions.map((option) => (
                      <SelectItem
                        className="text-gray-700"
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 border border-gray-200 bg-white p-4 sm:p-6">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-medium font-outfit text-gray-700 text-sm">
                  Price Range
                </h3>
                <span className="font-light font-outfit text-gray-600 text-xs">
                  QAR {priceRange.min} - QAR {priceRange.max}
                </span>
              </div>
              <div className="py-3">
                <Slider
                  className="px-1"
                  max={MAX_PRICE_RANGE}
                  min={0}
                  onValueChange={(vals) =>
                    setPriceRange({
                      min: vals[0],
                      max: vals[1] ?? MAX_PRICE_RANGE,
                    })
                  }
                  step={1}
                  value={[priceRange.min, priceRange.max]}
                />
              </div>

              <div className="mt-2 flex justify-end gap-3">
                <button
                  className="border border-gray-300 bg-white px-4 py-2 font-light font-outfit text-gray-700 text-sm transition-all duration-300 hover:bg-gray-50 focus:outline-none"
                  onClick={() => setShowFilters(false)}
                  type="button"
                >
                  Close
                </button>
                <button
                  className="border border-gray-300 bg-gray-900 px-4 py-2 font-light font-outfit text-sm text-white transition-all duration-300 hover:bg-gray-800 focus:outline-none"
                  onClick={() => {
                    setShowFilters(false);
                  }}
                  type="button"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
            <div className="relative">
              <Select
                onValueChange={(val) =>
                  setSelectedCategories(val === 'all' ? [] : [val])
                }
                value={
                  selectedCategories.length === 1
                    ? selectedCategories[0]
                    : undefined
                }
              >
                <SelectTrigger className="h-10 w-full rounded-none border-gray-300 bg-white px-3 py-2 text-gray-700">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-gray-200 bg-white">
                  <SelectItem className="text-gray-700" value="all">
                    All Categories
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      className="text-gray-700 capitalize"
                      key={category}
                      value={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Select onValueChange={setSortBy} value={sortBy}>
                <SelectTrigger className="h-10 w-full rounded-none border-gray-300 bg-white px-3 py-2 text-gray-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-gray-200 bg-white">
                  {sortOptions.map((option) => (
                    <SelectItem
                      className="text-gray-700"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(searchTerm ||
            selectedCategories.length > 0 ||
            priceRange.min > 0 ||
            priceRange.max < MAX_PRICE_RANGE) && (
            <div className="mt-4 sm:mt-6">
              <div className="mb-3 sm:mb-0 sm:inline">
                <span className="font-light font-outfit text-gray-600 text-sm">
                  Active filters:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 font-light font-outfit text-gray-700 text-xs sm:gap-2 sm:px-3 sm:text-sm">
                    <span className="max-w-[120px] truncate sm:max-w-none">
                      Search: &quot;{searchTerm}&quot;
                    </span>
                    <button
                      className="flex-shrink-0 hover:text-gray-900"
                      onClick={() => setSearchTerm('')}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedCategories.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 font-light font-outfit text-gray-700 text-xs sm:gap-2 sm:px-3 sm:text-sm">
                    <span className="truncate">
                      Category: {selectedCategories[0]}
                    </span>
                    <button
                      className="flex-shrink-0 hover:text-gray-900"
                      onClick={() => setSelectedCategories([])}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {sortBy !== 'name' && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 font-light font-outfit text-gray-700 text-xs sm:gap-2 sm:px-3 sm:text-sm">
                    <span className="truncate">
                      Sort:{' '}
                      {sortOptions.find((opt) => opt.value === sortBy)?.label}
                    </span>
                    <button
                      className="flex-shrink-0 hover:text-gray-900"
                      onClick={() => setSortBy('name')}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {(priceRange.min > 0 || priceRange.max < MAX_PRICE_RANGE) && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 font-light font-outfit text-gray-700 text-xs sm:gap-2 sm:px-3 sm:text-sm">
                    <span className="truncate">
                      Price: QAR {priceRange.min} - QAR {priceRange.max}
                    </span>
                    <button
                      className="flex-shrink-0 hover:text-gray-900"
                      onClick={() =>
                        setPriceRange({ min: 0, max: MAX_PRICE_RANGE })
                      }
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  className="font-light font-outfit text-gray-500 text-xs underline hover:text-gray-700 sm:text-sm"
                  onClick={clearFilters}
                  type="button"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-10">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center sm:py-12 md:py-16">
              <div className="mb-4 sm:mb-6">
                <Search className="mx-auto h-12 w-12 text-gray-300 sm:h-16 sm:w-16 md:h-20 md:w-20" />
              </div>
              <h3 className="mb-3 font-light font-playfair text-gray-900 text-lg sm:mb-4 sm:text-xl md:text-2xl">
                No products found
              </h3>
              <p className="mx-auto mb-6 max-w-sm px-4 font-light font-outfit text-gray-600 text-sm leading-relaxed sm:mb-8 sm:max-w-md sm:px-0 sm:text-base">
                Try adjusting your search criteria or clearing some filters to
                see more products.
              </p>
              <button
                className="inline-flex items-center bg-gray-900 px-5 py-2.5 font-light font-outfit text-sm text-white transition-colors duration-300 hover:bg-gray-800 sm:px-6 sm:py-3 sm:text-base"
                onClick={clearFilters}
                type="button"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
