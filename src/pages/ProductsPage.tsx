import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product, Category } from '../types';
import { getProducts, getCategories } from '../services/catalogApi';
import { ProductGrid } from '../components/product/ProductGrid';
import { Search, SlidersHorizontal, X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');

  const loadCatalogData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prodsData, catsData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(prodsData);
      setCategories(catsData);
    } catch (err: any) {
      console.error('Failed to load catalog data:', err);
      setError(err.message || 'Unable to connect to product catalog. Please retry.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalogData();
  }, [loadCatalogData]);

  // Sync state if URL search params change
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const q = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearchQuery(q);
  }, [searchParams]);

  const handleCategoryChange = (catIdentifier: string) => {
    setSelectedCategory(catIdentifier);
    const newParams = new URLSearchParams(searchParams);
    if (catIdentifier === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catIdentifier);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    const newParams = new URLSearchParams(searchParams);
    if (!q) {
      newParams.delete('search');
    } else {
      newParams.set('search', q);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setSearchParams({});
  };

  // Find active category by either id or slug
  const currentCategoryData = useMemo(() => {
    if (selectedCategory === 'all') return undefined;
    return categories.find(
      (c) => c.id === selectedCategory || c.slug === selectedCategory
    );
  }, [categories, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter: match either raw selectedCategory or currentCategoryData's id/slug
        const matchesCategory =
          selectedCategory === 'all' ||
          product.categoryId === selectedCategory ||
          product.categorySlug === selectedCategory ||
          (currentCategoryData &&
            (product.categoryId === currentCategoryData.id ||
              product.categorySlug === currentCategoryData.slug));

        // Search query filter (matches name, tamilName, category, description, origin)
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          product.name.toLowerCase().includes(q) ||
          (product.tamilName && product.tamilName.toLowerCase().includes(q)) ||
          product.categoryName.toLowerCase().includes(q) ||
          (product.shortDescription && product.shortDescription.toLowerCase().includes(q)) ||
          (product.description && product.description.toLowerCase().includes(q)) ||
          (product.origin && product.origin.toLowerCase().includes(q));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const priceA = a.weightOptions[0]?.price || 0;
        const priceB = b.weightOptions[0]?.price || 0;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        // Default: featured first
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, currentCategoryData, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-8 bg-forest-950 text-white rounded-3xl p-6 sm:p-10 border border-forest-800 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Farm-Direct Purity</span>
          </div>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-white">
            {currentCategoryData ? currentCategoryData.name : 'All Traditional Essentials'}
          </h1>
          {currentCategoryData?.tamilName && (
            <p className="text-amber-400 font-medium text-sm">
              {currentCategoryData.tamilName}
            </p>
          )}
          <p className="text-cream-300 text-xs sm:text-sm leading-relaxed">
            {currentCategoryData
              ? currentCategoryData.description
              : 'Browse our complete range of unbleached country sugars, native heritage rice varieties, unpolished millets, wild honey, and dry fruits.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-cream-200 shadow-sm mb-6 space-y-4">
        {/* Search input and Sort select */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Filter by product name, Tamil name, or origin..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-cream-50 hover:bg-cream-100/50 focus:bg-white text-sm rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-700/20"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <SlidersHorizontal className="w-4 h-4 text-forest-700" />
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-cream-50 text-slate-800 text-xs font-bold py-2 px-3 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-700/20 cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="pt-2 border-t border-cream-200">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'bg-cream-100 hover:bg-cream-200 text-slate-700 border border-cream-300'
              }`}
            >
              All Essentials ({products.length})
            </button>
            {categories.map((cat) => {
              const isSelected =
                selectedCategory === cat.id || selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug || cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-forest-900 text-white shadow-sm'
                      : 'bg-cream-100 hover:bg-cream-200 text-slate-700 border border-cream-300'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error State Banner */}
      {error && (
        <div className="p-6 my-6 text-center bg-rose-50 rounded-2xl border border-rose-200 text-rose-800">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <p className="text-sm font-semibold mb-3">{error}</p>
          <button
            onClick={loadCatalogData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Loading</span>
          </button>
        </div>
      )}

      {/* Filter Status & Count */}
      {!isLoading && !error && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-4 px-1">
          <p>
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> authentic products
          </p>

          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={handleClearFilters}
              className="text-forest-700 hover:text-forest-900 font-bold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        isLoading={isLoading}
        emptyMessage={
          searchQuery
            ? `No products found matching "${searchQuery}". Try searching for Naatu Sakkarai, Mappillai Samba, Honey, or Almonds.`
            : `No products available in this category yet. Please check back soon.`
        }
      />
    </div>
  );
};