import {
  CURRENCY_PER_USD,
  type CurrencyCode,
  minorExponent,
} from "@/domain/currency/currencies";

export function convertMinor(
  amountMinor: number,
  from: CurrencyCode,
  to: CurrencyCode,
): number {
  if (from === to) {
    return amountMinor;
  }

  const fromMajor = amountMinor / 10 ** minorExponent(from);
  const usd = fromMajor / CURRENCY_PER_USD[from];
  const toMajor = usd * CURRENCY_PER_USD[to];

  return Math.round(toMajor * 10 ** minorExponent(to));
}

export function formatMoney(
  amountMinor: number,
  currency: CurrencyCode,
  locale: string,
): string {
  const major = amountMinor / 10 ** minorExponent(currency);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(major);
}
