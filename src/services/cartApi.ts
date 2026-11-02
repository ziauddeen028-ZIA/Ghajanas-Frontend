import type { CartItem } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

/**
 * Fetch authenticated customer's persistent cart from PostgreSQL.
 */
export const getCustomerCart = async (token: string): Promise<CartItem[]> => {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    headers: getHeaders(token),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load customer cart from database.');
  }

  return data.cart || [];
};

/**
 * Add product variant to authenticated customer's cart in PostgreSQL.
 */
export const addCartItemApi = async (
  productId: string,
  variantId: string,
  quantity: number,
  token: string
): Promise<{ message: string; cart: CartItem[] }> => {
  const res = await fetch(`${API_BASE_URL}/cart/items`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ productId, variantId, quantity }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to add item to cart.');
  }

  return {
    message: data.message,
    cart: data.cart || [],
  };
};

/**
 * Update quantity for an item in customer's cart in PostgreSQL.
 */
export const updateCartItemQtyApi = async (
  variantId: string,
  quantity: number,
  token: string
): Promise<CartItem[]> => {
  const res = await fetch(`${API_BASE_URL}/cart/items/${variantId}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify({ quantity }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update item quantity.');
  }

  return data.cart || [];
};

/**
 * Remove an item variant from customer's cart in PostgreSQL.
 */
export const removeCartItemApi = async (
  variantId: string,
  token: string
): Promise<CartItem[]> => {
  const res = await fetch(`${API_BASE_URL}/cart/items/${variantId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to remove item from cart.');
  }

  return data.cart || [];
};

/**
 * Clear all items from customer's cart in PostgreSQL.
 */
export const clearCustomerCartApi = async (token: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to clear cart.');
  }
};

