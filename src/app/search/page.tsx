'use client';

import {
  ChevronDown,
  Grid3X3,
  List,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { categories, mockProducts } from '@/data/mock-data';

const MAX_PRICE = 300;
const MIN_PRICE = 0;

const materials = ['Porcelain', 'Ceramic', 'Glass', 'Metal', 'Wood'];
const brands = ['Oryx', 'Premium', 'Classic', 'Modern'];
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name A-Z' },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({
    min: MIN_PRICE,
    max: MAX_PRICE,
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  useEffect(() => {
    let filtered = mockProducts;

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.material?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.some((category) =>
          product.categories.includes(category)
        )
      );
    }

    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((product) =>
        selectedMaterials.some((material) =>
          product.material?.toLowerCase().includes(material.toLowerCase())
        )
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.some((brand) =>
          product.brand?.toLowerCase().includes(brand.toLowerCase())
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
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [
    searchQuery,
    selectedCategories,
    selectedMaterials,
    selectedBrands,
    priceRange,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedBrands([]);
    setPriceRange({ min: MIN_PRICE, max: MAX_PRICE });
    setSortBy('relevance');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    selectedMaterials.length > 0 ||
    selectedBrands.length > 0 ||
    priceRange.min > MIN_PRICE ||
    priceRange.max < MAX_PRICE;

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="mb-8 text-center">
            <h1 className="mb-4 font-light font-playfair text-3xl text-gray-900 tracking-wide sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
              SEARCH PRODUCTS
            </h1>
            <div className="mx-auto h-px w-16 bg-gray-300 sm:w-20 md:w-24 lg:w-28" />
          </div>

          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-6 h-5 w-5 transform text-gray-400" />
              <input
                className="w-full border border-gray-200 bg-white py-4 pr-6 pl-16 font-light font-outfit text-gray-900 text-lg placeholder-gray-400 transition-all duration-300 focus:border-gray-900 focus:ring-0"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for premium kitchen essentials..."
                type="text"
                value={searchQuery}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-16 md:pb-20 lg:pb-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            <div
              className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}
            >
              <div className="sticky top-6 space-y-8">
                <div className="flex items-center justify-between lg:hidden">
                  <h2 className="font-light font-outfit text-gray-900 text-lg">
                    Filters
                  </h2>
                  <button
                    className="p-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setShowFilters(false)}
                    type="button"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="border-gray-200 border-b pb-4">
                  <p className="font-light font-outfit text-gray-600 text-sm">
                    {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-light font-outfit text-base text-gray-900">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-light font-outfit text-gray-600 text-sm">
                        QAR {priceRange.min}
                      </span>
                      <span className="font-light font-outfit text-gray-600 text-sm">
                        QAR {priceRange.max}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <input
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                        max={MAX_PRICE}
                        min={MIN_PRICE}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            min: Number(e.target.value),
                          })
                        }
                        type="range"
                        value={priceRange.min}
                      />
                      <input
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                        max={MAX_PRICE}
                        min={MIN_PRICE}
                        onChange={(e) =>
                          setPriceRange({
                            ...priceRange,
                            max: Number(e.target.value),
                          })
                        }
                        type="range"
                        value={priceRange.max}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-light font-outfit text-base text-gray-900">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        className="flex cursor-pointer items-center space-x-3"
                        key={category}
                      >
                        <input
                          checked={selectedCategories.includes(category)}
                          className="h-4 w-4 border border-gray-300 text-gray-900 focus:ring-gray-900"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([
                                ...selectedCategories,
                                category,
                              ]);
                            } else {
                              setSelectedCategories(
                                selectedCategories.filter((c) => c !== category)
                              );
                            }
                          }}
                          type="checkbox"
                        />
                        <span className="font-light font-outfit text-gray-700 text-sm capitalize">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-light font-outfit text-base text-gray-900">
                    Materials
                  </h3>
                  <div className="space-y-2">
                    {materials.map((material) => (
                      <label
                        className="flex cursor-pointer items-center space-x-3"
                        key={material}
                      >
                        <input
                          checked={selectedMaterials.includes(material)}
                          className="h-4 w-4 border border-gray-300 text-gray-900 focus:ring-gray-900"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMaterials([
                                ...selectedMaterials,
                                material,
                              ]);
                            } else {
                              setSelectedMaterials(
                                selectedMaterials.filter((m) => m !== material)
                              );
                            }
                          }}
                          type="checkbox"
                        />
                        <span className="font-light font-outfit text-gray-700 text-sm">
                          {material}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-light font-outfit text-base text-gray-900">
                    Brands
                  </h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label
                        className="flex cursor-pointer items-center space-x-3"
                        key={brand}
                      >
                        <input
                          checked={selectedBrands.includes(brand)}
                          className="h-4 w-4 border border-gray-300 text-gray-900 focus:ring-gray-900"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(
                                selectedBrands.filter((b) => b !== brand)
                              );
                            }
                          }}
                          type="checkbox"
                        />
                        <span className="font-light font-outfit text-gray-700 text-sm">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    className="w-full border border-gray-300 bg-white px-4 py-3 font-light font-outfit text-gray-700 text-sm transition-colors hover:bg-gray-50"
                    onClick={clearAllFilters}
                    type="button"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <button
                    className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 font-light font-outfit text-gray-700 text-sm hover:border-gray-300 lg:hidden"
                    onClick={() => setShowFilters(true)}
                    type="button"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>

                  {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-light font-outfit text-gray-600 text-sm">
                        Active filters:
                      </span>
                      {selectedCategories.map((category) => (
                        <span
                          className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 font-light font-outfit text-gray-700 text-sm"
                          key={category}
                        >
                          {category}
                          <button
                            className="hover:text-gray-900"
                            onClick={() =>
                              setSelectedCategories(
                                selectedCategories.filter((c) => c !== category)
                              )
                            }
                            type="button"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="inline-flex min-w-[180px] items-center justify-between border border-gray-200 bg-white px-4 py-2 font-light font-outfit text-gray-700 text-sm transition-colors hover:border-gray-300 hover:bg-gray-50">
                        <span>
                          {sortOptions.find((option) => option.value === sortBy)
                            ?.label || 'Sort by'}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 border border-gray-200 bg-white shadow-lg"
                    >
                      {sortOptions.map((option) => (
                        <DropdownMenuItem
                          className="cursor-pointer px-3 py-2 font-light text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                        >
                          <span
                            className={
                              sortBy === option.value ? 'text-gray-900' : ''
                            }
                          >
                            {option.label}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex border border-gray-200">
                    <button
                      className={`p-2 ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setViewMode('grid')}
                      type="button"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      className={`p-2 ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setViewMode('list')}
                      type="button"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-10'
                      : 'space-y-6'
                  }
                >
                  {filteredProducts.map((product) =>
                    viewMode === 'grid' ? (
                      <ProductCard key={product._id} product={product} />
                    ) : (
                      <div
                        className="border border-gray-200 bg-white p-6"
                        key={product._id}
                      >
                        <div className="flex gap-6">
                          <div className="h-32 w-32 flex-shrink-0">
                            <Image
                              alt={product.name}
                              className="h-full w-full object-cover"
                              height={128}
                              src={product.images[0]}
                              width={128}
                            />
                          </div>
                          <div className="flex-1">
                            <Link href={`/products/${product._id}`}>
                              <h3 className="mb-2 font-light font-outfit text-gray-900 text-lg hover:text-gray-700">
                                {product.name}
                              </h3>
                            </Link>
                            <p className="mb-4 line-clamp-2 font-light font-outfit text-gray-600 text-sm">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-baseline gap-2">
                                <span className="font-light font-outfit text-gray-500 text-sm">
                                  QAR
                                </span>
                                <span className="font-light font-outfit text-gray-900 text-xl">
                                  {product.sellingPrice.toFixed(2)}
                                </span>
                              </div>
                              <Link
                                className="border border-gray-900 bg-gray-900 px-4 py-2 font-light font-outfit text-sm text-white hover:border-gray-800 hover:bg-gray-800"
                                href={`/products/${product._id}`}
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <Search className="mx-auto mb-6 h-16 w-16 text-gray-300" />
                  <h3 className="mb-4 font-light font-playfair text-gray-900 text-xl">
                    No products found
                  </h3>
                  <p className="mx-auto mb-8 max-w-md font-light font-outfit text-gray-600 text-sm">
                    Try adjusting your search criteria or clearing some filters
                    to see more products.
                  </p>
                  <button
                    className="inline-flex items-center bg-gray-900 px-6 py-3 font-light font-outfit text-white transition-colors hover:bg-gray-800"
                    onClick={clearAllFilters}
                    type="button"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
