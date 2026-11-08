import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, Minus, Plus } from 'lucide-react';
import type { Product, WeightOption } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatCurrency, calculateDiscountPercent } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, removeFromCart, updateQuantity, cart, showToast } = useCart();
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(
    product.weightOptions[0] || {
      id: 'default',
      label: 'Standard',
      price: 100,
      inStock: true,
    }
  );
  const [isWeightDropdownOpen, setIsWeightDropdownOpen] = useState(false);

  const discountPercent = calculateDiscountPercent(
    selectedWeight.price,
    selectedWeight.originalPrice
  );

  const cartItem = cart.find(
    (item) => item.productId === product.id && item.selectedWeight.id === selectedWeight.id
  );
  const cartQty = cartItem?.quantity || 0;

  const handleWeightSelect = (opt: WeightOption) => {
    setSelectedWeight(opt);
    setIsWeightDropdownOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const dropdownRef = document.querySelector('.weight-dropdown-menu');
    const triggerRef = document.querySelector('.weight-dropdown-trigger');
    if (dropdownRef && !dropdownRef.contains(e.target as Node) &&
        triggerRef && !triggerRef.contains(e.target as Node)) {
      setIsWeightDropdownOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setIsWeightDropdownOpen(false);
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleIncrement = () => {
    if (!selectedWeight.inStock) return;
    if (selectedWeight.stockCount !== undefined && cartQty + 1 > selectedWeight.stockCount) return;
    addToCart(product, selectedWeight, 1);
    showToast('Quantity updated');
  };

  const handleDecrement = () => {
    if (cartQty <= 1) {
      removeFromCart(product.id, selectedWeight.id);
    } else {
      updateQuantity(product.id, selectedWeight.id, cartQty - 1);
      showToast('Quantity updated');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedWeight, 1);
    showToast('Product added to cart');
  };

  return (
    <div className="relative mb-0 self-start bg-white border border-cream-200 shadow-card rounded-2xl flex flex-col h-auto transition-all duration-300 group hover:shadow-card-hover overflow-visible">
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
        {discountPercent > 0 && (
          <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-md shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
        {product.badge && (
          <span className="px-2 py-1 bg-forest-900 text-cream-100 text-[10px] font-bold rounded-md shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      <Link
        to={`/product/${product.slug}`}
        className="block relative aspect-square overflow-hidden rounded-t-2xl bg-cream-50"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      <div className="p-3 sm:p-4 pb-16 flex flex-col">
        <Link to={`/product/${product.slug}`} className="block mb-2 group-hover:text-forest-800 transition-colors">
          <h3 className="font-serif font-bold text-slate-900 text-sm leading-tight line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="relative mb-3 z-50">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsWeightDropdownOpen(!isWeightDropdownOpen);
            }}
            className="weight-dropdown-trigger w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm font-medium text-forest-900 shadow-sm hover:border-amber-500 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none flex items-center justify-between transition-all"
          >
            <span>{selectedWeight.label}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isWeightDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isWeightDropdownOpen && (
            <div className="weight-dropdown-menu absolute z-[30] mt-1 w-full bg-white border border-cream-200 rounded-xl shadow-lg shadow-forest-500/10 py-2 overflow-hidden transition-all duration-200 ease-out">
              {product.weightOptions.map((opt) => {
                const isSelected = selectedWeight.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWeightSelect(opt);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-colors ${isSelected ? 'bg-amber-50 text-forest-900 font-bold border-l-2 border-l-amber-600' : 'text-slate-700 hover:bg-cream-50 hover:text-forest-900'}`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-serif font-extrabold text-amber-700 text-lg">
            {formatCurrency(selectedWeight.price)}
          </span>
          {selectedWeight.originalPrice && selectedWeight.originalPrice > selectedWeight.price && (
            <span className="text-slate-400 line-through text-xs">
              {formatCurrency(selectedWeight.originalPrice)}
            </span>
          )}
        </div>

        {cartQty > 0 ? (
          <div className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 bg-white border-2 border-amber-500 rounded-full px-3 py-1.5 shadow-xl transition-all duration-200">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={!selectedWeight.inStock}
              className="w-6 h-6 rounded-full bg-cream-50 flex items-center justify-center text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-serif font-bold text-forest-900 text-sm min-w-[16px] text-center">
              {cartQty}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={!selectedWeight.inStock || (selectedWeight.stockCount !== undefined && cartQty >= selectedWeight.stockCount)}
              className="w-6 h-6 rounded-full bg-cream-50 flex items-center justify-center text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedWeight.inStock}
            className={`absolute bottom-[-14px] left-1/2 -translate-x-1/2 z-40 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xl border-2 ${selectedWeight.inStock ? 'bg-white border-amber-600 hover:bg-amber-50 hover:border-amber-800 text-amber-600' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
