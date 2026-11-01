export const CURRENCY_SYMBOL = '₹';

/**
 * Format a numeric amount in Indian Rupees (₹) with Indian digit grouping (Lakhs / Crores).
 * e.g., 142000 -> "₹1,42,000"
 */
export function formatINR(amount, options = {}) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  const num = Number(amount);
  const decimals = options.decimals !== undefined ? options.decimals : 0;
  
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  });

  return `${CURRENCY_SYMBOL}${formatted}`;
}

export function formatCompactINR(amount) {
  if (!amount || isNaN(amount)) return '₹0';
  const num = Number(amount);
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(1)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)} Lakh`;
  }
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)}K`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}
