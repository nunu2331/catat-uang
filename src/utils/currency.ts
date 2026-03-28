/**
 * Format number as Indonesian Rupiah (e.g. "Rp 150.000")
 */
export function formatRupiah(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `Rp ${formatted}`;
}

/**
 * Parse user input (e.g. "150000" or "150.000") to number
 */
export function parseRupiahInput(input: string): number {
  const digits = input.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}
