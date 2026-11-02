import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import type { OrderDetails, PaymentStatus, OrderStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminOrdersPage: React.FC = () => {
  const { token } = useAuth();
  const { showToast } = useCart();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  const updateOrderField = async (
    orderId: string,
    field: 'paymentStatus' | 'orderStatus',
    value: string
  ) => {
    setUpdatingOrderId(orderId);
    try {
      const endpoint =
        field === 'paymentStatus'
          ? `${API_BASE_URL}/orders/${orderId}/payment-status`
          : `${API_BASE_URL}/orders/${orderId}/order-status`;

      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? data.order : o))
        );
        showToast(`Order ${orderId}: ${field === 'paymentStatus' ? 'Payment' : 'Order'} status updated to ${value}.`);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || `Failed to update ${field}.`);
      }
    } catch {
      showToast(`Error updating ${field} on backend.`);
    } finally {
      setUpdatingOrderId(null);
      setOpenDropdown(null);
    }
  };

  return (
    <AdminLayout
      title="Orders Management"
      subtitle="Live orders from Supabase PostgreSQL. Verify UPI or COD payments, track status, and view customer address snapshots."
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
          <div className="bg-white rounded-2xl border border-cream-200 shadow-sm">
            {/* Desktop + Tablet Orders Table */}
            <div className="hidden md:block overflow-x-auto">
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
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === `${o.orderId}-payment`
                                    ? null
                                    : `${o.orderId}-payment`
                                )
                              }
                              disabled={updatingOrderId === o.orderId}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center justify-between gap-1.5 transition-all shadow-xs min-w-[110px] ${
                                o.paymentStatus === 'Paid'
                                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300'
                              }`}
                            >
                              <span className="inline-flex items-center gap-1">
                                {o.paymentStatus === 'Paid' ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                )}
                                {o.paymentStatus}
                              </span>
                              <ChevronDown className="w-3 h-3" />
                            </button>

                            {openDropdown === `${o.orderId}-payment` && (
                              <div className="absolute z-20 mt-1 w-full bg-white border border-cream-200 rounded-lg shadow-lg overflow-hidden">
                                {(['Unpaid', 'Paid'] as PaymentStatus[]).map((status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    disabled={updatingOrderId === o.orderId || o.paymentStatus === status}
                                    onClick={() => updateOrderField(o.orderId, 'paymentStatus', status)}
                                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 hover:bg-cream-100 transition-colors ${
                                      o.paymentStatus === status ? 'text-forest-900 bg-cream-50' : 'text-slate-700'
                                    }`}
                                  >
                                    {status === 'Paid' ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                                    )}
                                    {status}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === `${o.orderId}-order`
                                    ? null
                                    : `${o.orderId}-order`
                                )
                              }
                              disabled={updatingOrderId === o.orderId}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center justify-between gap-1.5 transition-all shadow-xs min-w-[120px] bg-forest-100 hover:bg-forest-200 text-forest-900 border border-forest-300"
                            >
                              <span>{o.orderStatus || 'Received'}</span>
                              <ChevronDown className="w-3 h-3" />
                            </button>

                            {openDropdown === `${o.orderId}-order` && (
                              <div className="absolute z-20 mt-1 w-full bg-white border border-cream-200 rounded-lg shadow-lg overflow-hidden">
                                {(['Received', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'] as OrderStatus[]).map(
                                  (status) => (
                                    <button
                                      key={status}
                                      type="button"
                                      disabled={updatingOrderId === o.orderId || (o.orderStatus || 'Received') === status}
                                      onClick={() => updateOrderField(o.orderId, 'orderStatus', status)}
                                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-cream-100 transition-colors ${
                                        (o.orderStatus || 'Received') === status
                                          ? 'text-forest-900 bg-cream-50'
                                          : 'text-slate-700'
                                      }`}
                                    >
                                      {status}
                                    </button>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Orders Cards */}
            <div className="md:hidden divide-y divide-cream-100 border-t border-cream-100">
              {orders.map((o) => {
                const isPaid = o.paymentStatus === 'Paid';
                return (
                  <div key={o.orderId} className="p-4">
                    <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-sm">
                      {/* Header: order ref, date and payment badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div className="flex flex-col gap-1">
                          <p className="font-mono font-bold text-slate-900 text-sm">{o.orderId}</p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(o.createdAt).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isPaid ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Paid
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              Unpaid
                            </>
                          )}
                        </span>
                      </div>

                      {/* Customer snapshot grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Customer</span>
                          <p className="font-bold text-slate-800 truncate">{o.customer?.fullName}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Phone</span>
                          <p className="text-slate-700 truncate">{o.customer?.phone}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
                          <p className="text-[11px] text-slate-600 truncate">
                            {o.customer?.city}, {o.customer?.pincode}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
                          <p className="font-serif font-black text-sm text-forest-950">
                            {formatCurrency(o.total)}
                          </p>
                        </div>
                      </div>

                      {/* Items summary */}
                      <div className="mb-4">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                          Items ({o.items.length})
                        </span>
                        <div className="space-y-1.5">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-[11px]">
                              <span className="text-slate-700">
                                • {it.productName} ({it.selectedWeight.label}) × {it.quantity}
                              </span>
                              <span className="font-semibold text-slate-900">
                                {formatCurrency(it.selectedWeight.price * it.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative w-full">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === `${o.orderId}-payment`
                                  ? null
                                  : `${o.orderId}-payment`
                              )
                            }
                            disabled={updatingOrderId === o.orderId}
                            className={`w-full px-3 py-2 rounded-lg text-xs font-bold inline-flex items-center justify-between gap-1.5 transition-all shadow-xs border ${
                              isPaid
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300'
                            }`}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              {isPaid ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                              )}
                              {o.paymentStatus}
                            </span>
                            <ChevronDown className="w-3 h-3" />
                          </button>

                          {openDropdown === `${o.orderId}-payment` && (
                            <div className="absolute left-0 w-full mt-1.5 z-20 bg-white border border-cream-200 rounded-lg shadow-lg overflow-hidden">
                              {(['Unpaid', 'Paid'] as PaymentStatus[]).map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  disabled={updatingOrderId === o.orderId || o.paymentStatus === status}
                                  onClick={() => updateOrderField(o.orderId, 'paymentStatus', status)}
                                  className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-1.5 hover:bg-cream-100 transition-colors ${
                                    o.paymentStatus === status ? 'text-forest-900 bg-cream-50' : 'text-slate-700'
                                  }`}
                                >
                                  {status === 'Paid' ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  )}
                                  {status}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="relative w-full">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === `${o.orderId}-order`
                                  ? null
                                  : `${o.orderId}-order`
                              )
                            }
                            disabled={updatingOrderId === o.orderId}
                            className="w-full px-3 py-2 rounded-lg text-xs font-bold inline-flex items-center justify-between gap-1.5 transition-all shadow-xs border border-forest-300 bg-forest-100 hover:bg-forest-200 text-forest-900"
                          >
                            <span>{o.orderStatus || 'Received'}</span>
                            <ChevronDown className="w-3 h-3" />
                          </button>

                          {openDropdown === `${o.orderId}-order` && (
                            <div className="absolute left-0 w-full mt-1.5 z-20 bg-white border border-cream-200 rounded-lg shadow-lg overflow-hidden">
                              {(['Received', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'] as OrderStatus[]).map(
                                (status) => (
                                  <button
                                    key={status}
                                    type="button"
                                    disabled={updatingOrderId === o.orderId || (o.orderStatus || 'Received') === status}
                                    onClick={() => updateOrderField(o.orderId, 'orderStatus', status)}
                                    className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-cream-100 transition-colors ${
                                      (o.orderStatus || 'Received') === status
                                        ? 'text-forest-900 bg-cream-50'
                                        : 'text-slate-700'
                                    }`}
                                  >
                                    {status}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

