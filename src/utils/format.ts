/**
 * Format a number as currency: "420,000 MMK" (amount first, then MMK).
 * Use consistently across the project for MMK amounts.
 */
export function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)} MMK`
}
