import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ProductGrid } from '../components/product/ProductGrid';
import type { Product } from '../types';
import { getProducts } from '../services/catalogApi';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw, AlertCircle, Leaf, Sprout, Truck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('Failed to load products for homepage:', err);
      setError(err.message || 'Unable to load products. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);
  const fallbackFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  const riceAndMillets = products.filter((p) => {
    const slug = (p.categorySlug || '').toLowerCase();
    const name = (p.categoryName || '').toLowerCase();
    const catId = (p.categoryId || '').toLowerCase();
    return (
      slug.includes('rice') ||
      slug.includes('millet') ||
      name.includes('rice') ||
      name.includes('millet') ||
      catId.includes('rice') ||
      catId.includes('millet')
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-[100px] sm:pt-0 sm:pb-4">
      {/* Hero Section */}
      <HeroBanner />

      {/* Explore Categories */}
      <CategoryGrid />

      {/* Error state if products fail to load */}
      {error && (
        <div className="p-6 my-8 text-center bg-rose-50 rounded-2xl border border-rose-200 text-rose-800">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <p className="text-sm font-semibold mb-3">{error}</p>
          <button
            onClick={fetchProducts}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Featured Products */}
      <section className="my-14">
        <ProductGrid
          products={fallbackFeatured}
          isLoading={isLoading}
          title="Featured Traditional Essentials"
          subtitle="Our most loved heirloom rice, country sugar, raw honey, and royal dates"
        />
        {!isLoading && products.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-bold text-sm shadow-md transition-all group"
            >
              <span>Explore All {products.length} Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </section>

      {/* Farm-to-Home Promotional Banner */}
      <section className="my-12 sm:my-14 rounded-3xl p-6 sm:p-8 lg:p-12 relative overflow-hidden text-white" style={{ backgroundImage: "url('/src/assets/footer-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 z-0 bg-forest-950/70" />
        <div className="max-w-2xl relative z-10 space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
            <Leaf className="w-3.5 h-3.5 text-amber-400" />
            FARM FRESH • NATURALLY SOURCED
          </span>
          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-white leading-tight">
            From Trusted Sources to Your Family's Table
          </h2>
          <p className="text-cream-200 text-sm sm:text-base leading-relaxed">
            We bring together traditional groceries and carefully selected natural products to make
            healthy living simpler. Discover authentic flavours, natural goodness and quality you can trust.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white rounded-lg text-xs font-medium border border-white/20">
              <Sprout className="w-3.5 h-3.5 text-amber-400" />
              <span>Traditional Groceries</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white rounded-lg text-xs font-medium border border-white/20">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Doorstep Delivery</span>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white text-forest-900 font-extrabold text-sm rounded-xl shadow-lg hover:bg-amber-100 hover:text-emerald-900 transition-all"
            >
              Explore Our Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Heritage Rice & Millets Showcase */}
      {(isLoading || riceAndMillets.length > 0) && (
        <section className="my-14">
          <ProductGrid
            products={riceAndMillets.slice(0, 4)}
            isLoading={isLoading}
            title="Heritage Rice & Nutrient Millets"
            subtitle="Grown with native seeds, unpolished, packed with zinc and natural iron"
          />
        </section>
      )}

      {/* Why Choose Us Trust Pillars */}
      <WhyChooseUs />
    </div>
  );
};
