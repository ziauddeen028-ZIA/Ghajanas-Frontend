export interface WeightOption {
  id: string;
  label: string; // e.g. "500 g", "1 kg", "5 kg", "250 g"
  price: number; // in INR
  originalPrice?: number; // for showing discount
  inStock: boolean;
  stockCount?: number;
}

export interface Product {
  id: string;
  name: string;
  tamilName?: string; // e.g. "நாட்டு சர்க்கரை"
  slug: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  origin: string; // e.g. "Erode, Tamil Nadu"
  rating: number;
  reviewCount: number;
  images: string[];
  weightOptions: WeightOption[];
  isFeatured?: boolean;
  isTopSeller?: boolean;
  isOrganic?: boolean;
  badge?: string;
  nutritionHighlights?: { [key: string]: string };
}

export interface Category {
  id: string;
  name: string;
  tamilName?: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  itemCount: number;
  isPopular?: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  tamilName?: string;
  productImage: string;
  categoryName: string;
  selectedWeight: WeightOption;
  quantity: number;
}

export type PaymentMethod = 'whatsapp_order' | 'cod' | 'upi';
export type PaymentStatus = 'Unpaid' | 'Paid';
export type OrderStatus = 'Received' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  alternatePhone?: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  deliveryNotes?: string;
  paymentMethod: PaymentMethod;
}

export interface CustomerProfile {
  userId?: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  deliveryNotes?: string;
}

export interface OrderDetails {
  orderId: string;
  userId?: string;
  userEmail?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customer: CheckoutFormData; // Frozen address snapshot
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus; // Defaults to Unpaid; Admin verifies UPI/COD manually
  orderStatus: OrderStatus; // Defaults to Received
  createdAt: string;
  updatedAt?: string;
}

export interface PendingCartAction {
  product: Product;
  selectedWeight: WeightOption;
  quantity: number;
  returnUrl?: string;
}
