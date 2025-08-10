'use client';

import { useProducts } from '@/hooks/useProducts';
import { ProductsHero, ProductsSearch, ProductsFilters, ProductsGrid } from '@/components/products';

export default function ProductsPage() {
  const {
    // State
    products,
    loading,
    filtering,
    error,
    currentPage,
    totalPages,
    hasMore,
    totalProducts,
    filters,
    showFilters,
    categories,
    sortOptions,
    
    // Actions
    handleSearch,
    handleCategoryChange,
    handleSortChange,
    handleFilterChange,
    clearFilters,
    handlePageChange,
    updateSearchTerm,
    updatePriceRange,
    toggleFilters,
    fetchProducts,
  } = useProducts();

  return (
    <div className="min-h-screen bg-white">
      <ProductsHero />
      
      <ProductsSearch
        filters={filters}
        filtering={filtering}
        showFilters={showFilters}
        categories={categories}
        sortOptions={sortOptions}
        onSearch={handleSearch}
        onSearchTermChange={updateSearchTerm}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onToggleFilters={toggleFilters}
        onPriceRangeChange={updatePriceRange}
      />

      <ProductsFilters
        showFilters={showFilters}
        filters={filters}
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onFilterChange={handleFilterChange}
        onPriceRangeChange={updatePriceRange}
      />

      <ProductsGrid
        products={products}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        hasMore={hasMore}
        totalProducts={totalProducts}
        onPageChange={handlePageChange}
        onRetry={() => fetchProducts(1)}
        onClearFilters={clearFilters}
      />
    </div>
  );
} 