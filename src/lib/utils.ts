// Currency formatter
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Date formatter
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

// MongoDB ObjectId validator
export const isValidObjectId = (id: string): boolean => {
  if (!id) return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}