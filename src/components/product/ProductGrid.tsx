import React from 'react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Sparkles, PackageSearch } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  subtitle,
  emptyMessage = 'No traditional essentials found matching your criteria.',
}) => {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
