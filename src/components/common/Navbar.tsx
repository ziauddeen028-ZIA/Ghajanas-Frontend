import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  MapPin,
  Menu,
  X,
  Phone,
  MessageCircle,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  User,
  LogOut,
  Package,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { LocationModal } from './LocationModal';
import { STORE_PHONE_NUMBER, generateWhatsAppLink } from '../../utils/whatsapp';
import { formatCurrency } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const { totalItemCount, subtotal, setIsCartOpen } = useCart();
  const { user, isAdmin, logout, profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Tiruchirappalli (620019)');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleCartClick = () => {
    if (!user) {
      // Require login for cart access
      navigate('/login', { state: { from: { pathname: '/cart' } } });
    } else {
      setIsCartOpen(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const displayName = profile?.fullName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'My Account';

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Essentials', path: '/products' },
    { label: 'Naatu Sakkarai', path: '/products?category=sweeteners' },
    { label: 'Traditional Rice', path: '/products?category=heritage-rice' },
    { label: 'Millets', path: '/products?category=millets' },
    { label: 'Pure Honey', path: '/products?category=honey' },
    { label: 'Dates & Nuts', path: '/products?category=dates-dryfruits' },
  ];

  const whatsappDirectUrl = generateWhatsAppLink(
    '🌿 Hello NJ Essentials! I would like to inquire about your traditional groceries and available stock.'
  );

  return (
    <>
      {/* Top Banner */}
      <div className="bg-forest-950 text-cream-200 text-xs py-2 px-4 border-b border-forest-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              100% Traditional & Organic
            </span>
            <span className="hidden sm:inline text-cream-300">
              Free delivery on orders above ₹500 across South India
            </span>
          </div>
          <div className="flex items-center gap-4 text-cream-300">
            <a
              href={`tel:${STORE_PHONE_NUMBER}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Customer Care:</span> +91 98765 43210
            </a>
            <span className="text-forest-700">|</span>
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-cream-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300 border border-forest-700">
                <span className="font-serif font-black text-xl text-amber-400">NJ</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-extrabold text-xl sm:text-2xl tracking-tight text-forest-950 leading-tight">
                  NJ Essentials
                </span>
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-forest-700 uppercase">
                  Pure • Traditional • Natural
                </span>
              </div>
            </Link>

            {/* Location Selector */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 border border-cream-300 text-xs text-left transition-colors"
            >
              <div className="p-1 rounded-full bg-forest-900 text-white">
                <MapPin className="w-3 h-3" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-500">Deliver to</p>
                <p className="font-bold text-slate-800 truncate max-w-[140px] flex items-center gap-0.5">
                  {selectedLocation}
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </p>
              </div>
            </button>

            {/* Search Bar (Desktop) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex flex-1 max-w-md relative items-center"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Naatu Sakkarai, Mappillai Samba, Honey, Dates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-cream-100 hover:bg-cream-50 focus:bg-white text-sm text-slate-800 placeholder-slate-400 pl-10 pr-24 py-2.5 rounded-full border border-cream-300 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20 outline-none transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold rounded-full transition-colors shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Customer Account / Sign In */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 border border-cream-300 text-xs text-slate-800 font-semibold transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-forest-900 text-amber-400 flex items-center justify-center">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">{displayName}</span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-cream-200 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-cream-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/my-orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-cream-50 hover:text-forest-900"
                        >
                          <Package className="w-4 h-4 text-forest-700" />
                          <span>My Orders</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            <span>Admin Portal</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-cream-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="px-3.5 py-2 bg-cream-100 hover:bg-cream-200 text-forest-950 border border-cream-300 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-forest-800" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Cart Button (Requires Login) */}
              <button
                onClick={handleCartClick}
                className="relative flex items-center gap-2.5 px-3.5 py-2 bg-forest-900 hover:bg-forest-950 text-white rounded-xl shadow-md hover:shadow-lg transition-all group"
                aria-label="View shopping cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  {totalItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                      {totalItemCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] text-cream-300 uppercase font-semibold">My Cart</span>
                  <span className="text-xs font-extrabold text-amber-300">
                    {subtotal > 0 ? formatCurrency(subtotal) : '₹0'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-2.5 lg:hidden relative">
            <input
              type="text"
              placeholder="Search Naatu Sakkarai, Rice, Honey..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream-100 text-sm text-slate-800 placeholder-slate-400 pl-9 pr-20 py-2 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-forest-800 text-white text-xs font-semibold rounded-lg"
            >
              Search
            </button>
          </form>
        </div>

        {/* Secondary Category Navigation Bar (Desktop) */}
        <nav className="hidden lg:block border-t border-cream-200 bg-cream-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ul className="flex items-center gap-1 py-1.5 text-xs font-semibold text-slate-700 overflow-x-auto">
              {navLinks.map((link) => {
                const isActive = location.pathname + location.search === link.path;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-forest-800 text-white'
                          : 'hover:bg-cream-200 text-slate-700'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="ml-auto">
                <span className="flex items-center gap-1 text-[11px] font-medium text-forest-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Farm-Gate Tested Purity
                </span>
              </li>
            </ul>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-cream-200 bg-white px-4 py-4 space-y-3 shadow-lg animate-fade-in">
            {/* User Profile on Mobile */}
            <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{displayName}</p>
                      <p className="text-[10px] text-slate-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                  <div className="pt-2 border-t border-cream-200 flex flex-wrap gap-2">
                    <Link
                      to="/my-orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-1.5 bg-forest-900 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>My Orders</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold inline-flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin Portal</span>
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-forest-900 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Customer Sign In / Register</span>
                </Link>
              )}
            </div>

            <button
              onClick={() => {
                setIsLocationModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-cream-100 text-xs"
            >
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-forest-700" />
                <span>Deliver to: <strong>{selectedLocation}</strong></span>
              </div>
              <span className="text-forest-700 font-bold">Change</span>
            </button>

            <div className="border-t border-cream-200 pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Categories
              </p>
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-cream-100 hover:text-forest-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-cream-200">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Chat & Order on WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />
    </>
  );
};
