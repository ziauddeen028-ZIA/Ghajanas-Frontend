import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { CheckoutFormData, OrderDetails, CartItem } from '../types';
import { formatCurrency, generateOrderId } from '../utils/formatters';
import {
  createOrderWhatsAppMessage,
  generateWhatsAppLink,
  STORE_PHONE_NUMBER,
} from '../utils/whatsapp';
import {
  ShieldCheck,
  MessageCircle,
  ArrowLeft,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Banknote,
  QrCode,
  Copy,
  Check,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const OWNER_UPI_ID = import.meta.env.VITE_OWNER_UPI_ID || '916382240715@upi';
const OWNER_UPI_NAME = import.meta.env.VITE_OWNER_UPI_NAME || 'NJ Essentials / Ghajanas';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user, token, profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: profile?.fullName || user?.user_metadata?.full_name || '',
    phone: profile?.phone || user?.user_metadata?.phone || '',
    alternatePhone: profile?.alternatePhone || '',
    addressLine: profile?.addressLine || '',
    landmark: profile?.landmark || '',
    city: profile?.city || 'Tiruchirappalli',
    state: profile?.state || 'Tamil Nadu',
    pincode: profile?.pincode || '',
    deliveryNotes: profile?.deliveryNotes || '',
    paymentMethod: 'upi',
  });

  const [saveToProfile, setSaveToProfile] = useState(true);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Sync profile when loaded
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || profile.fullName || '',
        phone: prev.phone || profile.phone || '',
        alternatePhone: prev.alternatePhone || profile.alternatePhone || '',
        addressLine: prev.addressLine || profile.addressLine || '',
        landmark: prev.landmark || profile.landmark || '',
        city: prev.city || profile.city || 'Tiruchirappalli',
        state: prev.state || profile.state || 'Tamil Nadu',
        pincode: prev.pincode || profile.pincode || '',
        deliveryNotes: prev.deliveryNotes || profile.deliveryNotes || '',
      }));
    }
  }, [profile]);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif font-bold text-2xl text-slate-800 mb-2">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-forest-900 text-white rounded-xl text-sm font-bold inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Essentials
        </Link>
      </div>
    );
  }

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(OWNER_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Please enter your 10-digit phone number';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (formData.alternatePhone) {
      const cleanAlt = formData.alternatePhone.replace(/[^0-9]/g, '');
      if (!phoneRegex.test(cleanAlt)) {
        newErrors.alternatePhone = 'Please enter a valid 10-digit alternate number';
      }
    }

    if (!formData.addressLine.trim()) {
      newErrors.addressLine = 'Please enter your complete delivery street address';
    } else if (formData.addressLine.trim().length < 8) {
      newErrors.addressLine = 'Address is too short, please include house/flat no and street';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city/town';
    }

    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Please enter your 6-digit postal pincode';
    } else if (!pinRegex.test(formData.pincode.trim())) {
      newErrors.pincode = 'Invalid postal pincode format (e.g. 620019)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const processOrderCompletion = async (sendDirectToWhatsApp: boolean) => {
    if (!validate()) {
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    // Save profile update if customer checked the checkbox
    if (saveToProfile) {
      updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        addressLine: formData.addressLine,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        deliveryNotes: formData.deliveryNotes,
      });
    }

    // Freeze permanent snapshot of delivery address for this order
    const addressSnapshot = {
      fullName: formData.fullName,
      phone: formData.phone,
      alternatePhone: formData.alternatePhone,
      addressLine: formData.addressLine,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      deliveryNotes: formData.deliveryNotes,
    };

    let confirmedOrderId = generateOrderId();
    let savedOrderPayload: OrderDetails = {
      orderId: confirmedOrderId,
      items: [...cart],
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      customer: { ...formData, ...addressSnapshot },
      paymentMethod: formData.paymentMethod,
      paymentStatus: 'Unpaid', // Initial payment status: Unpaid until verified
      orderStatus: 'Received',
      createdAt: new Date().toISOString(),
    };

    // Save order in backend before opening WhatsApp
    if (token) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart,
            subtotal,
            deliveryFee,
            discount: 0,
            total,
            customer: addressSnapshot,
            paymentMethod: formData.paymentMethod,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            savedOrderPayload = data.order;
            confirmedOrderId = data.order.orderId;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn('Backend order recording notice:', errData.error);
        }
      } catch (e) {
        console.warn('Order saved locally (backend unreachable in Phase 1)');
      }
    }

    // Persist to session storage for the success confirmation screen
    try {
      sessionStorage.setItem('nj_last_order', JSON.stringify(savedOrderPayload));
    } catch (e) {
      console.error(e);
    }

    // Prepare WhatsApp Message with the confirmed order ID and snapshot details
    const whatsappMessage = createOrderWhatsAppMessage(
      confirmedOrderId,
      savedOrderPayload.customer,
      cart,
      subtotal,
      deliveryFee,
      total
    );

    // Open WhatsApp if chosen
    if (sendDirectToWhatsApp || formData.paymentMethod === 'whatsapp_order') {
      const whatsappUrl = generateWhatsAppLink(whatsappMessage, STORE_PHONE_NUMBER);
      window.open(whatsappUrl, '_blank');
    }

    clearCart();
    setIsSubmitting(false);
    navigate('/order-success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Title */}
      <div className="mb-8 pb-4 border-b border-cream-200 flex items-center justify-between">
        <div>
          <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-forest-950">
            Delivery & Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Signed in as <strong>{user?.email}</strong>
          </p>
        </div>
        <Link
          to="/cart"
          className="text-xs font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Delivery Address */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200">
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-forest-700" />
                Customer & Delivery Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Saved details from your customer profile are pre-filled below.
              </p>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Senthil Kumar"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 pl-10 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.fullName
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-400'
                      : 'border-cream-300 bg-cream-50 focus:bg-white focus:ring-2 focus:ring-forest-600'
                  }`}
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {errors.fullName && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Primary Mobile / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3.5 py-2.5 pl-10 rounded-xl border text-sm focus:outline-none transition-all ${
                      errors.phone
                        ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-400'
                        : 'border-cream-300 bg-cream-50 focus:bg-white focus:ring-2 focus:ring-forest-600'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                {errors.phone && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Alternate Phone <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="alternatePhone"
                  maxLength={10}
                  placeholder="e.g. 9443210000"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            </div>

            {/* Address Line */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Complete Delivery Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="addressLine"
                rows={2}
                placeholder="Door/Flat No, Apartment/Building Name, Street Name, Area"
                value={formData.addressLine}
                onChange={handleInputChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.addressLine
                    ? 'border-rose-400 bg-rose-50/30 focus:ring-2 focus:ring-rose-400'
                    : 'border-cream-300 bg-cream-50 focus:bg-white focus:ring-2 focus:ring-forest-600'
                }`}
              />
              {errors.addressLine && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.addressLine}
                </p>
              )}
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nearby Landmark <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="landmark"
                placeholder="e.g. Near Urumu College or Opposite Temple"
                value={formData.landmark}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  City / Town <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Tiruchirappalli"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.city
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-cream-300 bg-cream-50 focus:bg-white focus:ring-2 focus:ring-forest-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  State <span className="text-rose-500">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Puducherry">Puducherry</option>
                  <option value="Other">Other States</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Pincode <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  maxLength={6}
                  placeholder="e.g. 620019"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.pincode
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-cream-300 bg-cream-50 focus:bg-white focus:ring-2 focus:ring-forest-600'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-xs text-rose-500 mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>

            {/* Special Delivery Instructions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Special Delivery Instructions <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="deliveryNotes"
                placeholder="e.g. Call before delivery, deliver after 4 PM"
                value={formData.deliveryNotes}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            {/* Save to Profile Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={saveToProfile}
                  onChange={(e) => setSaveToProfile(e.target.checked)}
                  className="rounded text-forest-800 focus:ring-forest-600 w-4 h-4"
                />
                <span>Save these delivery details in my profile for future orders</span>
              </label>
              <p className="text-[11px] text-slate-400 ml-6 mt-0.5">
                Note: Updating your profile never alters past order address records.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-5 border-t border-cream-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Select Payment Method:
              </label>
              <div className="space-y-3">
                {/* Option 1: Direct UPI */}
                <label
                  className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'upi'
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-cream-300 hover:bg-cream-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-emerald-600" />
                        <span>Direct UPI Payment (GPay, PhonePe, Paytm)</span>
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Transfer payment directly to store owner's verified UPI account.
                      </p>
                    </div>
                  </div>

                  {/* UPI Details Box */}
                  {formData.paymentMethod === 'upi' && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Owner UPI ID:
                          </span>
                          <span className="font-mono font-bold text-emerald-900 text-sm">
                            {OWNER_UPI_ID}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Name: {OWNER_UPI_NAME}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold flex items-center gap-1 text-[11px]"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Copy UPI ID</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 pt-1 border-t border-cream-200">
                        1. Pay <strong>{formatCurrency(total)}</strong> to the UPI ID above.<br />
                        2. Keep your UPI reference ID or screenshot ready.<br />
                        3. Your order will be created as <em>Unpaid</em> and manually verified by the store admin upon dispatch.
                      </p>
                    </div>
                  )}
                </label>

                {/* Option 2: Cash on Delivery (COD) */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'bg-forest-50/80 border-forest-600 ring-2 ring-forest-600/20'
                      : 'border-cream-300 hover:bg-cream-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="mt-1 text-forest-700 focus:ring-forest-600"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-forest-700" />
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pay cash to the delivery courier upon arrival at your doorstep. Initial status is Unpaid until collection.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Right Summary: Items preview & Submit */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-6">
          <h2 className="font-serif font-bold text-lg text-forest-950 pb-3 border-b border-cream-200">
            Order Items ({cart.length})
          </h2>

          {/* Mini item list */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.map((item: CartItem) => (
              <div
                key={`${item.productId}-${item.selectedWeight.id}`}
                className="flex items-center gap-3 text-xs"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-12 h-12 rounded-xl object-cover bg-cream-50 border border-cream-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{item.productName}</p>
                  <p className="text-slate-500">
                    {item.selectedWeight.label} × {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-slate-900">
                  {formatCurrency(item.selectedWeight.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="pt-4 border-t border-cream-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total:</span>
              <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Delivery:</span>
              <span className="font-bold">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-extrabold uppercase">FREE</span>
                ) : (
                  formatCurrency(deliveryFee)
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-serif font-extrabold text-forest-950 pt-3 border-t border-cream-200">
              <span>Total Payable:</span>
              <span className="text-forest-900 text-xl">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => processOrderCompletion(true)}
              className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Place Order & Open WhatsApp</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => processOrderCompletion(false)}
              className="w-full py-3 px-4 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Confirm Order Directly</span>
            </button>
          </div>

          {/* Guarantee Pill */}
          <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 flex items-center gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              100% Native Quality Guarantee. Farm-gate unadulterated essentials.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
