// utils/pricing.js

// Deterministic realistic price generator based on meal ID
export const getMealPrice = (mealOrId) => {
  const idStr = typeof mealOrId === 'object' && mealOrId ? mealOrId.idMeal || '' : String(mealOrId || '');
  if (!idStr) return 199;

  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash * 31 + idStr.charCodeAt(i)) % 10000;
  }

  // Price range: ₹149 to ₹499 in increments of 10
  const basePrices = [149, 179, 199, 229, 249, 279, 299, 349, 399, 449, 499];
  const index = Math.abs(hash) % basePrices.length;
  return basePrices[index];
};

export const formatPrice = (amount) => {
  const num = Number(amount) || 0;
  return `₹${num.toFixed(0)}`;
};

export const calculateOrderSummary = (items = []) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.price || getMealPrice(item.idMeal);
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);

  // Free delivery for orders >= ₹499, else ₹40
  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 40;
  // 5% GST
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  return {
    subtotal,
    deliveryFee,
    tax,
    total,
    freeDeliveryThreshold: 499,
    amountNeededForFreeDelivery: Math.max(0, 499 - subtotal),
  };
};
