import type { CartItem, CheckoutFormData, Product, WeightOption } from '../types';
import { formatCurrency } from './formatters';

export const STORE_PHONE_NUMBER = '919876543210'; // NJ Essentials Customer Care / Order Desk

/**
 * Creates a prefilled WhatsApp order message for the complete checkout order.
 */
export const createOrderWhatsAppMessage = (
  orderId: string,
  customer: CheckoutFormData,
  items: CartItem[],
  subtotal: number,
  deliveryFee: number,
  total: number
): string => {
  const itemLines = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.productName}* (${item.selectedWeight.label})\n   Qty: ${item.quantity} x ${formatCurrency(item.selectedWeight.price)} = *${formatCurrency(item.selectedWeight.price * item.quantity)}*`
    )
    .join('\n\n');

  const deliveryText = deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee);

  const address = [
    customer.fullName,
    `📞 Phone: ${customer.phone}`,
    customer.alternatePhone ? `📱 Alt: ${customer.alternatePhone}` : null,
    `📍 ${customer.addressLine}`,
    customer.landmark ? `Landmark: ${customer.landmark}` : null,
    `${customer.city}, ${customer.state} - ${customer.pincode}`,
    customer.deliveryNotes ? `📝 Note: "${customer.deliveryNotes}"` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const paymentText =
    customer.paymentMethod === 'whatsapp_order'
      ? 'Pay via UPI / WhatsApp'
      : customer.paymentMethod === 'cod'
      ? 'Cash on Delivery (COD)'
      : 'Online UPI';

  return `🌿 *NEW ORDER - NJ ESSENTIALS* 🌿\n---------------------------------\n*Order Ref:* ${orderId}\n\n*Customer & Delivery Address:*\n${address}\n\n*Ordered Items:*\n${itemLines}\n\n---------------------------------\n*Items Subtotal:* ${formatCurrency(subtotal)}\n*Delivery Fee:* ${deliveryText}\n*TOTAL PAYABLE:* ${formatCurrency(total)}\n*Payment Preference:* ${paymentText}\n---------------------------------\nPlease confirm my order and share estimated dispatch details. Thank you!`;
};

/**
 * Encodes the text message into a direct WhatsApp web/app link.
 */
export const generateWhatsAppLink = (message: string, phone: string = STORE_PHONE_NUMBER): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Generates an instant WhatsApp message for a single product quick inquiry or order.
 */
export const createSingleProductWhatsAppMessage = (
  product: Product,
  selectedWeight: WeightOption,
  quantity: number = 1
): string => {
  const total = selectedWeight.price * quantity;
  return `🌿 *NJ ESSENTIALS QUICK ORDER* 🌿\n\nI want to order:\n*Product:* ${product.name}\n*Variant:* ${selectedWeight.label}\n*Quantity:* ${quantity}\n*Estimated Price:* ${formatCurrency(total)}\n\nPlease let me know availability and delivery to my address.`;
};
