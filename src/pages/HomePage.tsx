import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { ProductGrid } from '../components/product/ProductGrid';
import { products } from '../data/products';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { generateWhatsAppLink } from '../utils/whatsapp';

export const HomePage: React.FC = () => {
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);
  const riceAndMillets = products.filter(
    (p) => p.categoryId === 'heritage-rice' || p.categoryId === 'millets'
  );

  const whatsappBannerUrl = generateWhatsAppLink(
    '🌿 Hello NJ Essentials! I am browsing your store and would like assistance with ordering traditional groceries.'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Hero Section */}
      <HeroBanner />

      {/* Explore Categories */}
      <CategoryGrid />

      {/* Featured Products */}
      <section className="my-14">
        <ProductGrid
          products={featuredProducts}
          title="Featured Traditional Essentials"
          subtitle="Our most loved heirloom rice, country sugar, raw honey, and royal dates"
        />
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-bold text-sm shadow-md transition-all group"
          >
            <span>Explore All {products.length} Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* WhatsApp Fast Ordering Banner */}
      <section className="my-14 rounded-3xl bg-gradient-to-r from-emerald-800 via-forest-900 to-forest-950 text-white p-8 sm:p-12 border border-emerald-700 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Prefer Ordering via Chat?
          </span>
          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-white leading-tight">
            Order All Your Groceries Directly On WhatsApp
          </h2>
          <p className="text-cream-200 text-sm sm:text-base leading-relaxed">
            Send us your grocery list or simply tap the WhatsApp button on any product. Our friendly team
            will pack your essentials, calculate discounts, and share door delivery tracking.
          </p>
          <div className="pt-2">
            <a
              href={whatsappBannerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-slate-950" />
              <span>Send Grocery List on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Heritage Rice & Millets Showcase */}
      <section className="my-14">
        <ProductGrid
          products={riceAndMillets.slice(0, 4)}
          title="Heritage Rice & Nutrient Millets"
          subtitle="Grown with native seeds, unpolished, packed with zinc and natural iron"
        />
      </section>

      {/* Why Choose Us Trust Pillars */}
      <WhyChooseUs />
    </div>
  );
};
