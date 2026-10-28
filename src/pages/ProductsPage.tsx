import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { ProductGrid } from '../components/product/ProductGrid';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Sync state if URL search params change
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const q = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearchQuery(q);
  }, [searchParams]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
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

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        const matchesCategory =
          selectedCategory === 'all' || product.categoryId === selectedCategory;

        // Search query filter (matches name, tamilName, category, or description)
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          product.name.toLowerCase().includes(q) ||
          (product.tamilName && product.tamilName.toLowerCase().includes(q)) ||
          product.categoryName.toLowerCase().includes(q) ||
          product.shortDescription.toLowerCase().includes(q) ||
          product.origin.toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const priceA = a.weightOptions[0]?.price || 0;
        const priceB = b.weightOptions[0]?.price || 0;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default: featured first
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [selectedCategory, searchQuery, sortBy]);

  const currentCategoryData = categories.find((c) => c.id === selectedCategory);

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
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
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

      {/* Filter Status & Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
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

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        emptyMessage={`No products found matching "${searchQuery}". Try searching for Naatu Sakkarai, Mappillai Samba, Honey, or Almonds.`}
      />
    </div>
  );
};
