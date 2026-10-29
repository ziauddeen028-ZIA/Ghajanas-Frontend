import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import type { OrderDetails, PaymentStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminOrdersPage: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/orders/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('Access denied: Admin privileges required.');
        }
        throw new Error(`Failed to fetch orders: ${res.statusText}`);
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to orders API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const togglePaymentStatus = async (orderId: string, currentStatus: PaymentStatus) => {
    const nextStatus: PaymentStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    setUpdatingOrderId(orderId);

    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus: nextStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, paymentStatus: nextStatus } : o))
        );
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to update payment status.');
      }
    } catch {
      alert('Error updating payment status on backend.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <AdminLayout
      title="Orders Management (Phase 1)"
      subtitle="Orders placed in this session are listed below. Admin can manually verify UPI or COD payments."
    >
      <div className="space-y-6">
        {/* Phase 1 Explanatory Callout */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Manual Payment Verification System</p>
            <p className="text-[11px] mt-0.5 text-emerald-800 leading-relaxed">
              New customer orders begin as <strong>Unpaid</strong>. When the customer transfers via UPI to the owner's account or settles with COD, click "Mark Paid". Payment status remains completely independent of order dispatch progress.
            </p>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Recorded Orders: <strong className="text-slate-800">{orders.length}</strong>
          </p>
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="px-3 py-1.5 bg-white border border-cream-300 hover:bg-cream-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Orders Table or Empty State */}
        {orders.length === 0 && !isLoading && !error && (
          <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-slate-800 mb-1">
              No orders recorded yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Place a test order from the storefront as a customer to see it appear here for admin review and payment verification.
            </p>
            <a
              href="/products"
              target="_blank"
              className="px-4 py-2 bg-forest-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <span>Place Test Customer Order</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {orders.length > 0 && (
          <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-cream-200">
                  <tr>
                    <th className="py-3 px-4">Order Ref / Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items Summary</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Payment Status</th>
                    <th className="py-3 px-4">Order Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {orders.map((o) => {
                    const isPaid = o.paymentStatus === 'Paid';
                    return (
                      <tr key={o.orderId} className="hover:bg-cream-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono">
                          <p className="font-bold text-slate-900">{o.orderId}</p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(o.createdAt).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-800">{o.customer?.fullName}</p>
                          <p className="text-[11px] text-slate-500">{o.customer?.phone}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[160px]">
                            {o.customer?.city}, {o.customer?.pincode}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1 max-w-xs">
                            {o.items.map((it, idx) => (
                              <p key={idx} className="truncate text-[11px] text-slate-700">
                                • {it.productName} ({it.selectedWeight.label}) × {it.quantity}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-serif font-black text-sm text-forest-950">
                          {formatCurrency(o.total)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="uppercase text-[10px] font-bold text-slate-600 bg-cream-100 px-2 py-0.5 rounded border border-cream-200">
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => togglePaymentStatus(o.orderId, o.paymentStatus)}
                            disabled={updatingOrderId === o.orderId}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs ${
                              isPaid
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300'
                            }`}
                            title="Click to toggle Paid/Unpaid"
                          >
                            {isPaid ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Paid (Verified)</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Unpaid (Verify)</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-forest-100 text-forest-900 border border-forest-200">
                            {o.orderStatus || 'Received'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

