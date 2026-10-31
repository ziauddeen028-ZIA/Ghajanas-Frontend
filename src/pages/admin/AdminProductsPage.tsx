import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import type { Product, Category } from '../../types';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/catalogApi';
import { formatCurrency } from '../../utils/formatters';
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  RefreshCw,
  FolderPlus,
  Layers,
  X,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface VariantFormInput {
  id?: string;
  label: string;
  price: number | string;
  originalPrice?: number | string;
  stockCount: number | string;
  inStock: boolean;
}

const emptyVariant: VariantFormInput = {
  label: '1 kg',
  price: 100,
  originalPrice: 120,
  stockCount: 50,
  inStock: true,
};

export const AdminProductsPage: React.FC = () => {
  const { token } = useAuth();

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'featured'>('all');

  // Product Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Product Form states
  const [formName, setFormName] = useState('');
  const [formTamilName, setFormTamilName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formOrigin, setFormOrigin] = useState('Tamil Nadu');
  const [formShortDescription, setFormShortDescription] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBenefits, setFormBenefits] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formImages, setFormImages] = useState<string[]>(['']);
  const [formVariants, setFormVariants] = useState<VariantFormInput[]>([{ ...emptyVariant }]);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsTopSeller, setFormIsTopSeller] = useState(false);
  const [formIsOrganic, setFormIsOrganic] = useState(true);

  // Category Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catTamilName, setCatTamilName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catIconName, setCatIconName] = useState('Sparkles');
  const [catIsPopular, setCatIsPopular] = useState(false);
  const [catIsActive, setCatIsActive] = useState(true);

  // Delete confirmation
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Load live data from backend
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([
        getProducts({ all: true }, token),
        getCategories(true, token),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to catalog database');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open Product Modal (Create / Edit)
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormName(product.name);
      setFormTamilName(product.tamilName || '');
      setFormCategoryId(product.categoryId);
      setFormOrigin(product.origin || 'Tamil Nadu');
      setFormShortDescription(product.shortDescription || '');
      setFormDescription(product.description || '');
      setFormBenefits((product.benefits || []).join('\n'));
      setFormBadge(product.badge || '');
      setFormImages(product.images.length > 0 ? product.images : ['']);
      setFormVariants(
        product.weightOptions.length > 0
          ? product.weightOptions.map((w) => ({
              id: w.id,
              label: w.label,
              price: w.price,
              originalPrice: w.originalPrice ?? '',
              stockCount: w.stockCount ?? 50,
              inStock: w.inStock,
            }))
          : [{ ...emptyVariant }]
      );
      setFormIsActive(product.isActive !== false);
      setFormIsFeatured(Boolean(product.isFeatured));
      setFormIsTopSeller(Boolean(product.isTopSeller));
      setFormIsOrganic(Boolean(product.isOrganic));
    } else {
      setEditingProduct(null);
      setFormName('');
      setFormTamilName('');
      setFormCategoryId(categories[0]?.id || '');
      setFormOrigin('Tamil Nadu');
      setFormShortDescription('');
      setFormDescription('');
      setFormBenefits('');
      setFormBadge('');
      setFormImages(['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80']);
      setFormVariants([{ ...emptyVariant }]);
      setFormIsActive(true);
      setFormIsFeatured(false);
      setFormIsTopSeller(false);
      setFormIsOrganic(true);
    }
    setIsProductModalOpen(true);
  };

  // Submit Product Form
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('You must be logged in as an administrator.');
      return;
    }

    if (!formName.trim() || !formCategoryId) {
      alert('Please provide product name and category.');
      return;
    }

    const cleanImages = formImages.map((img) => img.trim()).filter(Boolean);
    if (cleanImages.length === 0) {
      alert('Please add at least one product image URL.');
      return;
    }

    const cleanVariants = formVariants.map((v) => ({
      id: v.id,
      label: v.label.trim(),
      price: Number(v.price),
      originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined,
      stockCount: Number(v.stockCount) || 0,
      inStock: v.inStock,
    }));

    if (cleanVariants.length === 0 || cleanVariants.some((v) => !v.label || isNaN(v.price))) {
      alert('Each variant must have a valid label and numeric price.');
      return;
    }

    const benefitsArray = formBenefits
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const productPayload = {
      name: formName.trim(),
      tamilName: formTamilName.trim() || undefined,
      categoryId: formCategoryId,
      origin: formOrigin.trim(),
      shortDescription: formShortDescription.trim(),
      description: formDescription.trim(),
      benefits: benefitsArray,
      badge: formBadge.trim() || undefined,
      images: cleanImages,
      variants: cleanVariants,
      isActive: formIsActive,
      isFeatured: formIsFeatured,
      isTopSeller: formIsTopSeller,
      isOrganic: formIsOrganic,
    };

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productPayload, token);
        showNotification(`Product "${formName}" updated successfully in database!`);
      } else {
        await createProduct(productPayload, token);
        showNotification(`Product "${formName}" created successfully in database!`);
      }
      setIsProductModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle active/featured status
  const handleToggleStatus = async (product: Product, field: 'isActive' | 'isFeatured') => {
    if (!token) return;
    const newVal = !product[field];
    try {
      await toggleProductStatus(product.id, { [field]: newVal }, token);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, [field]: newVal } : p))
      );
      showNotification(`Updated ${field === 'isActive' ? 'active status' : 'featured status'} for ${product.name}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!token) return;
    try {
      await deleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeletingProductId(null);
      showNotification('Product deleted from database.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // Open Category Modal
  const handleOpenCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatTamilName(cat.tamilName || '');
      setCatSlug(cat.slug);
      setCatDescription(cat.description || '');
      setCatImage(cat.image || '');
      setCatIconName(cat.iconName || 'Sparkles');
      setCatIsPopular(Boolean(cat.isPopular));
      setCatIsActive(cat.isActive !== false);
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatTamilName('');
      setCatSlug('');
      setCatDescription('');
      setCatImage('');
      setCatIconName('Sparkles');
      setCatIsPopular(false);
      setCatIsActive(true);
    }
    setIsCategoryModalOpen(true);
  };

  // Save Category Form
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!catName.trim()) {
      alert('Category name is required.');
      return;
    }

    const payload = {
      name: catName.trim(),
      tamilName: catTamilName.trim() || undefined,
      slug: catSlug.trim() || undefined,
      description: catDescription.trim() || undefined,
      image: catImage.trim() || undefined,
      iconName: catIconName.trim() || 'Sparkles',
      isPopular: catIsPopular,
      isActive: catIsActive,
    };

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, payload, token);
        showNotification(`Category "${catName}" updated successfully!`);
      } else {
        await createCategory(payload, token);
        showNotification(`Category "${catName}" created successfully!`);
      }
      setIsCategoryModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!token) return;
    try {
      await deleteCategory(id, token);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeletingCategoryId(null);
      showNotification('Category deleted successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  // Filter products list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tamilName && p.tamilName.includes(searchTerm)) ||
      (p.origin && p.origin.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      p.categoryId === selectedCategory ||
      p.categoryName === selectedCategory;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && p.isActive !== false) ||
      (statusFilter === 'inactive' && p.isActive === false) ||
      (statusFilter === 'featured' && p.isFeatured);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayout
      title="Catalog & Products Management"
      subtitle="Full Supabase PostgreSQL persistence with Prisma ORM. Manage categories, multiple product images, weight variants, prices, and inventory."
    >
      <div className="space-y-6">
        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-900 shadow-sm">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadData}
              className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Tab Selector & Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-cream-200 shadow-sm">
          <div className="flex items-center gap-2 bg-cream-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'categories'
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Categories ({categories.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-cream-200 hover:bg-cream-50 text-slate-600 transition-colors"
              title="Refresh database records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-forest-700' : ''}`} />
            </button>

            {activeTab === 'products' ? (
              <button
                type="button"
                onClick={() => handleOpenProductModal()}
                className="w-full sm:w-auto px-4 py-2.5 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenCategoryModal()}
                className="w-full sm:w-auto px-4 py-2.5 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            )}
          </div>
        </div>

        {/* PRODUCTS VIEW */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Search & Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products by name or origin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-cream-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-800 outline-none"
                />
              </div>

              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-cream-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-800 outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-cream-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-800 outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                  <option value="featured">Featured Only</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-cream-200">
                    <tr>
                      <th className="py-3 px-4">Product Details</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Weight Variants / Stock</th>
                      <th className="py-3 px-4">Status & Flags</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-forest-700" />
                          <span>Loading products from database...</span>
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          <p className="font-semibold text-slate-600">No products match the selected filters.</p>
                          <p className="text-[11px] mt-1">Try resetting the search terms or create a new product above.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-cream-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative shrink-0">
                                <img
                                  src={p.images[0] || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80'}
                                  alt={p.name}
                                  className="w-12 h-12 rounded-xl object-cover bg-cream-100 border border-cream-200 shadow-2xs"
                                />
                                {p.images.length > 1 && (
                                  <span className="absolute -bottom-1 -right-1 bg-forest-900 text-white text-[9px] font-bold px-1 rounded-full">
                                    +{p.images.length - 1}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate max-w-xs">{p.name}</p>
                                {p.tamilName && (
                                  <p className="text-[11px] text-emerald-800 font-medium">{p.tamilName}</p>
                                )}
                                <p className="text-[10px] text-slate-400 mt-0.5">{p.origin}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">
                            <span className="px-2.5 py-1 rounded-lg bg-cream-100 text-slate-700 text-[11px] border border-cream-200">
                              {p.categoryName || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                              {p.weightOptions.map((opt) => (
                                <span
                                  key={opt.id}
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                    opt.inStock
                                      ? 'bg-cream-100 text-slate-800 border-cream-200'
                                      : 'bg-rose-50 text-rose-700 border-rose-200 line-through'
                                  }`}
                                >
                                  {opt.label}: {formatCurrency(opt.price)}{' '}
                                  <span className="text-[9px] text-slate-400">({opt.stockCount ?? 0} in stock)</span>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(p, 'isActive')}
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                                  p.isActive !== false
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                                title="Click to toggle active status"
                              >
                                {p.isActive !== false ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                                <span>{p.isActive !== false ? 'Active' : 'Inactive'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(p, 'isFeatured')}
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                                  p.isFeatured
                                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                    : 'bg-cream-100 text-slate-400 hover:bg-cream-200'
                                }`}
                                title="Click to toggle featured status"
                              >
                                <Star className={`w-2.5 h-2.5 ${p.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                                <span>{p.isFeatured ? 'Featured' : 'Regular'}</span>
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenProductModal(p)}
                                className="p-2 rounded-lg bg-cream-100 hover:bg-forest-100 text-forest-800 transition-colors"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingProductId(p.id)}
                                className="p-2 rounded-lg bg-cream-100 hover:bg-rose-100 text-rose-700 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES VIEW */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-cream-200">
                  <tr>
                    <th className="py-3 px-4">Category Name</th>
                    <th className="py-3 px-4">URL Slug</th>
                    <th className="py-3 px-4">Products Linked</th>
                    <th className="py-3 px-4">Status & Popular</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {c.image ? (
                            <img
                              src={c.image}
                              alt={c.name}
                              className="w-10 h-10 rounded-xl object-cover bg-cream-100 border border-cream-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-forest-900 text-amber-400 flex items-center justify-center font-bold">
                              <Sparkles className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900">{c.name}</p>
                            {c.tamilName && (
                              <p className="text-[11px] text-emerald-800 font-medium">{c.tamilName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        /{c.slug}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-cream-100 text-slate-700 font-bold text-[10px] border border-cream-200">
                          {c.itemCount ?? 0} Products
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.isActive !== false
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {c.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                          {c.isPopular && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Popular
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenCategoryModal(c)}
                            className="p-2 rounded-lg bg-cream-100 hover:bg-forest-100 text-forest-800 transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingCategoryId(c.id)}
                            className="p-2 rounded-lg bg-cream-100 hover:bg-rose-100 text-rose-700 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCT CREATE / EDIT MODAL */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-cream-200 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-cream-200">
                <h3 className="font-serif font-bold text-lg text-forest-950">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Database'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 pt-4 text-xs">
                {/* Basic info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Product Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Pure Organic Naatu Sakkarai"
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tamil Name (தமிழ்)
                    </label>
                    <input
                      type="text"
                      value={formTamilName}
                      onChange={(e) => setFormTamilName(e.target.value)}
                      placeholder="e.g. இயற்கை நாட்டு சர்க்கரை"
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formCategoryId}
                      onChange={(e) => setFormCategoryId(e.target.value)}
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-800"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Origin Location
                    </label>
                    <input
                      type="text"
                      value={formOrigin}
                      onChange={(e) => setFormOrigin(e.target.value)}
                      placeholder="e.g. Erode, Tamil Nadu"
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-800"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Short Summary (Displayed on cards)
                  </label>
                  <input
                    type="text"
                    value={formShortDescription}
                    onChange={(e) => setFormShortDescription(e.target.value)}
                    placeholder="Short summary for preview cards..."
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Product Description
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Comprehensive description of traditional production method, authenticity, etc."
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                {/* Multiple Images Support */}
                <div className="p-4 bg-cream-50/70 rounded-2xl border border-cream-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-forest-700" />
                      <span>Product Images (Multiple Supported)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormImages([...formImages, ''])}
                      className="text-xs font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Image URL</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formImages.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="url"
                          required={idx === 0}
                          value={img}
                          onChange={(e) => {
                            const updated = [...formImages];
                            updated[idx] = e.target.value;
                            setFormImages(updated);
                          }}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="flex-1 px-3 py-1.5 bg-white border border-cream-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-800"
                        />
                        {formImages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setFormImages(formImages.filter((_, i) => i !== idx))}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Variants, Prices & Stock */}
                <div className="p-4 bg-cream-50/70 rounded-2xl border border-cream-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">
                      Product Variants (Weights, Prices & Stock) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormVariants([...formVariants, { ...emptyVariant, label: '500 g' }])}
                      className="text-xs font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Variant</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {formVariants.map((v, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-center bg-white p-2.5 rounded-xl border border-cream-200"
                      >
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">Pack / Weight</span>
                          <input
                            type="text"
                            required
                            value={v.label}
                            onChange={(e) => {
                              const updated = [...formVariants];
                              updated[idx].label = e.target.value;
                              setFormVariants(updated);
                            }}
                            placeholder="e.g. 500 g, 1 kg"
                            className="w-full px-2 py-1 bg-cream-50 border border-cream-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">Price (₹)</span>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={v.price}
                            onChange={(e) => {
                              const updated = [...formVariants];
                              updated[idx].price = e.target.value;
                              setFormVariants(updated);
                            }}
                            className="w-full px-2 py-1 bg-cream-50 border border-cream-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">MRP / Strike (₹)</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={v.originalPrice ?? ''}
                            onChange={(e) => {
                              const updated = [...formVariants];
                              updated[idx].originalPrice = e.target.value;
                              setFormVariants(updated);
                            }}
                            placeholder="Optional"
                            className="w-full px-2 py-1 bg-cream-50 border border-cream-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">Inventory Stock</span>
                          <input
                            type="number"
                            min="0"
                            value={v.stockCount}
                            onChange={(e) => {
                              const updated = [...formVariants];
                              updated[idx].stockCount = e.target.value;
                              setFormVariants(updated);
                            }}
                            className="w-full px-2 py-1 bg-cream-50 border border-cream-200 rounded-lg text-xs"
                          />
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-2 col-span-2 sm:col-span-1 pt-1 sm:pt-0">
                          <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={v.inStock}
                              onChange={(e) => {
                                const updated = [...formVariants];
                                updated[idx].inStock = e.target.checked;
                                setFormVariants(updated);
                              }}
                              className="rounded text-forest-700"
                            />
                            <span>In Stock</span>
                          </label>
                          {formVariants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setFormVariants(formVariants.filter((_, i) => i !== idx))}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Benefits / Highlights (One per line)
                    </label>
                    <textarea
                      rows={2}
                      value={formBenefits}
                      onChange={(e) => setFormBenefits(e.target.value)}
                      placeholder="Zero chemicals or sulfur&#10;Rich in iron and zinc"
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Special Ribbon Badge (Optional)
                    </label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="e.g. Bestseller, GI Tagged, High Protein"
                      className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Flags: Active, Featured, Top Seller, Organic */}
                <div className="p-4 bg-cream-100 rounded-2xl border border-cream-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="rounded text-forest-800 w-4 h-4"
                    />
                    <span>Active in Store</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="rounded text-forest-800 w-4 h-4"
                    />
                    <span>Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formIsTopSeller}
                      onChange={(e) => setFormIsTopSeller(e.target.checked)}
                      className="rounded text-forest-800 w-4 h-4"
                    />
                    <span>Top Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={formIsOrganic}
                      onChange={(e) => setFormIsOrganic(e.target.checked)}
                      className="rounded text-forest-800 w-4 h-4"
                    />
                    <span>100% Organic</span>
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-200">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 border border-cream-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-cream-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-xs font-bold shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving to Database...' : editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CATEGORY CREATE / EDIT MODAL */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-cream-200">
              <div className="flex items-center justify-between pb-4 border-b border-cream-200">
                <h3 className="font-serif font-bold text-lg text-forest-950">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Traditional Rice"
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tamil Name (தமிழ்)
                  </label>
                  <input
                    type="text"
                    value={catTamilName}
                    onChange={(e) => setCatTamilName(e.target.value)}
                    placeholder="e.g. பாரம்பரிய அரிசி"
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    URL Slug (Optional, auto-generated if blank)
                  </label>
                  <input
                    type="text"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="e.g. traditional-rice"
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl outline-none focus:ring-2 focus:ring-forest-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category Description
                  </label>
                  <textarea
                    rows={2}
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                    placeholder="Short description of this department..."
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl outline-none"
                  />
                </div>

                <div className="flex items-center gap-6 p-3 bg-cream-50 rounded-xl border border-cream-200">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={catIsActive}
                      onChange={(e) => setCatIsActive(e.target.checked)}
                      className="rounded text-forest-800"
                    />
                    <span>Active Category</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={catIsPopular}
                      onChange={(e) => setCatIsPopular(e.target.checked)}
                      className="rounded text-forest-800"
                    />
                    <span>Mark as Popular</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-200">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 border border-cream-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-cream-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-xs font-bold shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE PRODUCT CONFIRMATION MODAL */}
        {deletingProductId && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-cream-200">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Delete Product from Database?</h4>
                <p className="text-xs text-slate-500 mt-1">
                  This will permanently remove the product and its variants from your live database.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingProductId(null)}
                  className="px-4 py-2 border border-cream-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProduct(deletingProductId)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CATEGORY CONFIRMATION MODAL */}
        {deletingCategoryId && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-cream-200">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Delete Category?</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Categories containing products cannot be deleted. Any unlinked category will be permanently removed.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingCategoryId(null)}
                  className="px-4 py-2 border border-cream-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(deletingCategoryId)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
