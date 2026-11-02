import React from 'react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Sparkles, PackageSearch } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  subtitle,
  emptyMessage = 'No traditional essentials found matching your criteria.',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="my-8">
        {title && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2 border-b border-cream-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-forest-800 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Handpicked Tradition</span>
              </div>
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-forest-950">
                {title}
              </h2>
            </div>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-cream-200 p-4 shadow-card flex flex-col animate-pulse"
            >
              <div className="aspect-square bg-cream-200 rounded-xl mb-4" />
              <div className="h-4 bg-cream-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-cream-100 rounded w-1/3 mb-3" />
              <div className="h-6 bg-cream-100 rounded w-full mt-auto mb-2" />
              <div className="h-8 bg-cream-200 rounded-xl w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-3xl border border-cream-200 my-8 shadow-sm max-w-lg mx-auto">
        <div className="w-16 h-16 bg-cream-100 text-forest-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <PackageSearch className="w-8 h-8" />
        </div>
        <h3 className="font-serif font-bold text-xl text-slate-800 mb-2">No Products Found</h3>
        <p className="text-sm text-slate-500 mb-6">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2 border-b border-cream-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-forest-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Handpicked Tradition</span>
            </div>
            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-forest-950">
              {title}
            </h2>
          </div>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
