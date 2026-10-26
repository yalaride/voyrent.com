import "server-only";

import {
  currencyReferenceSchema,
  languageReferenceSchema,
  marketReferenceSchema,
} from "@/domain/reference/contract";
import { fetchUpstream, rejectContract } from "@/server/catalog/upstream";

export async function fetchRemoteMarkets() {
  const parsed = marketReferenceSchema.safeParse(await fetchUpstream("/v1/reference/markets"));
  if (!parsed.success) rejectContract(parsed.error);
  return parsed.data;
}

export async function fetchRemoteCurrencies() {
  const parsed = currencyReferenceSchema.safeParse(await fetchUpstream("/v1/reference/currencies"));
  if (!parsed.success) rejectContract(parsed.error);
  return parsed.data;
}

export async function fetchRemoteLanguages() {
  const parsed = languageReferenceSchema.safeParse(await fetchUpstream("/v1/reference/languages"));
  if (!parsed.success) rejectContract(parsed.error);
  return parsed.data;
}
