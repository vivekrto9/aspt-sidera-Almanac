import { shopCatalogProducts, type ShopProductId } from "./catalog.ts";
import type { ShopCheckoutFlowCopy } from "../locale/shop/sections/checkout-flow.ts";

export type ShopCartItem = {
  id: ShopProductId;
  quantity: number;
  variant?: string;
};

export const shopCartStorageKey = "sidera-shop-cart-v1";
export const shopOrderStorageKey = "sidera-shop-order-v1";
export const shopFreeShippingThreshold = 75;
export const shopFlatShipping = 6.5;
export const shopEstimatedTaxRate = 0.08;

export const shopReviewCart: ShopCartItem[] = [
  { id: "natal-print", quantity: 1, variant: "Oak" },
  { id: "candle", quantity: 1, variant: "Cedar" },
];

export const normalizeShopCart = (value: unknown): ShopCartItem[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as Partial<ShopCartItem>;
    const product = shopCatalogProducts.find(
      (entry) => entry.id === candidate.id,
    );
    if (!product) return [];
    const quantity = Math.min(
      99,
      Math.max(1, Math.trunc(Number(candidate.quantity) || 1)),
    );
    return [
      {
        id: product.id,
        quantity,
        variant:
          typeof candidate.variant === "string"
            ? candidate.variant.slice(0, 80)
            : undefined,
      },
    ];
  });
};

export const getShopCommerceTotals = (items: ShopCartItem[]) => {
  const subtotal = normalizeShopCart(items).reduce((sum, item) => {
    const product = shopCatalogProducts.find((entry) => entry.id === item.id);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const shipping =
    subtotal >= shopFreeShippingThreshold || subtotal === 0
      ? 0
      : shopFlatShipping;
  const tax = subtotal * shopEstimatedTaxRate;
  return {
    subtotal,
    shipping,
    tax,
    cartTotal: subtotal + shipping,
    grandTotal: subtotal + shipping + tax,
  };
};

export const createShopCheckoutFlowCopy = (
  content: Record<string, string>,
): ShopCheckoutFlowCopy => ({
  cartContinueLabel: content.shop_cart_continue_label,
  cartTitle: content.shop_cart_title,
  cartEmptyTitle: content.shop_cart_empty_title,
  cartEmptyDescription: content.shop_cart_empty_description,
  cartBrowseLabel: content.shop_cart_browse_label,
  orderSummaryTitle: content.shop_order_summary_title,
  subtotalLabel: content.shop_order_subtotal_label,
  shippingLabel: content.shop_order_shipping_label,
  shippingFreeLabel: content.shop_order_shipping_free_label,
  freeShippingPrefix: content.shop_order_free_shipping_prefix,
  freeShippingSuffix: content.shop_order_free_shipping_suffix,
  totalLabel: content.shop_order_total_label,
  checkoutLabel: content.shop_cart_checkout_label,
  secureCheckoutNote: content.shop_cart_secure_note,
  quantityLabel: content.shop_cart_quantity_label,
  removeLabel: content.shop_cart_remove_label,
  decrementLabel: content.shop_cart_decrement_label,
  incrementLabel: content.shop_cart_increment_label,
  checkoutBackLabel: content.shop_checkout_back_label,
  checkoutTitle: content.shop_checkout_title,
  contactTitle: content.shop_checkout_contact_title,
  emailPlaceholder: content.shop_checkout_email_placeholder,
  shippingAddressTitle: content.shop_checkout_shipping_title,
  firstNamePlaceholder: content.shop_checkout_first_name_placeholder,
  lastNamePlaceholder: content.shop_checkout_last_name_placeholder,
  streetPlaceholder: content.shop_checkout_street_placeholder,
  cityPlaceholder: content.shop_checkout_city_placeholder,
  statePlaceholder: content.shop_checkout_state_placeholder,
  postalPlaceholder: content.shop_checkout_postal_placeholder,
  countryPlaceholder: content.shop_checkout_country_placeholder,
  paymentTitle: content.shop_checkout_payment_title,
  encryptedLabel: content.shop_checkout_encrypted_label,
  cardNumberPlaceholder: content.shop_checkout_card_number_placeholder,
  cardNamePlaceholder: content.shop_checkout_card_name_placeholder,
  expiryPlaceholder: content.shop_checkout_expiry_placeholder,
  cvcPlaceholder: content.shop_checkout_cvc_placeholder,
  yourOrderTitle: content.shop_checkout_order_title,
  taxLabel: content.shop_checkout_tax_label,
  placeOrderLabel: content.shop_checkout_place_order_label,
  placeOrderNote: content.shop_checkout_place_order_note,
  confirmationEyebrow: content.shop_confirmation_eyebrow,
  confirmationTitle: content.shop_confirmation_title,
  confirmationThanksPrefix: content.shop_confirmation_thanks_prefix,
  confirmationThanksSuffix: content.shop_confirmation_thanks_suffix,
  orderNumberLabel: content.shop_confirmation_order_number_label,
  arrivesLabel: content.shop_confirmation_arrives_label,
  totalPaidLabel: content.shop_confirmation_total_paid_label,
  continueShoppingLabel: content.shop_confirmation_continue_label,
  returnHomeLabel: content.shop_confirmation_home_label,
  defaultFirstName: content.shop_confirmation_default_first_name,
  arrivalLabel: content.shop_confirmation_arrival_label,
  paymentFailureEyebrow: content.shop_payment_failure_eyebrow,
  paymentFailureTitle: content.shop_payment_failure_title,
  paymentFailureDescription: content.shop_payment_failure_description,
  paymentFailureContextTitle: content.shop_payment_failure_context_title,
  paymentFailureContextDescription: content.shop_payment_failure_context_description,
  paymentFailureRetryLabel: content.shop_payment_failure_retry_label,
  paymentFailureCartLabel: content.shop_payment_failure_cart_label,
});
