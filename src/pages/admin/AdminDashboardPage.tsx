import React from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  ShoppingBag,
  Package,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  return (
    <AdminLayout
      title="Admin Dashboard"
    >
      <div className="space-y-6">

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
