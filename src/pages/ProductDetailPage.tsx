import React, { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import type { WeightOption } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';
import { formatCurrency, calculateDiscountPercent } from '../utils/formatters';
import { createSingleProductWhatsAppMessage, generateWhatsAppLink } from '../utils/whatsapp';
import {
  Star,
  ShoppingBag,
  MessageCircle,
  MapPin,
  Check,
  ShieldCheck,
  Truck,
  Leaf,
  Plus,
  Minus,
  ArrowLeft,
  ChevronRight,
  PackageCheck,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif font-bold text-2xl text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The traditional essential you are looking for is currently unavailable or has moved.
        </p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-forest-900 text-white rounded-xl text-sm font-bold inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Products
        </Link>
      </div>
    );
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(
    product.weightOptions[0] || { id: 'default', label: '1 unit', price: 100, inStock: true }
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const discountPercent = calculateDiscountPercent(
    selectedWeight.price,
    selectedWeight.originalPrice
  );

  const handleAddToCart = () => {
    const currentPath = location.pathname + location.search;
    const added = addToCart(product, selectedWeight, quantity, currentPath);
    if (added) {
      setIsAddedFeedback(true);
      setTimeout(() => setIsAddedFeedback(false), 1800);
      setIsCartOpen(true);
    } else {
      navigate('/login', { state: { from: location } });
    }
  };

  const handleOrderOnWhatsApp = () => {
    const msg = createSingleProductWhatsAppMessage(product, selectedWeight, quantity);
    window.open(generateWhatsAppLink(msg), '_blank');
  };

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-forest-800 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link
          to={`/products?category=${product.categoryId}`}
          className="hover:text-forest-800 transition-colors"
        >
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
        {/* Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-50 border border-cream-200">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md">
                {discountPercent}% OFF
              </span>
            )}
            {product.isOrganic && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" />
                100% Pure & Unadulterated
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-forest-700 shadow-sm'
                      : 'border-cream-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions Column */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Category & Origin */}
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
            <span className="px-2.5 py-1 bg-forest-100 text-forest-800 rounded-lg font-bold uppercase tracking-wider">
              {product.categoryName}
            </span>
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Sourced from: <strong>{product.origin}</strong>
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-forest-950 mb-1 leading-tight">
            {product.name}
          </h1>

          {product.tamilName && (
            <p className="text-base font-semibold text-emerald-800 mb-3">
              {product.tamilName}
            </p>
          )}

          {/* Ratings */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-cream-200">
            <div className="flex items-center text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-900 ml-1.5">{product.rating}</span>
            </div>
            <span className="text-xs text-slate-500">
              Based on {product.reviewCount} verified customer reviews
            </span>
          </div>

          {/* Short Description */}
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {product.shortDescription}
          </p>

          {/* Weight Variant Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Choose Weight / Packaging:
              </label>
              <span className="text-xs text-forest-800 font-semibold">
                Selected: {selectedWeight.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.weightOptions.map((opt) => {
                const isSelected = selectedWeight.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedWeight(opt)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex flex-col items-start ${
                      isSelected
                        ? 'bg-forest-900 text-white shadow-md ring-2 ring-forest-700'
                        : 'bg-cream-100 hover:bg-cream-200 text-slate-800 border border-cream-300'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className={`text-[11px] font-semibold ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                      {formatCurrency(opt.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Price Display */}
          <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 mb-6 flex items-baseline gap-3">
            <span className="font-serif font-black text-3xl text-forest-950">
              {formatCurrency(selectedWeight.price * quantity)}
            </span>
            {selectedWeight.originalPrice && selectedWeight.originalPrice > selectedWeight.price && (
              <span className="text-sm text-slate-400 line-through">
                {formatCurrency(selectedWeight.originalPrice * quantity)}
              </span>
            )}
            <span className="text-xs text-slate-500 ml-auto flex items-center gap-1 font-semibold">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              {selectedWeight.inStock ? 'In Stock — Fresh Batch' : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity Stepper and Actions */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Quantity:
              </span>
              <div className="flex items-center border border-cream-300 rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-cream-100 text-slate-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-black text-slate-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 hover:bg-cream-100 text-slate-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedWeight.inStock}
                className="py-3.5 px-6 rounded-xl font-bold text-sm bg-forest-900 hover:bg-forest-950 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                {isAddedFeedback ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-amber-400" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleOrderOnWhatsApp}
                className="py-3.5 px-6 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Order on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Quick Assurance Badges */}
          <div className="pt-4 border-t border-cream-200 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500">
            <div className="p-2 rounded-xl bg-cream-50">
              <Truck className="w-4 h-4 text-forest-700 mx-auto mb-1" />
              <span>Doorstep Delivery</span>
            </div>
            <div className="p-2 rounded-xl bg-cream-50">
              <ShieldCheck className="w-4 h-4 text-forest-700 mx-auto mb-1" />
              <span>100% Native Seeds</span>
            </div>
            <div className="p-2 rounded-xl bg-cream-50">
              <Leaf className="w-4 h-4 text-forest-700 mx-auto mb-1" />
              <span>Chemical Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Deep Product Information */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-sm mb-12">
        <h3 className="font-serif font-extrabold text-xl text-forest-950 mb-4 pb-2 border-b border-cream-200">
          About this Traditional Product
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {product.description}
        </p>

        {/* Health Benefits List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-2xl bg-cream-50 border border-cream-200">
            <h4 className="font-serif font-bold text-base text-forest-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Key Health Benefits
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              {product.benefits.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nutrition and Processing Highlights */}
          {product.nutritionHighlights && (
            <div className="p-5 rounded-2xl bg-cream-50 border border-cream-200">
              <h4 className="font-serif font-bold text-base text-forest-900 mb-3 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                Nutritional Highlights
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(product.nutritionHighlights).map(([key, val]) => (
                  <div key={key} className="bg-white p-3 rounded-xl border border-cream-200">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">{key}</p>
                    <p className="text-sm font-bold text-slate-800">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="my-12">
          <ProductGrid
            products={relatedProducts}
            title="More from this Category"
            subtitle="Explore complementary traditional harvests and pantry essentials"
          />
        </section>
      )}
    </div>
  );
};
