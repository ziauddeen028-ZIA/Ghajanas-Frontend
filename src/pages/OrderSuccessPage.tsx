import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { OrderDetails } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  createOrderWhatsAppMessage,
  generateWhatsAppLink,
  STORE_PHONE_NUMBER,
} from '../utils/whatsapp';
import {
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  ShoppingBag,
  MapPin,
  Phone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('nj_last_order');
      if (stored) {
        setOrderDetails(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const orderId = orderDetails?.orderId || 'NJ-2026-CONFIRMED';
  const customer = orderDetails?.customer;
  const items = orderDetails?.items || [];
  const subtotal = orderDetails?.subtotal || 0;
  const deliveryFee = orderDetails?.deliveryFee || 0;
  const total = orderDetails?.total || 0;

  const prefilledMessage = customer
    ? createOrderWhatsAppMessage(orderId, customer, items, subtotal, deliveryFee, total)
    : `🌿 Hello NJ Essentials! I placed order ref: ${orderId}. Please confirm dispatch details.`;

  const whatsappUrl = generateWhatsAppLink(prefilledMessage, STORE_PHONE_NUMBER);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(prefilledMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Top Congratulatory Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-200 shadow-sm text-center mb-8 relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-100 text-forest-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Order Successfully Received</span>
        </div>

        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-forest-950 mb-2">
          Thank You For Supporting Native Farming!
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto mb-4">
          Your order for pure, unadulterated essentials has been recorded. Reference ID:{' '}
          <strong className="text-forest-900 font-mono">{orderId}</strong>
        </p>

        {/* WhatsApp Direct Action Banner */}
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 mb-6 text-left">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-6 h-6 text-emerald-600 fill-emerald-600 shrink-0" />
            <div>
              <h3 className="font-serif font-bold text-sm text-emerald-950">
                Confirm Fast Dispatch on WhatsApp
              </h3>
              <p className="text-xs text-emerald-700">
                Click below to send your prefilled order summary directly to our desk.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Open in WhatsApp</span>
            </a>
            <button
              onClick={handleCopyMessage}
              className="px-3.5 py-2.5 bg-white border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Our team dispatches orders within 24 hours. You will receive tracking notifications via WhatsApp.
        </div>
      </div>

      {/* Order Details Breakdown */}
      {customer && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm mb-8 space-y-6">
          <h2 className="font-serif font-bold text-lg text-forest-950 pb-3 border-b border-cream-200">
            Order & Delivery Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Delivery Details */}
            <div className="space-y-2 p-4 bg-cream-50 rounded-2xl border border-cream-200">
              <h3 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-forest-700" />
                Shipping Address
              </h3>
              <p className="font-bold text-slate-800 text-sm">{customer.fullName}</p>
              <p className="text-slate-600">{customer.addressLine}</p>
              {customer.landmark && <p className="text-slate-500">Landmark: {customer.landmark}</p>}
              <p className="text-slate-600">
                {customer.city}, {customer.state} - {customer.pincode}
              </p>
              <p className="text-slate-700 font-semibold flex items-center gap-1 pt-1">
                <Phone className="w-3.5 h-3.5 text-forest-700" />
                {customer.phone}
              </p>
            </div>

            {/* Payment & Status */}
            <div className="space-y-2 p-4 bg-cream-50 rounded-2xl border border-cream-200">
              <h3 className="font-bold text-slate-900 uppercase tracking-wide">Payment Method</h3>
              <p className="font-bold text-slate-800 text-sm">
                {customer.paymentMethod === 'whatsapp_order'
                  ? 'WhatsApp Order & UPI'
                  : customer.paymentMethod === 'cod'
                  ? 'Cash on Delivery (COD)'
                  : 'UPI Online'}
              </p>
              <div className="pt-2 border-t border-cream-200 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges:</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-1">
                  <span>Total Amount:</span>
                  <span className="text-forest-900">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wide text-slate-700 mb-3">
              Items Ordered ({items.length})
            </h3>
            <div className="space-y-2 divide-y divide-cream-100">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="pt-2 flex items-center justify-between text-xs text-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-cream-100 border border-cream-200"
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
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center">
        <Link
          to="/products"
          className="px-6 py-3.5 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-md transition-all"
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
