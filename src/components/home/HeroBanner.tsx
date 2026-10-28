import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Sparkles, ShieldCheck, Award } from 'lucide-react';
import { generateWhatsAppLink } from '../../utils/whatsapp';

export const HeroBanner: React.FC = () => {
  const whatsappUrl = generateWhatsAppLink(
    '🌿 Hello NJ Essentials! I want to explore your traditional grocery catalog and order via WhatsApp.'
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-forest-950 via-forest-900 to-emerald-950 text-white rounded-3xl my-6 border border-forest-800 shadow-2xl">
      {/* Decorative background blurs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 md:py-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column Text */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Farm-Fresh • Chemical-Free • Unpolished</span>
          </div>

          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-5xl leading-[1.15] text-white tracking-tight">
            Nourish Your Family With Pure, Traditional & Organic Essentials
          </h1>

          <p className="text-amber-300/90 font-medium text-sm sm:text-base tracking-wide">
            பாரம்பரிய ஆரோக்கியம், உங்கள் இல்லம் தேடி • Straight from Cauvery Delta & Western Ghats
          </p>

          <p className="text-cream-200/90 text-sm sm:text-base leading-relaxed max-w-xl">
            Rediscover the authentic taste and health of native Indian groceries. Handcrafted{' '}
            <strong className="text-white">Naatu Sakkarai</strong>, ancient red and black rice varieties like{' '}
            <strong className="text-white">Mappillai Samba</strong> &{' '}
            <strong className="text-white">Karuppu Kavuni</strong>, farm-direct millets, wild forest honey, and
            royal imported dates.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/products"
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
            >
              <span>Explore All Essentials</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Order on WhatsApp</span>
            </a>
          </div>

          {/* Key Trust Counters */}
          <div className="pt-6 border-t border-forest-800/80 grid grid-cols-3 gap-4 text-left">
            <div>
              <p className="font-serif font-black text-xl sm:text-2xl text-amber-400">100%</p>
              <p className="text-xs text-cream-300">Pure & Native</p>
            </div>
            <div>
              <p className="font-serif font-black text-xl sm:text-2xl text-amber-400">500+</p>
              <p className="text-xs text-cream-300">Delta Farmers</p>
            </div>
            <div>
              <p className="font-serif font-black text-xl sm:text-2xl text-amber-400">₹0 Fee</p>
              <p className="text-xs text-cream-300">Orders Above ₹500</p>
            </div>
          </div>
        </div>

        {/* Right Column Visual Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl border-2 border-forest-700/60 bg-forest-900/60 backdrop-blur-md p-3">
            <img
              src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
              alt="Organic Naatu Sakkarai and Traditional Rice"
              className="w-full h-72 sm:h-80 object-cover rounded-2xl"
            />
            {/* Overlay badge 1 */}
            <div className="absolute top-6 left-6 bg-forest-950/90 border border-forest-700 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <p className="text-[10px] text-cream-300 font-semibold uppercase">Zero Sulfur</p>
                <p className="text-xs font-bold text-white">Authentic Naatu Sakkarai</p>
              </div>
            </div>

            {/* Overlay badge 2 */}
            <div className="absolute bottom-6 right-6 bg-white/95 text-slate-900 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-xl">
              <div className="p-1.5 bg-amber-500/20 text-amber-600 rounded-lg">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-900">Tamil Nadu GI Harvests</p>
                <p className="text-[10px] text-slate-500 font-medium">Heirloom Rice & Karupatti</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
