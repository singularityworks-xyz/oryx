'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

interface Product {
  _id: string;
  productId?: string;
  name: string;
  description: string;
  sellingPrice?: number;
  costPrice?: number;
  discount?: number;
  images: string[];
  categories?: string[];
  stock: number;
  tags?: string[];
  isTrending?: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categories = [
    'All Categories',
    'Kitchen Essentials',
    'Dining Collection',
    'Tableware',
    'Cutlery',
    'Serveware',
    'Storage Solutions'
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'trending', label: 'Trending Now' }
  ];

  const fetchProducts = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      if (selectedSort !== 'featured') {
        params.append('sort', selectedSort);
      }

      if (priceRange[0] > 0 || priceRange[1] < 10000) {
        if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString());
        if (priceRange[1] < 10000) params.append('maxPrice', priceRange[1].toString());
      }

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (response.ok) {
        if (append) {
          setProducts(prev => [...prev, ...(data.products || [])]);
        } else {
          setProducts(data.products || []);
        }
        setTotalPages(data.pagination?.pages || 1);
        setHasMore(data.pagination?.hasNext || false);
        setCurrentPage(page);
      } else {
        const errorMessage = data.error || data.message || 'Failed to fetch products';
        setError(errorMessage);
        console.error('Failed to fetch products:', errorMessage);
        if (!append) {
          setProducts([]);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      setError(errorMessage);
      console.error('Error fetching products:', error);
      if (!append) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedSort, priceRange]);

  useEffect(() => {
    fetchProducts(1, false);
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === 'All Categories' ? '' : category);
    setCurrentPage(1);
    fetchProducts(1, false);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setCurrentPage(1);
    fetchProducts(1, false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSort('featured');
    setPriceRange([0, 10000]);
    setCurrentPage(1);
    fetchProducts(1, false);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchProducts(currentPage + 1, true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-playfair font-light text-gray-900 mb-8 tracking-wide">
              SHOP COLLECTION
            </h1>
            <div className="w-24 lg:w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-8"></div>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-outfit font-light leading-relaxed">
              Discover our curated selection of premium kitchen essentials, each piece crafted with attention to detail and timeless elegance.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Controls Section */}
      <section className="py-8 lg:py-12 bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                 <input
                   type="text"
                   placeholder="Search for premium kitchen essentials..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-16 pr-6 py-4 lg:py-5 bg-gray-50 border border-gray-200 rounded-none focus:ring-0 focus:border-gray-300 focus:bg-white transition-all duration-300 text-lg font-outfit font-light placeholder-gray-400 text-gray-900"
                 />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-6 py-2 hover:bg-gray-800 transition-colors duration-300 font-outfit font-light tracking-wide"
                >
                  Search
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
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-3 px-6 py-3 border border-gray-200 hover:border-gray-300 transition-colors duration-300 font-outfit font-light tracking-wide text-gray-900"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </button>

                             {/* Category Dropdown */}
               <div className="relative">
                 <select
                   value={selectedCategory || 'All Categories'}
                   onChange={(e) => handleCategoryChange(e.target.value)}
                   className="appearance-none px-6 py-3 border border-gray-200 hover:border-gray-300 transition-colors duration-300 font-outfit font-light tracking-wide bg-white cursor-pointer pr-12 text-gray-900"
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
                   value={selectedSort}
                   onChange={(e) => handleSortChange(e.target.value)}
                   className="appearance-none px-6 py-3 border border-gray-200 hover:border-gray-300 transition-colors duration-300 font-outfit font-light tracking-wide bg-white cursor-pointer pr-12 text-gray-900"
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
           {(searchTerm || selectedCategory || selectedSort !== 'featured') && (
             <div className="mt-6 flex flex-wrap items-center gap-3">
               <span className="text-sm font-outfit font-light text-gray-600">Active filters:</span>
               {searchTerm && (
                 <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
                   Search: "{searchTerm}"
                   <button 
                     onClick={() => {
                       setSearchTerm('');
                       setCurrentPage(1);
                       fetchProducts(1, false);
                     }} 
                     className="hover:text-gray-900"
                   >
                     <X className="w-3 h-3" />
                   </button>
                 </span>
               )}
               {selectedCategory && (
                 <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
                   Category: {selectedCategory}
                   <button 
                     onClick={() => {
                       setSelectedCategory('');
                       setCurrentPage(1);
                       fetchProducts(1, false);
                     }} 
                     className="hover:text-gray-900"
                   >
                     <X className="w-3 h-3" />
                   </button>
                 </span>
               )}
               {selectedSort !== 'featured' && (
                 <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm font-outfit font-light">
                   Sort: {sortOptions.find(opt => opt.value === selectedSort)?.label}
                   <button 
                     onClick={() => {
                       setSelectedSort('featured');
                       setCurrentPage(1);
                       fetchProducts(1, false);
                     }} 
                     className="hover:text-gray-900"
                   >
                     <X className="w-3 h-3" />
                   </button>
                 </span>
               )}
               <button
                 onClick={clearFilters}
                 className="text-sm font-outfit font-light text-gray-500 hover:text-gray-700 underline"
               >
                 Clear all
               </button>
             </div>
           )}

           {/* Loading Indicator for Filters */}
           {loading && products.length > 0 && (
             <div className="mt-6 text-center">
               <div className="inline-flex items-center gap-2 text-sm font-outfit font-light text-gray-600">
                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                 Updating results...
               </div>
             </div>
           )}
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
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
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-gray-300 font-outfit font-light"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-4 py-3 border border-gray-200 focus:ring-0 focus:border-gray-300 font-outfit font-light"
                    />
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
                        checked={selectedCategory === category}
                        onChange={() => handleCategoryChange(category)}
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
                    <input type="checkbox" className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-500" />
                    <span className="font-outfit font-light text-gray-700">In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-500" />
                    <span className="font-outfit font-light text-gray-700">On Sale</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-500" />
                    <span className="font-outfit font-light text-gray-700">Trending</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

             {/* Products Section */}
       <section className="py-16 lg:py-24">
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
           {/* Loading State */}
           {loading && products.length === 0 && (
             <div className="text-center py-16">
               <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-6"></div>
               <p className="text-lg font-outfit font-light text-gray-600">Loading premium products...</p>
             </div>
           )}

           {/* Error State */}
           {error && products.length === 0 && (
             <div className="text-center py-16">
               <div className="mb-6">
                 <p className="text-lg font-outfit font-light text-red-600 mb-4">{error}</p>
                 <button 
                   onClick={() => fetchProducts(1, false)}
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
                 {totalPages > 1 && (
                   <span className="ml-2 text-gray-500">(Page {currentPage} of {totalPages})</span>
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
                 onClick={clearFilters}
                 className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-outfit font-light hover:bg-gray-800 transition-colors duration-300 border border-gray-900 hover:border-gray-800"
               >
                 Clear Filters
               </button>
             </div>
           )}

           {/* Load More Button */}
           {!loading && !error && hasMore && (
             <div className="text-center mt-16">
               <button 
                 onClick={loadMore}
                 disabled={loading}
                 className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-outfit font-light text-lg hover:bg-gray-800 transition-all duration-300 border border-gray-900 hover:border-gray-800 tracking-widest hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {loading ? 'Loading...' : 'Load More Products'}
               </button>
             </div>
           )}
         </div>
       </section>
    </div>
  );
} 