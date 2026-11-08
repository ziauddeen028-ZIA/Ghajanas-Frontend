import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { CartItem, Product, WeightOption } from '../types';
import { useAuth } from './AuthContext';
import {
  getCustomerCart,
  addCartItemApi,
  updateCartItemQtyApi,
  removeCartItemApi,
  clearCustomerCartApi,
} from '../services/cartApi';

const GUEST_CART_STORAGE_KEY = 'ghajanas_guest_cart';

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

const loadGuestCartFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
};

const saveGuestCartToStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // localStorage unavailable or quota exceeded; silently ignore
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, consumePendingCartAction } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

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
   * Persist cart to localStorage for guests whenever cart changes.
   */
  const persistCart = useCallback(
    (nextCart: CartItem[]) => {
      if (!tokenRef.current) {
        saveGuestCartToStorage(nextCart);
      }
    },
    []
  );

  /**
   * Load customer cart from PostgreSQL on login or page refresh.
   */
  const loadCustomerCart = useCallback(async (authToken: string) => {
    setIsLoading(true);
    try {
      const dbCart = await getCustomerCart(authToken);
      setCart(dbCart);
      setHydrated(true);
    } catch (err: any) {
      console.error('Failed to load cart from database:', err);
      setHydrated(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Initialize cart: load guest cart from localStorage if not authenticated,
   * or wait for auth to load DB cart.
   */
  useEffect(() => {
    if (user && token) {
      // Authenticated: load DB cart (will merge guest items below)
      loadCustomerCart(token);
    } else if (!hydrated) {
      // Guest: load from localStorage, don't overwrite with empty state
      const guestCart = loadGuestCartFromStorage();
      setCart(guestCart);
      setHydrated(true);
      setIsLoading(false);
    }
  }, [user, token, hydrated, loadCustomerCart]);

  /**
   * When user logs in, merge guest localStorage cart with database cart.
   * Database becomes source of truth after merge; guest items are added if missing.
   */
  useEffect(() => {
    if (!user || !token || !hydrated) return;

    const guestCart = loadGuestCartFromStorage();
    if (!guestCart || guestCart.length === 0) return;

    // Merge: add guest items that don't already exist in DB cart
    // We do this optimistically by appending unique guest items to current cart
    setCart((prev) => {
      const merged = [...prev];
      for (const guestItem of guestCart) {
        const exists = merged.find(
          (item) => item.productId === guestItem.productId && item.selectedWeight.id === guestItem.selectedWeight.id
        );
        if (!exists) {
          merged.push(guestItem);
        } else {
          // Combine quantities for duplicate product+weight
          exists.quantity += guestItem.quantity;
        }
      }
      saveGuestCartToStorage([]); // Clear guest cart after merge
      showToast('Cart synchronized with your account');
      return merged;
    });
  }, [user, token, hydrated, showToast]);

  /**
   * Internal helper to persist cart item to PostgreSQL and update UI state.
   */
  const executeAddToCart = useCallback(
    async (product: Product, weight: WeightOption, quantity: number = 1) => {
      // Optimistic local update - works for both guests and authenticated users
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
          persistCart(next);
          return next;
        }

        const next = [
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
        persistCart(next);
        return next;
      });

      const currentToken = tokenRef.current;
      if (!currentToken) {
        return; // Guests: local state updated, no DB sync
      }

      try {
        const result = await addCartItemApi(product.id, weight.id, quantity, currentToken);
        setCart(result.cart);
        persistCart(result.cart);
      } catch (err: any) {
        console.error('Database add to cart failed:', err);
        showToast(err.message || 'Failed to add item to cart');
        // Rollback / re-sync with database state
        try {
          const freshCart = await getCustomerCart(currentToken);
          setCart(freshCart);
          persistCart(freshCart);
        } catch {}
      }
    },
    [showToast, persistCart]
  );

  /**
   * Public Add to Cart method.
   * Works for both authenticated customers and guests.
   * Guests keep items in local cart state; authenticated users also sync to PostgreSQL.
   */
  const addToCart = (
    product: Product,
    weight: WeightOption,
    quantity: number = 1
  ): boolean => {
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
      setCart((prev) => {
        const next = prev.filter((item) => item.selectedWeight.id !== weightId);
        persistCart(next);
        return next;
      });

      if (currentToken) {
        try {
          const updated = await removeCartItemApi(weightId, currentToken);
          setCart(updated);
          persistCart(updated);
          showToast('Product removed from cart');
        } catch (err: any) {
          console.error('Database remove item failed:', err);
          showToast(err.message || 'Failed to remove item');
          try {
            const fresh = await getCustomerCart(currentToken);
            setCart(fresh);
            persistCart(fresh);
          } catch {}
        }
      } else {
        showToast('Product removed from cart');
      }
    },
    [showToast, persistCart]
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
      setCart((prev) => {
        const next = prev.map((item) =>
          item.selectedWeight.id === weightId ? { ...item, quantity } : item
        );
        persistCart(next);
        return next;
      });

      if (currentToken) {
        try {
          const updated = await updateCartItemQtyApi(weightId, quantity, currentToken);
          setCart(updated);
          persistCart(updated);
          showToast('Quantity updated');
        } catch (err: any) {
          console.error('Database update quantity failed:', err);
          showToast(err.message || 'Failed to update item quantity');
          try {
            const fresh = await getCustomerCart(currentToken);
            setCart(fresh);
            persistCart(fresh);
          } catch {}
        }
      } else {
        showToast('Quantity updated');
      }
    },
    [removeFromCart, showToast, persistCart]
  );

  /**
   * Clears all items in customer's cart in PostgreSQL.
   */
  const clearCart = useCallback(async () => {
    const currentToken = tokenRef.current;
    setCart([]);
    persistCart([]);

    if (currentToken) {
      try {
        await clearCustomerCartApi(currentToken);
      } catch (err: any) {
        console.error('Database clear cart failed:', err);
      }
    }
  }, [persistCart]);

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
