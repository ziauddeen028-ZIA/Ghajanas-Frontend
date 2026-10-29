import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { products } from '../../data/products';
import { formatCurrency } from '../../utils/formatters';
import { Sparkles, Plus, AlertCircle } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  return (
    <AdminLayout
      title="Products Management (Phase 1 Preview)"
      subtitle="Previewing catalog items. Full database CRUD, image uploads, and inventory syncing will be implemented in Phase 2."
    >
      <div className="space-y-6">
        {/* Placeholder Info Callout */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Phase 1 Placeholder Page</p>
            <p className="text-[11px] mt-0.5 text-amber-800">
              In Phase 1, products are read from static catalog data. Full PostgreSQL database CRUD operations (create, edit, delete, inventory management) will be unlocked with Prisma ORM in Phase 2 upon your approval.
            </p>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Total Available Products: <strong className="text-slate-800">{products.length}</strong>
          </p>
          <button
            type="button"
            disabled
            className="px-4 py-2 bg-slate-200 text-slate-400 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-not-allowed shadow-none"
            title="Create Product CRUD will be activated in Phase 2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product (Phase 2)</span>
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-cream-200">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Variants / Prices</th>
                  <th className="py-3 px-4">Origin</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-cream-50 border border-cream-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          {p.tamilName && (
                            <p className="text-[10px] text-emerald-800">{p.tamilName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">
                      {p.categoryName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.weightOptions.map((opt) => (
                          <span
                            key={opt.id}
                            className="bg-cream-100 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-700 border border-cream-200"
                          >
                            {opt.label}: {formatCurrency(opt.price)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {p.origin}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <Sparkles className="w-2.5 h-2.5" />
                        In Catalog
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
