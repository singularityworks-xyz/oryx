'use client';

import { ChevronDown, Filter, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/product-card';
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
      <section className="bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="mb-12 text-center sm:mb-16 md:mb-20">
            <h1 className="mb-6 font-light font-playfair text-3xl text-gray-900 tracking-wide sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              SHOP COLLECTION
            </h1>
            <div className="mx-auto h-px w-20 bg-gray-300 sm:w-24 md:w-28 lg:w-32" />
            <p className="mx-auto mt-6 max-w-xs px-4 font-light font-outfit text-gray-600 text-sm leading-relaxed sm:mt-8 sm:max-w-sm sm:px-0 sm:text-base md:max-w-xl md:text-lg lg:max-w-2xl">
              Discover our curated selection of premium kitchen essentials, each
              piece chosen for its quality, craftsmanship, and timeless design.
            </p>
          </div>
        </div>
      </section>

      <section className="border-gray-100 border-b bg-white py-8 shadow-sm lg:py-12">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="mb-8">
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-6 h-5 w-5 transform text-gray-400" />
                <input
                  className="w-full rounded-none border border-gray-200 bg-gray-50 py-4 pr-6 pl-16 font-light font-outfit text-gray-900 text-lg placeholder-gray-400 transition-all duration-300 focus:border-gray-300 focus:bg-white focus:ring-0 lg:py-5"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for premium kitchen essentials..."
                  type="text"
                  value={searchTerm}
                />
                <button
                  className="-translate-y-1/2 absolute top-1/2 right-2 transform bg-gray-900 px-6 py-2 font-light font-outfit text-white tracking-wide transition-colors duration-300 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled
                  type="button"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                className="inline-flex items-center gap-3 border border-gray-200 px-6 py-3 font-light font-outfit text-gray-900 tracking-wide transition-colors duration-300 hover:border-gray-300"
                onClick={() => setShowFilters(!showFilters)}
                type="button"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}
                />
              </button>

              <div className="relative">
                <select
                  className="cursor-pointer appearance-none border border-gray-200 bg-white px-6 py-3 pr-12 font-light font-outfit text-gray-900 tracking-wide transition-colors duration-300 hover:border-gray-300"
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedCategories([e.target.value]);
                    } else {
                      setSelectedCategories([]);
                    }
                  }}
                  value={
                    selectedCategories.length === 1 ? selectedCategories[0] : ''
                  }
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option
                      className="text-gray-900 capitalize"
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-4 h-4 w-4 transform text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  className="cursor-pointer appearance-none border border-gray-200 bg-white px-6 py-3 pr-12 font-light font-outfit text-gray-900 tracking-wide transition-colors duration-300 hover:border-gray-300"
                  onChange={(e) => setSortBy(e.target.value)}
                  value={sortBy}
                >
                  {sortOptions.map((option) => (
                    <option
                      className="text-gray-900"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-4 h-4 w-4 transform text-gray-400" />
              </div>
            </div>
          </div>

          {(searchTerm ||
            selectedCategories.length > 0 ||
            priceRange.min > 0 ||
            priceRange.max < MAX_PRICE_RANGE) && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="font-light font-outfit text-gray-600 text-sm">
                Active filters:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 font-light font-outfit text-gray-700 text-sm">
                  Search: &quot;{searchTerm}&quot;
                  <button
                    className="hover:text-gray-900"
                    onClick={() => setSearchTerm('')}
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedCategories.length > 0 && (
                <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 font-light font-outfit text-gray-700 text-sm">
                  Category: {selectedCategories[0]}
                  <button
                    className="hover:text-gray-900"
                    onClick={() => setSelectedCategories([])}
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {sortBy !== 'name' && (
                <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 font-light font-outfit text-gray-700 text-sm">
                  Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label}
                  <button
                    className="hover:text-gray-900"
                    onClick={() => setSortBy('name')}
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(priceRange.min > 0 || priceRange.max < MAX_PRICE_RANGE) && (
                <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 font-light font-outfit text-gray-700 text-sm">
                  Price: QAR {priceRange.min} - QAR {priceRange.max}
                  <button
                    className="hover:text-gray-900"
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
                className="font-light font-outfit text-gray-500 text-sm underline hover:text-gray-700"
                onClick={clearFilters}
                type="button"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 md:gap-10 lg:grid-cols-4 lg:gap-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center sm:py-16">
              <div className="mb-6">
                <Search className="mx-auto h-16 w-16 text-gray-300 sm:h-20 sm:w-20" />
              </div>
              <h3 className="mb-4 font-light font-playfair text-gray-900 text-xl sm:text-2xl">
                No products found
              </h3>
              <p className="mx-auto mb-8 max-w-md font-light font-outfit text-gray-600 text-sm sm:text-base">
                Try adjusting your search criteria or clearing some filters to
                see more products.
              </p>
              <button
                className="inline-flex items-center bg-gray-900 px-6 py-3 font-light font-outfit text-white transition-colors duration-300 hover:bg-gray-800"
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
