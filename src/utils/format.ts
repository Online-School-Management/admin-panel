/**
 * Format a number as currency: "420,000 MMK" (amount first, then MMK).
 * Accepts unknown so API/string values never break Intl or React text nodes.
 */
export function formatCurrency(amount: unknown): string {
  const n = Number(amount)
  const safe = Number.isFinite(n) ? n : 0
  return `${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safe)} MMK`
}

/**
 * Coerce API / unknown values to a string safe to render as a React text child.
 */
export function safeText(value: unknown, fallback = '—'): string {
  if (value == null) return fallback
  const t = typeof value
  if (t === 'string' || t === 'number' || t === 'boolean') return String(value)
  return fallback
}
