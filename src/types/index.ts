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
  paymentMethod: 'whatsapp_order' | 'cod' | 'upi';
}

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customer: CheckoutFormData;
  createdAt: string;
}
