import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Category } from '../../types';
import { getCategories } from '../../services/catalogApi';
import { ArrowRight, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
      setError(err.message || 'Unable to load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="my-8 sm:my-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2 border-b border-cream-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-forest-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Farm Sourced Categories</span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-forest-950">
            Explore By Category
          </h2>
        </div>
        <Link
          to="/products"
          className="text-xs sm:text-sm font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1 transition-colors group"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-cream-200/90 p-4 shadow-card flex flex-col items-center text-center animate-pulse"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-cream-200 mb-3.5" />
              <div className="h-4 bg-cream-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-cream-100 rounded w-1/2 mb-3" />
              <div className="h-3 bg-cream-100 rounded w-1/3 mt-auto" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-50 rounded-2xl border border-rose-200 text-rose-800">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <p className="text-sm font-semibold mb-3">{error}</p>
          <button
            onClick={fetchCategories}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-cream-200 text-slate-500 text-sm">
          No categories found in store.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug || cat.id}`}
              className="group bg-white rounded-xl sm:rounded-2xl
  border border-cream-200/90
  p-3 sm:p-4
  shadow-sm hover:shadow-md
  transition-all duration-300
  flex flex-col items-center text-center"
            >
              {/* Category Image */}
              <div className="w-20 h-20 sm:w-28 sm:h-28
    rounded-xl overflow-hidden
    mb-2.5 sm:mb-3
    border border-cream-200
    group-hover:border-forest-600
    transition-colors shadow-sm
    bg-cream-100 flex items-center justify-center"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover
        group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <Sparkles className="w-7 h-7 text-forest-700" />
                )}
              </div>

              {/* Category Name */}
              <h3 className="font-serif font-bold text-slate-900
    text-xs sm:text-base
    mb-1 group-hover:text-forest-800
    transition-colors line-clamp-2"
              >
                {cat.name}
              </h3>

              {/* Tamil Name */}
              {cat.tamilName && (
                <p className="text-[10px] sm:text-xs
      font-semibold text-emerald-800 mb-1 line-clamp-1"
                >
                  {cat.tamilName}
                </p>
              )}

              {/* Available Varieties */}
              <p className="text-[10px] sm:text-xs text-slate-400">
                {cat.itemCount} {cat.itemCount === 1 ? 'Variety' : 'Varieties'} Available
              </p>

              {/* Shop Now */}
              <span className="mt-2 text-[10px] sm:text-xs
    font-bold text-forest-700
    group-hover:text-amber-600
    transition-colors inline-flex items-center gap-1"
              >
                Shop Now <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
