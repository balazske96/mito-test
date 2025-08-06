/**
 * Formats a price amount based on currency code
 * @param amount - The numeric amount to format
 * @param currencyCode - The ISO currency code (e.g., 'EUR', 'USD', 'GBP')
 * @returns A formatted currency string
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  // Define format options
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  };

  // Use browser's Intl API to format the currency properly
  try {
    return new Intl.NumberFormat('en-US', options).format(amount);
  } catch (error) {
    // Fallback in case of unsupported currency code
    return `${amount} ${currencyCode}`;
  }
}
