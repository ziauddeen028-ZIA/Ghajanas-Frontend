import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  Truck,
  Leaf,
  Award,
} from 'lucide-react';
import { STORE_PHONE_NUMBER, generateWhatsAppLink } from '../../utils/whatsapp';

export const Footer: React.FC = () => {
  const whatsappUrl = generateWhatsAppLink('🌿 Hello NJ Essentials! I would like to get more information about your products.');

  return (
    <footer className="bg-forest-950 text-cream-200 pt-16 pb-8 border-t-4 border-amber-500">
      {/* Trust & Quality Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-forest-900/80 border border-forest-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Native & Pure</h4>
              <p className="text-xs text-cream-300">No chemical bleaching</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Direct Farmer Source</h4>
              <p className="text-xs text-cream-300">Fair trade with delta growers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fast Doorstep Delivery</h4>
              <p className="text-xs text-cream-300">Free above ₹500</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hygienic Packing</h4>
              <p className="text-xs text-cream-300">Moisture-sealed freshness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-800/80">
        {/* Brand Col */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-forest-950 font-serif font-black text-xl flex items-center justify-center shadow-md">
              NJ
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-2xl text-white tracking-tight">
                NJ Essentials
              </span>
              <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                Pure • Traditional • Natural
              </span>
            </div>
          </Link>

          <p className="text-sm text-cream-300 leading-relaxed pr-4">
            Inspired by authentic Tamil agricultural roots and natural living. We bring heirloom
            Naatu Sakkarai, traditional rice varieties like Mappillai Samba and Karuppu Kavuni,
            wholesome millets, unheated forest honey, and royal dates directly from village mills to
            your kitchen.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-white text-base mb-4 tracking-wide">
            Explore Categories
          </h4>
          <ul className="space-y-2 text-sm text-cream-300">
            <li>
              <Link to="/products?category=sweeteners" className="hover:text-amber-400 transition-colors">
                Naatu Sakkarai & Vellam
              </Link>
            </li>
            <li>
              <Link to="/products?category=heritage-rice" className="hover:text-amber-400 transition-colors">
                Traditional Heritage Rice
              </Link>
            </li>
            <li>
              <Link to="/products?category=millets" className="hover:text-amber-400 transition-colors">
                Millets & Ancient Grains
              </Link>
            </li>
            <li>
              <Link to="/products?category=honey" className="hover:text-amber-400 transition-colors">
                Pure Western Ghats Honey
              </Link>
            </li>
            <li>
              <Link to="/products?category=dates-dryfruits" className="hover:text-amber-400 transition-colors">
                Medjool Dates & Dry Fruits
              </Link>
            </li>
            <li>
              <Link to="/products?category=nuts-seeds" className="hover:text-amber-400 transition-colors">
                Cashews, Almonds & Seeds
              </Link>
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="font-serif font-bold text-white text-base mb-4 tracking-wide">
            Customer Care
          </h4>
          <ul className="space-y-2 text-sm text-cream-300">
            <li>
              <Link to="/products" className="hover:text-amber-400 transition-colors">
                All Products Catalog
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-amber-400 transition-colors">
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="hover:text-amber-400 transition-colors">
                Checkout & Delivery
              </Link>
            </li>
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                Bulk / Wedding Inquiries
              </a>
            </li>
            <li>
              <a href="#about-nj" className="hover:text-amber-400 transition-colors">
                About Our Farmers
              </a>
            </li>
          </ul>
        </div>

        {/* Store Info */}
        <div>
          <h4 className="font-serif font-bold text-white text-base mb-4 tracking-wide">
            Store & Helpdesk
          </h4>
          <div className="space-y-3 text-xs text-cream-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                137C, Thanjavur Main Road, Opposite Urumu College, Kattur, Tiruchirappalli, Tamil Nadu - 620019
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <a href={`tel:${STORE_PHONE_NUMBER}`} className="hover:text-white">
                +91 98765 43210
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a href="mailto:orders@njessentials.in" className="hover:text-white">
                orders@njessentials.in
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Mon – Sat: 9:00 AM – 8:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-400">
        <p>© {new Date().getFullYear()} NJ Essentials. All rights reserved. Handcrafted with care.</p>
        <div className="flex items-center gap-4 text-xs">
          <span>100% Traditional Groceries</span>
          <span>•</span>
          <span>Secure WhatsApp Ordering</span>
          <span>•</span>
          <span>Tamil Nadu & South India</span>
        </div>
      </div>
    </footer>
  );
};
