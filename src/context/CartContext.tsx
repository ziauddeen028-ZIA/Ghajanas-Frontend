import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem, Product, WeightOption, PendingCartAction } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, weight: WeightOption, quantity?: number, returnUrl?: string) => boolean;
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
  fulfillPendingCartAction: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const BASE_STORAGE_KEY = 'ghajanas_cart_v1';
const FREE_DELIVERY_THRESHOLD = 500;
const STANDARD_DELIVERY_FEE = 40;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setPendingCartAction, consumePendingCartAction } = useAuth();

  // Storage key is strictly isolated per customer account to prevent cart leakage
  const storageKey = user ? `${BASE_STORAGE_KEY}_user_${user.id}` : `${BASE_STORAGE_KEY}_guest`;

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      // Initialize with user cart if available, else empty
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // When active user changes (e.g. login/logout), reload that specific customer's cart
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCart(saved ? JSON.parse(saved) : []);
    } catch {
      setCart([]);
    }
  }, [storageKey]);

  // Persist current cart under the customer-isolated key
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist customer cart:', e);
    }
  }, [cart, storageKey]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3200);
  }, []);

  /**
   * Internal helper to add item into the active cart state.
   */
  const executeAddToCart = useCallback((product: Product, weight: WeightOption, quantity: number = 1) => {
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
  }, [showToast]);

  /**
   * Public Add to Cart method.
   * Enforces customer login:
   * If customer is not logged in, captures product, variant, quantity, and return URL,
   * stores pending action, shows message, and directs customer to login.
   */
  const addToCart = (
    product: Product,
    weight: WeightOption,
    quantity: number = 1,
    returnUrl?: string
  ): boolean => {
    if (!user) {
      const currentPath = returnUrl || window.location.pathname + window.location.search;
      const pending: PendingCartAction = {
        product,
        selectedWeight: weight,
        quantity,
        returnUrl: currentPath,
      };

      setPendingCartAction(pending);
      showToast('Please sign in to add items to your cart.');
      return false;
    }

    executeAddToCart(product, weight, quantity);
    return true;
  };

  /**
   * Executes pending cart action exactly once upon successful login.
   */
  const fulfillPendingCartAction = useCallback((): boolean => {
    const pending = consumePendingCartAction();
    if (!pending) return false;

    executeAddToCart(pending.product, pending.selectedWeight, pending.quantity);
    return true;
  }, [consumePendingCartAction, executeAddToCart]);

  // When user logs in, fulfill pending cart action if one exists
  useEffect(() => {
    if (user) {
      fulfillPendingCartAction();
    }
  }, [user, fulfillPendingCartAction]);

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
        fulfillPendingCartAction,
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
