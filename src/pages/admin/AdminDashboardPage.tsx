import React from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  ShoppingBag,
  Package,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  return (
    <AdminLayout
      title="Admin Dashboard Foundation"
      subtitle="Phase 1: Secure token verification & authorization active. Database persistence deferred to Phase 2."
    >
      <div className="space-y-6">
        {/* Phase 1 Status Banner */}
        <div className="p-5 rounded-2xl bg-forest-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-forest-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                Admin Authorization Foundation Active
              </h3>
              <p className="text-xs text-cream-200 mt-0.5">
                Backend Supabase token verification and role guards are fully enforced.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-forest-950 border border-forest-700 text-xs font-semibold text-emerald-300">
            <Lock className="w-3.5 h-3.5" />
            <span>401/403 Guards Active</span>
          </div>
        </div>

        {/* Stats Placeholder Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-cream-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-forest-700" />
            </div>
            <p className="font-serif font-extrabold text-2xl text-slate-900">Phase 1</p>
            <p className="text-[11px] text-slate-500 mt-1">Live DB counters in Phase 2</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-cream-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Payment Verification</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-serif font-extrabold text-2xl text-amber-700">UPI & COD</p>
            <p className="text-[11px] text-slate-500 mt-1">Manual admin verification ready</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-cream-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Product Catalog</span>
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-serif font-extrabold text-2xl text-slate-900">Active</p>
            <p className="text-[11px] text-slate-500 mt-1">Ready for Prisma model wiring</p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-cream-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Storage Engine</span>
              <Database className="w-4 h-4 text-blue-600" />
            </div>
            <p className="font-serif font-extrabold text-2xl text-blue-900">PostgreSQL</p>
            <p className="text-[11px] text-slate-500 mt-1">Schema arriving in Phase 2</p>
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-cream-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-forest-900 font-serif font-bold text-base">
              <Package className="w-5 h-5 text-forest-700" />
              <span>Products Management</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect current product catalog listings and preview inventory schema placeholders for Phase 2.
            </p>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:text-forest-950 pt-2"
            >
              <span>Go to Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-cream-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-forest-900 font-serif font-bold text-base">
              <ShoppingBag className="w-5 h-5 text-forest-700" />
              <span>Orders Management</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review customer orders placed during testing, verify payment status, and simulate order dispatch milestones.
            </p>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:text-forest-950 pt-2"
            >
              <span>Go to Orders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
