import React from 'react';
import { useCart } from '../../context/CartContext';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, setIsCartOpen } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short">
      <div className="bg-forest-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-forest-700/50 flex items-center gap-3 backdrop-blur-md">
        <div className="p-1.5 bg-emerald-500/20 rounded-full text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <p className="text-sm font-medium text-cream-100 flex-1">{toastMessage}</p>
        <button
          onClick={() => setIsCartOpen(true)}
          className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          View Cart
        </button>
      </div>
    </div>
  );
};
