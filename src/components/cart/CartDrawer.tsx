import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { generateWhatsAppLink, STORE_PHONE_NUMBER } from '../../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
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

  if (!isCartOpen) return null;

  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleWhatsAppQuickCartOrder = () => {
    const itemLines = cart
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.productName}* (${item.selectedWeight.label})\n   Qty: ${item.quantity} x ${formatCurrency(item.selectedWeight.price)} = *${formatCurrency(item.selectedWeight.price * item.quantity)}*`
      )
      .join('\n\n');

    const msg = `🌿 *CART INQUIRY / DIRECT ORDER - NJ ESSENTIALS* 🌿\n\nHello! I would like to place an order for the following items:\n\n${itemLines}\n\n-------------------------\n*Subtotal:* ${formatCurrency(subtotal)}\n*Delivery:* ${deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}\n*Estimated Total:* ${formatCurrency(total)}\n-------------------------\nPlease confirm stock and guide me on payment & delivery.`;

    window.open(generateWhatsAppLink(msg, STORE_PHONE_NUMBER), '_blank');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 bg-forest-950 text-white flex items-center justify-between border-b border-forest-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Your Shopping Cart</h3>
                <p className="text-xs text-cream-300">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} in your bag
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-cream-300 hover:text-white hover:bg-forest-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-cream-100 p-4 border-b border-cream-200 text-xs">
            {amountNeededForFreeDelivery > 0 ? (
              <div>
                <div className="flex items-center justify-between font-medium text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1 text-forest-800 font-bold">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    Add {formatCurrency(amountNeededForFreeDelivery)} more for FREE Delivery!
                  </span>
                  <span className="text-slate-500">{progressPercent}%</span>
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
                <span>🎉 Congratulations! You have unlocked FREE Delivery!</span>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-cream-100 text-forest-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-lg text-slate-800 mb-1">Your cart is empty</h4>
                <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">
                  Looks like you haven't added any authentic traditional groceries yet.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/products');
                  }}
                  className="px-5 py-2.5 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
                >
                  Explore Traditional Groceries
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedWeight.id}`}
                  className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200 flex gap-3 items-center"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-16 h-16 rounded-xl object-cover bg-white border border-cream-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-slate-900 truncate">
                      {item.productName}
                    </h4>
                    {item.tamilName && (
                      <p className="text-[11px] text-emerald-700 font-medium truncate">
                        {item.tamilName}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] bg-cream-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        {item.selectedWeight.label}
                      </span>
                      <span className="text-xs font-extrabold text-forest-950">
                        {formatCurrency(item.selectedWeight.price)}
                      </span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-cream-200/80">
                      <div className="flex items-center border border-cream-300 rounded-lg bg-white overflow-hidden shadow-xs">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.selectedWeight.id, item.quantity - 1)
                          }
                          className="p-1 hover:bg-cream-100 text-slate-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-black text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.selectedWeight.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-cream-100 text-slate-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-900">
                          {formatCurrency(item.selectedWeight.price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId, item.selectedWeight.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-5 bg-cream-50 border-t border-cream-200 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Total Discount Savings:</span>
                    <span>-{formatCurrency(totalSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges:</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase">FREE</span>
                    ) : (
                      formatCurrency(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-forest-950 pt-2 border-t border-cream-200">
                  <span>Grand Total:</span>
                  <span className="text-base text-forest-900">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 px-4 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppQuickCartOrder}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Directly via WhatsApp</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Clear Shopping Bag
                </button>
                <span className="text-[11px] text-slate-400">100% Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
