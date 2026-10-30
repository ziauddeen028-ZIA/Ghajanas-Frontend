import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Check,
  MapPin,
  Sparkles,
} from 'lucide-react';
import type { Product, WeightOption } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatCurrency, calculateDiscountPercent } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(
    product.weightOptions[0] || {
      id: 'default',
      label: 'Standard',
      price: 100,
      inStock: true,
    }
  );
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const discountPercent = calculateDiscountPercent(
    selectedWeight.price,
    selectedWeight.originalPrice
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentPath = location.pathname + location.search;
    const added = addToCart(product, selectedWeight, 1, currentPath);
    if (added) {
      setIsAddedRecently(true);
      setTimeout(() => setIsAddedRecently(false), 1600);
    } else {
      navigate('/login', { state: { from: location } });
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-cream-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
        {product.badge && (
          <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider rounded-lg shadow-sm">
            {product.badge}
          </span>
        )}
        {product.isOrganic && (
          <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-md flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
            100% Pure
          </span>
        )}
      </div>

      {discountPercent > 0 && (
        <span className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-black rounded-lg">
          {discountPercent}% OFF
        </span>
      )}

      {/* Product Image */}
      <Link
        to={`/product/${product.slug}`}
        className="block relative aspect-square overflow-hidden bg-cream-50"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Origin & Category */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
          <span className="font-semibold text-forest-700 tracking-wide uppercase">
            {product.categoryName}
          </span>
          <span className="flex items-center gap-0.5 text-slate-400">
            <MapPin className="w-3 h-3 text-amber-600" />
            {product.origin.split(',')[0]}
          </span>
        </div>

        {/* Title */}
        <Link to={`/product/${product.slug}`} className="block mb-1 group-hover:text-forest-800 transition-colors">
          <h3 className="font-serif font-bold text-slate-900 text-base leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.tamilName && (
          <p className="text-xs font-medium text-emerald-800 mb-2">
            {product.tamilName}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-800 ml-1">{product.rating}</span>
          </div>
          <span className="text-xs text-slate-400">({product.reviewCount})</span>
        </div>

        {/* Weight Selector Pills */}
        <div className="mb-4 mt-auto">
          <span className="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Select Size / Weight:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {product.weightOptions.map((opt) => {
              const isSelected = selectedWeight.id === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedWeight(opt)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    isSelected
                      ? 'bg-forest-900 text-white shadow-sm ring-1 ring-forest-900'
                      : 'bg-cream-100 hover:bg-cream-200 text-slate-700 border border-cream-300'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-3 pt-2 border-t border-cream-200">
          <span className="font-serif font-extrabold text-xl text-forest-950">
            {formatCurrency(selectedWeight.price)}
          </span>
          {selectedWeight.originalPrice && selectedWeight.originalPrice > selectedWeight.price && (
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(selectedWeight.originalPrice)}
            </span>
          )}
          <span className="text-[11px] text-emerald-700 font-semibold ml-auto">
            {selectedWeight.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="w-full">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedWeight.inStock}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              isAddedRecently
                ? 'bg-emerald-600 text-white'
                : selectedWeight.inStock
                ? 'bg-forest-900 hover:bg-forest-950 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-4 h-4" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                Add to Cart
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};
