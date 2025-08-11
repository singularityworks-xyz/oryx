import { useState, useEffect, useCallback, useMemo } from 'react';

export interface Product {
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
  discountPercentage?: number;
  createdAt?: string;
}

export interface FilterState {
  inStockOnly: boolean;
  onSale: boolean;
  trending: boolean;
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  filtering: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  totalProducts: number;
}

export interface ProductsFiltersState {
  searchTerm: string;
  selectedCategory: string;
  selectedSort: string;
  priceRange: [number, number];
  filters: FilterState;
}

// Custom hook for debounced search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useProducts() {
  const [state, setState] = useState<ProductsState>({
    products: [],
    loading: true,
    filtering: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    hasMore: true,
    totalProducts: 0,
  });

  const [filters, setFilters] = useState<ProductsFiltersState>({
    searchTerm: '',
    selectedCategory: '',
    selectedSort: 'featured',
    priceRange: [0, 10000],
    filters: {
      inStockOnly: false,
      onSale: false,
      trending: false,
    },
  });

  const [showFilters, setShowFilters] = useState(false);

  // Debounce search term to reduce API calls
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500);
  
  // Debounce price range to reduce API calls
  const debouncedPriceRange = useDebounce(filters.priceRange, 800);

  // Memoize static arrays to prevent unnecessary re-renders
  const categories = useMemo(() => [
    'All Categories',
    'Kitchen Essentials',
    'Dining Collection',
    'Tableware',
    'Cutlery',
    'Serveware',
    'Storage Solutions'
  ], []);

  const sortOptions = useMemo(() => [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'trending', label: 'Trending Now' },
    { value: 'discount', label: 'Best Deals' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ], []);

  const fetchProducts = useCallback(async (page: number = 1, retryCount = 0) => {
    try {
      setState(prev => ({ ...prev, filtering: true }));
      setState(prev => ({ ...prev, error: null }));
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '40',
      });

      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }

      if (filters.selectedCategory && filters.selectedCategory !== 'All Categories') {
        params.append('category', filters.selectedCategory);
      }

      if (filters.selectedSort !== 'featured') {
        params.append('sort', filters.selectedSort);
      }

      if (debouncedPriceRange[0] > 0 || debouncedPriceRange[1] < 10000) {
        if (debouncedPriceRange[0] > 0) params.append('minPrice', debouncedPriceRange[0].toString());
        if (debouncedPriceRange[1] < 10000) params.append('maxPrice', debouncedPriceRange[1].toString());
      }

      // Add new filter parameters
      if (filters.filters.inStockOnly) {
        params.append('inStockOnly', 'true');
      }
      if (filters.filters.onSale) {
        params.append('onSale', 'true');
      }
      if (filters.filters.trending) {
        params.append('trending', 'true');
      }

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (response.ok) {
        setState(prev => ({
          ...prev,
          products: data.products || [],
          totalPages: data.pagination?.pages || 1,
          hasMore: data.pagination?.hasNext || false,
          currentPage: page,
          totalProducts: data.pagination?.total || 0,
        }));
      } else {
        const errorMessage = data.error || data.message || 'Failed to fetch products';
        
        // If it's a 503 error and we haven't retried yet, try again
        if (response.status === 503 && retryCount < 2) {
          console.log(`Retrying fetch (attempt ${retryCount + 1})...`);
          setTimeout(() => {
            fetchProducts(page, retryCount + 1);
          }, 1000 * (retryCount + 1)); // Exponential backoff
          return;
        }
        
        setState(prev => ({ ...prev, error: errorMessage }));
        console.error('Failed to fetch products:', errorMessage);
        setState(prev => ({ ...prev, products: [], totalProducts: 0 }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      
      // If we haven't retried yet, try again
      if (retryCount < 2) {
        console.log(`Retrying fetch due to error (attempt ${retryCount + 1})...`);
        setTimeout(() => {
          fetchProducts(page, retryCount + 1);
        }, 1000 * (retryCount + 1)); // Exponential backoff
        return;
      }
      
      setState(prev => ({ ...prev, error: errorMessage }));
      console.error('Error fetching products:', error);
      setState(prev => ({ ...prev, products: [], totalProducts: 0 }));
    } finally {
      setState(prev => ({ ...prev, loading: false, filtering: false }));
    }
  }, [debouncedSearchTerm, filters.selectedCategory, filters.selectedSort, debouncedPriceRange, filters.filters]);

  useEffect(() => {
    setState(prev => ({ ...prev, totalProducts: 0 }));
    fetchProducts(1);
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, currentPage: 1, totalProducts: 0 }));
    fetchProducts(1);
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = category === 'All Categories' ? '' : category;
    setFilters(prev => ({ ...prev, selectedCategory: newCategory }));
    setState(prev => ({ ...prev, currentPage: 1, totalProducts: 0 }));
    fetchProducts(1);
  };

  const handleSortChange = (sort: string) => {
    setFilters(prev => ({ ...prev, selectedSort: sort }));
    setState(prev => ({ ...prev, currentPage: 1, totalProducts: 0 }));
    fetchProducts(1);
  };

  const handleFilterChange = (filterType: keyof FilterState, value: boolean) => {
    setFilters(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterType]: value
      }
    }));
    setState(prev => ({ ...prev, currentPage: 1, totalProducts: 0 }));
    // Don't fetch immediately, let user apply filters
  };

  const applyFilters = () => {
    setState(prev => ({ ...prev, currentPage: 1, totalProducts: 0 }));
    fetchProducts(1);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      selectedCategory: '',
      selectedSort: 'featured',
      priceRange: [0, 10000],
      filters: {
        inStockOnly: false,
        onSale: false,
        trending: false
      },
    });
    setState(prev => ({ ...prev, currentPage: 1, totalProducts: 0 }));
    fetchProducts(1);
  };

  const handlePageChange = (page: number) => {
    if (page !== state.currentPage && !state.loading) {
      setState(prev => ({ ...prev, currentPage: page }));
      fetchProducts(page);
      // Scroll to top when changing pages
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const updateSearchTerm = (term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  };

  const updatePriceRange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return {
    // State
    ...state,
    filters,
    showFilters,
    categories,
    sortOptions,
    
    // Actions
    handleSearch,
    handleCategoryChange,
    handleSortChange,
    handleFilterChange,
    applyFilters,
    clearFilters,
    handlePageChange,
    updateSearchTerm,
    updatePriceRange,
    toggleFilters,
    fetchProducts,
  };
}
