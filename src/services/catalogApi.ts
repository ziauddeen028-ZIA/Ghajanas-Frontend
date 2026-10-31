import type { Product, Category } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (token?: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ==========================================
// CATEGORIES
// ==========================================

export const getCategories = async (all = false, token?: string | null): Promise<Category[]> => {
  try {
    const url = `${API_BASE_URL}/categories${all ? '?all=true' : ''}`;
    const res = await fetch(url, { headers: getHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.categories || [];
  } catch (err) {
    console.error('getCategories error:', err);
    throw err;
  }
};

export const createCategory = async (categoryData: Partial<Category>, token: string): Promise<Category> => {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(categoryData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create category');
  }
  return data.category;
};

export const updateCategory = async (id: string, categoryData: Partial<Category>, token: string): Promise<Category> => {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(categoryData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update category');
  }
  return data.category;
};

export const deleteCategory = async (id: string, token: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete category');
  }
};

// ==========================================
// PRODUCTS
// ==========================================

export interface ProductFilterParams {
  category?: string;
  search?: string;
  featured?: boolean;
  all?: boolean;
}

export const getProducts = async (params?: ProductFilterParams, token?: string | null): Promise<Product[]> => {
  try {
    const query = new URLSearchParams();
    if (params?.all) query.append('all', 'true');
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.featured) query.append('featured', 'true');

    const qs = query.toString();
    const url = `${API_BASE_URL}/products${qs ? `?${qs}` : ''}`;

    const res = await fetch(url, { headers: getHeaders(token) });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.error('getProducts error:', err);
    throw err;
  }
};

export const getProductById = async (idOrSlug: string): Promise<Product> => {
  const res = await fetch(`${API_BASE_URL}/products/${idOrSlug}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch product');
  return data.product;
};

export const createProduct = async (productData: any, token: string): Promise<Product> => {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create product');
  }
  return data.product;
};

export const updateProduct = async (id: string, productData: any, token: string): Promise<Product> => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update product');
  }
  return data.product;
};

export const toggleProductStatus = async (
  id: string,
  statusData: { isActive?: boolean; isFeatured?: boolean },
  token: string
): Promise<Product> => {
  const res = await fetch(`${API_BASE_URL}/products/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(statusData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update product status');
  }
  return data.product;
};

export const deleteProduct = async (id: string, token: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete product');
  }
};

