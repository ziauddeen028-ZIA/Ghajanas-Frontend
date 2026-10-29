import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { OrderDetails } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  createOrderWhatsAppMessage,
  generateWhatsAppLink,
  STORE_PHONE_NUMBER,
} from '../utils/whatsapp';
import {
  ShoppingBag,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Check,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ORDER_STEPS = ['Received', 'Processing', 'Dispatched', 'Delivered'];

export const MyOrdersPage: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Backend automatically extracts customer ID from the verified token
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to load orders: ${res.statusText}`);
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      console.warn('Orders API error, checking fallback local order:', err);
      // Fallback: Check if there is an order stored from current session
      try {
        const stored = sessionStorage.getItem('nj_last_order');
        if (stored) {
          const parsed = JSON.parse(stored);
          setOrders([parsed]);
        } else {
          setError(err.message || 'Unable to retrieve your orders.');
        }
      } catch {
        setError(err.message || 'Unable to retrieve your orders.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const getStepProgress = (status: string) => {
    const idx = ORDER_STEPS.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-cream-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-forest-950">
            My Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your native harvest shipments and view order summaries
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="px-3.5 py-2 bg-white border border-cream-300 hover:bg-cream-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-forest-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-serif font-bold text-slate-800 text-sm">Retrieving your orders...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Notice</p>
            <p className="text-[11px] mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-cream-200 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-cream-100 text-forest-800 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-xl text-slate-900 mb-2">
            No Orders Placed Yet
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            You haven't ordered any traditional groceries yet. Discover our pure country sugars, traditional rice varieties, and native millets.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md transition-all"
          >
            <span>Explore Storefront</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Orders List (Newest First) */}
      {!isLoading && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => {
            const stepIdx = getStepProgress(order.orderStatus || 'Received');
            const isPaid = order.paymentStatus === 'Paid';

            const whatsappMessage = order.customer
              ? createOrderWhatsAppMessage(
                  order.orderId,
                  order.customer,
                  order.items,
                  order.subtotal,
                  order.deliveryFee,
                  order.total
                )
              : `Order Ref: ${order.orderId}`;
            const whatsappUrl = generateWhatsAppLink(whatsappMessage, STORE_PHONE_NUMBER);

            return (
              <div
                key={order.orderId}
                className="bg-white rounded-3xl border border-cream-200 shadow-sm overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-5 sm:p-6 bg-cream-50/80 border-b border-cream-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Order Number
                      </span>
                      <span className="font-mono font-bold text-slate-900">{order.orderId}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Date Placed
                      </span>
                      <span className="text-slate-700 font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Payment Status
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPaid ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Paid</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Unpaid (Pending Verification)</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Inquire about this order on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                      <span>WhatsApp Desk</span>
                    </a>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="p-5 sm:p-6 border-b border-cream-200">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Delivery Progress
                  </p>
                  <div className="grid grid-cols-4 gap-2 relative">
                    {ORDER_STEPS.map((step, idx) => {
                      const isCompleted = idx <= stepIdx;
                      const isCurrent = idx === stepIdx;

                      return (
                        <div key={step} className="flex flex-col items-center text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                              isCompleted
                                ? 'bg-forest-900 text-white shadow-sm'
                                : 'bg-cream-200 text-slate-400'
                            }`}
                          >
                            {isCompleted ? <Check className="w-4 h-4 text-amber-400" /> : idx + 1}
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              isCurrent
                                ? 'text-forest-900 font-bold'
                                : isCompleted
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Body: Items & Address Snapshot */}
                <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Items Column */}
                  <div className="md:col-span-7 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Ordered Essentials ({order.items.length})
                    </h3>
                    <div className="divide-y divide-cream-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-12 h-12 rounded-xl object-cover bg-cream-50 border border-cream-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{item.productName}</p>
                              <p className="text-slate-500">
                                {item.selectedWeight.label} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900">
                            {formatCurrency(item.selectedWeight.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-cream-200 text-xs space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Items Subtotal:</span>
                        <span className="font-semibold text-slate-800">
                          {formatCurrency(order.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Delivery Fee:</span>
                        <span className="font-semibold text-slate-800">
                          {order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-base font-serif font-extrabold text-forest-950 pt-1">
                        <span>Total Paid/Payable:</span>
                        <span className="text-forest-900">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address Snapshot Column */}
                  <div className="md:col-span-5 bg-cream-50 p-4 rounded-2xl border border-cream-200 space-y-2 text-xs">
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-cream-200">
                      <MapPin className="w-3.5 h-3.5 text-forest-700" />
                      <span>Delivery Address Snapshot</span>
                    </h3>
                    <p className="font-bold text-slate-800 text-sm">{order.customer?.fullName}</p>
                    <p className="text-slate-600">{order.customer?.addressLine}</p>
                    {order.customer?.landmark && (
                      <p className="text-slate-500">Landmark: {order.customer.landmark}</p>
                    )}
                    <p className="text-slate-600">
                      {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
                    </p>
                    <p className="text-slate-700 font-semibold pt-1">
                      📞 {order.customer?.phone}
                    </p>
                    {order.customer?.deliveryNotes && (
                      <p className="text-slate-500 italic pt-1">
                        Note: "{order.customer.deliveryNotes}"
                      </p>
                    )}
                    <div className="pt-2 border-t border-cream-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Payment Method
                      </span>
                      <span className="font-bold text-slate-800">
                        {order.paymentMethod === 'upi'
                          ? 'UPI Direct Transfer'
                          : order.paymentMethod === 'cod'
                          ? 'Cash on Delivery (COD)'
                          : 'WhatsApp Order'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
