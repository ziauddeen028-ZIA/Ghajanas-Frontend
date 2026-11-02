import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { CartItem, Product, WeightOption, PendingCartAction } from '../types';
import { useAuth } from './AuthContext';
import {
  getCustomerCart,
  addCartItemApi,
  updateCartItemQtyApi,
  removeCartItemApi,
  clearCustomerCartApi,
} from '../services/cartApi';

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
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 500;
const STANDARD_DELIVERY_FEE = 40;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, setPendingCartAction, consumePendingCartAction } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keep a ref to the current token to prevent stale closures during async operations
  const tokenRef = useRef<string | null>(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3200);
  }, []);

  /**
   * Load customer cart from PostgreSQL on login or page refresh.
   */
  const loadCustomerCart = useCallback(async (authToken: string) => {
    setIsLoading(true);
    try {
      const dbCart = await getCustomerCart(authToken);
      setCart(dbCart);
    } catch (err: any) {
      console.error('Failed to load cart from database:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Whenever user or token changes, load customer's database cart or clear for guests
  useEffect(() => {
    if (user && token) {
      loadCustomerCart(token);
    } else {
      setCart([]);
    }
  }, [user, token, loadCustomerCart]);

  /**
   * Internal helper to persist cart item to PostgreSQL and update UI state.
   */
  const executeAddToCart = useCallback(
    async (product: Product, weight: WeightOption, quantity: number = 1) => {
      const currentToken = tokenRef.current;
      if (!currentToken) return;

      // Optimistic local update
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

      try {
        const result = await addCartItemApi(product.id, weight.id, quantity, currentToken);
        setCart(result.cart);
        showToast(result.message || `Added ${quantity}x ${product.name} (${weight.label}) to cart`);
      } catch (err: any) {
        console.error('Database add to cart failed:', err);
        showToast(err.message || 'Failed to add item to cart');
        // Rollback / re-sync with database state
        try {
          const freshCart = await getCustomerCart(currentToken);
          setCart(freshCart);
        } catch {}
      }
    },
    [showToast]
  );

  /**
   * Public Add to Cart method.
   * Enforces verified customer login:
   * If customer is not logged in, captures product, variant, quantity, and return URL,
   * stores pending action, shows message, and directs customer to login.
   */
  const addToCart = (
    product: Product,
    weight: WeightOption,
    quantity: number = 1,
    returnUrl?: string
  ): boolean => {
    if (!user || !token) {
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
    if (user && token) {
      fulfillPendingCartAction();
    }
  }, [user, token, fulfillPendingCartAction]);

  /**
   * Removes an item variant from PostgreSQL and cart state.
   */
  const removeFromCart = useCallback(
    async (_productId: string, weightId: string) => {
      const currentToken = tokenRef.current;

      // Optimistic removal
      setCart((prev) => prev.filter((item) => item.selectedWeight.id !== weightId));

      if (currentToken) {
        try {
          const updated = await removeCartItemApi(weightId, currentToken);
          setCart(updated);
          showToast('Item removed from cart');
        } catch (err: any) {
          console.error('Database remove item failed:', err);
          showToast(err.message || 'Failed to remove item');
          try {
            const fresh = await getCustomerCart(currentToken);
            setCart(fresh);
          } catch {}
        }
      }
    },
    [showToast]
  );

  /**
   * Updates item quantity in PostgreSQL and cart state.
   */
  const updateQuantity = useCallback(
    async (productId: string, weightId: string, quantity: number) => {
      const currentToken = tokenRef.current;

      if (quantity <= 0) {
        removeFromCart(productId, weightId);
        return;
      }

      // Optimistic update
      setCart((prev) =>
        prev.map((item) =>
          item.selectedWeight.id === weightId ? { ...item, quantity } : item
        )
      );

      if (currentToken) {
        try {
          const updated = await updateCartItemQtyApi(weightId, quantity, currentToken);
          setCart(updated);
        } catch (err: any) {
          console.error('Database update quantity failed:', err);
          showToast(err.message || 'Failed to update item quantity');
          try {
            const fresh = await getCustomerCart(currentToken);
            setCart(fresh);
          } catch {}
        }
      }
    },
    [removeFromCart, showToast]
  );

  /**
   * Clears all items in customer's cart in PostgreSQL.
   */
  const clearCart = useCallback(async () => {
    const currentToken = tokenRef.current;
    setCart([]);

    if (currentToken) {
      try {
        await clearCustomerCartApi(currentToken);
      } catch (err: any) {
        console.error('Database clear cart failed:', err);
      }
    }
  }, []);

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
        isLoading,
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
