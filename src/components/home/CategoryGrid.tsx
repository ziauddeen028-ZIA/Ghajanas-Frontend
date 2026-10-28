import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  return (
    <section className="my-14">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.id}`}
            className="group relative bg-white rounded-2xl overflow-hidden border border-cream-200/90 p-4 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center"
          >
            {/* Image Circle */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3.5 border-2 border-cream-200 group-hover:border-forest-600 transition-colors shadow-sm">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Category Name */}
            <h3 className="font-serif font-bold text-slate-900 text-sm sm:text-base mb-1 group-hover:text-forest-800 transition-colors line-clamp-1">
              {cat.name}
            </h3>

            {cat.tamilName && (
              <p className="text-[11px] font-semibold text-emerald-800 mb-1 line-clamp-1">
                {cat.tamilName}
              </p>
            )}

            <p className="text-xs text-slate-400 mt-auto">
              {cat.itemCount} Varieties Available
            </p>

            <span className="mt-2.5 text-[11px] font-bold text-forest-700 group-hover:text-amber-600 transition-colors inline-flex items-center gap-1">
              Shop Now <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
