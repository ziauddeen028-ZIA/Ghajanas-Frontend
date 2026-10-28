import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product, WeightOption } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, weight: WeightOption, quantity?: number) => void;
  removeFromCart: (productId: string, weightId: string) => void;
  updateQuantity: (productId: string, weightId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemCount: number;
  subtotal: number;
  totalSavings: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'nj_essentials_cart_v1';
const FREE_DELIVERY_THRESHOLD = 500;
const STANDARD_DELIVERY_FEE = 40;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2800);
  };

  const addToCart = (product: Product, weight: WeightOption, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedWeight.id === weight.id
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          tamilName: product.tamilName,
          productImage: product.images[0] || '',
          categoryName: product.categoryName,
          selectedWeight: weight,
          quantity,
        },
      ];
    });

    showToast(`Added ${quantity}x ${product.name} (${weight.label}) to cart`);
  };

  const removeFromCart = (productId: string, weightId: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.selectedWeight.id === weightId))
    );
  };

  const updateQuantity = (productId: string, weightId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, weightId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.selectedWeight.id === weightId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.selectedWeight.price * item.quantity,
    0
  );

  const totalSavings = cart.reduce((sum, item) => {
    const orig = item.selectedWeight.originalPrice || item.selectedWeight.price;
    const diff = orig - item.selectedWeight.price;
    return sum + (diff > 0 ? diff * item.quantity : 0);
  }, 0);

  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemCount,
        subtotal,
        totalSavings,
        deliveryFee,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        total,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
