import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { generateWhatsAppLink, STORE_PHONE_NUMBER } from '../utils/whatsapp';
import type { CartItem } from '../types';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    total,
    totalSavings,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleWhatsAppCartOrder = () => {
    const itemLines = cart
      .map(
        (item: CartItem, idx: number) =>
          `${idx + 1}. *${item.productName}* (${item.selectedWeight.label})\n   Qty: ${item.quantity} x ${formatCurrency(item.selectedWeight.price)} = *${formatCurrency(item.selectedWeight.price * item.quantity)}*`
      )
      .join('\n\n');

    const msg = `🌿 *CART INQUIRY / DIRECT ORDER - NJ ESSENTIALS* 🌿\n\nHello! I would like to order the following traditional items:\n\n${itemLines}\n\n-------------------------\n*Subtotal:* ${formatCurrency(subtotal)}\n*Delivery Fee:* ${deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}\n*Total Payable:* ${formatCurrency(total)}\n-------------------------\nPlease guide me on delivery time and UPI payment.`;

    window.open(generateWhatsAppLink(msg, STORE_PHONE_NUMBER), '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-cream-100 text-forest-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-slate-800 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
          Explore our authentic range of unbleached country sugars, traditional rice varieties, and native millets.
        </p>
        <Link
          to="/products"
          className="px-6 py-3 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-cream-200">
        <div>
          <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-forest-950">
            Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your selections before checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item Rows */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert */}
          <div className="bg-cream-100 p-4 rounded-2xl border border-cream-200 text-xs">
            {amountNeededForFreeDelivery > 0 ? (
              <div>
                <div className="flex items-center justify-between font-bold text-slate-700 mb-2">
                  <span className="flex items-center gap-1.5 text-forest-800">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    Add {formatCurrency(amountNeededForFreeDelivery)} more for FREE Delivery!
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-cream-300 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>🎉 You qualify for FREE Delivery across South India!</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white rounded-3xl border border-cream-200 shadow-sm divide-y divide-cream-200 overflow-hidden">
            {cart.map((item: CartItem) => (
              <div
                key={`${item.productId}-${item.selectedWeight.id}`}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-cream-50 border border-cream-200 shrink-0"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900">
                      {item.productName}
                    </h3>
                    {item.tamilName && (
                      <p className="text-xs font-semibold text-emerald-800">
                        {item.tamilName}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-cream-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-cream-200">
                        {item.selectedWeight.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        @ {formatCurrency(item.selectedWeight.price)} each
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-cream-100">
                  {/* Stepper */}
                  <div className="flex items-center border border-cream-300 rounded-xl bg-white overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.selectedWeight.id, item.quantity - 1)
                      }
                      className="p-1.5 hover:bg-cream-100 text-slate-600 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-black text-slate-800">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.selectedWeight.id, item.quantity + 1)
                      }
                      className="p-1.5 hover:bg-cream-100 text-slate-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <span className="font-serif font-bold text-base text-forest-950 min-w-[70px] text-right">
                    {formatCurrency(item.selectedWeight.price * item.quantity)}
                  </span>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId, item.selectedWeight.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/products"
              className="text-xs font-bold text-forest-800 hover:text-forest-950 inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Add more traditional essentials to your cart</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-cream-200 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-lg text-forest-950 pb-3 border-b border-cream-200">
            Order Summary
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal:</span>
              <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>

            {totalSavings > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount Savings:</span>
                <span>-{formatCurrency(totalSavings)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges:</span>
              <span className="font-bold">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-extrabold uppercase">FREE</span>
                ) : (
                  formatCurrency(deliveryFee)
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-serif font-extrabold text-forest-950 pt-3 border-t border-cream-200">
              <span>Grand Total:</span>
              <span className="text-forest-900 text-lg">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="pt-3 space-y-2.5">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-4 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhatsAppCartOrder}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order on WhatsApp (Fast Checkout)</span>
            </button>
          </div>

          <div className="pt-3 border-t border-cream-200 text-center">
            <p className="text-[11px] text-slate-400">
              🔒 100% Secure Ordering • Cash on Delivery & UPI available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
