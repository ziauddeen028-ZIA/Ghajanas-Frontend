import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode; title: string; subtitle?: string }> = ({
  children,
  title,
  subtitle,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="bg-forest-950 text-white border-b border-forest-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-forest-900 border border-forest-700 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-black text-lg tracking-tight">Ghajanas Admin</span>
              <span className="ml-2 text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full uppercase">
                Phase 1 Foundation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline text-cream-300">
              Logged in as: <strong className="text-white">{user?.email}</strong>
            </span>
            <Link
              to="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-cream-200 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <span>View Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="border-t border-forest-900/80 bg-forest-950/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                      isActive
                        ? 'border-amber-400 text-amber-300 bg-forest-900/40'
                        : 'border-transparent text-cream-300 hover:text-white hover:border-forest-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-extrabold text-2xl text-forest-950">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <Link
            to="/"
            className="text-xs font-bold text-forest-800 hover:text-forest-950 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to storefront</span>
          </Link>
        </div>

        {children}
      </main>
    </div>
  );
};

