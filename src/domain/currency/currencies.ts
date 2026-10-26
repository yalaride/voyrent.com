export const CURRENCY_CODES = ["AED", "USD", "EUR", "GBP", "SAR", "MAD"] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

/**
 * Fixture mid-market rates expressed as units of currency per 1 USD.
 * Replace with the NestJS FX endpoint when it exists. Do not treat these
 * as tradable rates.
 */
export const CURRENCY_PER_USD: Record<CurrencyCode, number> = {
  USD: 1,
  AED: 3.6725,
  SAR: 3.75,
  EUR: 0.92,
  GBP: 0.79,
  MAD: 9.9,
};

const MINOR_EXPONENT: Record<CurrencyCode, number> = {
  USD: 2,
  AED: 2,
  EUR: 2,
  GBP: 2,
  SAR: 2,
  MAD: 2,
};

export function isCurrencyCode(value: string): value is CurrencyCode {
  return (CURRENCY_CODES as readonly string[]).includes(value);
}

export function minorExponent(currency: CurrencyCode): number {
  return MINOR_EXPONENT[currency];
}
