import type { PhraseBook } from "@/domain/catalog/keywords";
import type { BodyType, SearchSort, VehicleSearchQuery } from "@/domain/catalog/types";

export type FamousSearch = {
  slug: string;
  messageKey:
    | "cheapDaily"
    | "suv"
    | "luxury"
    | "sports"
    | "monthly"
    | "noDeposit"
    | "airport"
    | "sevenSeater";
  query: Partial<Pick<VehicleSearchQuery, "bodyType" | "sort" | "deposit" | "term" | "pickup" | "seats">>;
  keywords: PhraseBook;
};

export const FAMOUS_SEARCHES: readonly FamousSearch[] = [
  {
    slug: "cheap-daily",
    messageKey: "cheapDaily",
    query: { bodyType: "economy", sort: "price_asc" satisfies SearchSort },
    keywords: {
      en: ["cheap", "budget", "affordable", "daily"],
      es: ["barato", "diario"],
      ar: ["رخيص", "يومي"],
      fr: ["pas cher", "journalier"],
      pt: ["barato", "diario"],
    },
  },
  {
    slug: "suv",
    messageKey: "suv",
    query: { bodyType: "suv" satisfies BodyType },
    keywords: {
      en: ["suv", "4x4"],
      es: ["suv", "todoterreno"],
      ar: ["دفع رباعي"],
      fr: ["suv", "4x4"],
      pt: ["suv"],
    },
  },
  {
    slug: "luxury",
    messageKey: "luxury",
    query: { bodyType: "luxury" },
    keywords: {
      en: ["luxury", "premium"],
      es: ["lujo"],
      ar: ["فاخر", "فخمة"],
      fr: ["luxe"],
      pt: ["luxo"],
    },
  },
  {
    slug: "sports",
    messageKey: "sports",
    query: { bodyType: "sports" },
    keywords: {
      en: ["sports", "sport", "supercar"],
      es: ["deportivo"],
      ar: ["رياضية"],
      fr: ["sportive"],
      pt: ["esportivo", "desportivo"],
    },
  },
  {
    slug: "monthly",
    messageKey: "monthly",
    query: { term: "monthly" },
    keywords: {
      en: ["monthly", "long term"],
      es: ["mensual"],
      ar: ["شهري", "شهر"],
      fr: ["mensuel"],
      pt: ["mensal"],
    },
  },
  {
    slug: "no-deposit",
    messageKey: "noDeposit",
    query: { deposit: "none" },
    keywords: {
      en: ["no deposit", "deposit free", "zero deposit"],
      es: ["sin deposito"],
      ar: ["بدون تأمين", "بدون عربون"],
      fr: ["sans caution"],
      pt: ["sem caucao"],
    },
  },
  {
    slug: "airport",
    messageKey: "airport",
    query: { pickup: "airport" },
    keywords: {
      en: ["airport", "delivery"],
      es: ["aeropuerto"],
      ar: ["مطار", "توصيل"],
      fr: ["aeroport"],
      pt: ["aeroporto"],
    },
  },
  {
    slug: "seven-seater",
    messageKey: "sevenSeater",
    query: { seats: 7 },
    keywords: {
      en: ["7 seater", "seven seater", "7 seats"],
      es: ["7 plazas"],
      ar: ["7 مقاعد", "سبعة مقاعد"],
      fr: ["7 places"],
      pt: ["7 lugares"],
    },
  },
];

export function getFamousSearch(slug: string): FamousSearch | undefined {
  return FAMOUS_SEARCHES.find((item) => item.slug === slug);
}
