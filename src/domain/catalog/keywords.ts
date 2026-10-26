import type { BodyType } from "@/domain/catalog/types";
import type { AppLocale } from "@/domain/geo/locales";

export type PhraseBook = Record<AppLocale, readonly string[]>;

export const BODY_KEYWORDS: Record<BodyType, PhraseBook> = {
  economy: {
    en: ["economy", "compact", "small car"],
    es: ["economico", "compacto"],
    ar: ["اقتصادي", "صغيرة"],
    fr: ["economique", "citadine"],
    pt: ["economico", "compacto"],
  },
  sedan: {
    en: ["sedan", "saloon"],
    es: ["sedan", "berlinas"],
    ar: ["سيدان"],
    fr: ["berline"],
    pt: ["sedan", "berlina"],
  },
  suv: {
    en: ["suv", "crossover", "4x4"],
    es: ["suv", "todoterreno"],
    ar: ["دفع رباعي", "اس يو في"],
    fr: ["suv", "4x4"],
    pt: ["suv", "todo-o-terreno"],
  },
  luxury: {
    en: ["luxury", "premium"],
    es: ["lujo", "premium"],
    ar: ["فاخر", "فخمة"],
    fr: ["luxe", "premium"],
    pt: ["luxo", "premium"],
  },
  sports: {
    en: ["sports", "sport", "supercar"],
    es: ["deportivo"],
    ar: ["رياضية", "سبورت"],
    fr: ["sportive", "sport"],
    pt: ["esportivo", "desportivo"],
  },
  van: {
    en: ["van", "people carrier", "minivan"],
    es: ["furgoneta", "monovolumen"],
    ar: ["فان", "عائلية"],
    fr: ["utilitaire", "monospace"],
    pt: ["carrinha", "monovolume"],
  },
  convertible: {
    en: ["convertible", "cabriolet"],
    es: ["descapotable", "cabrio"],
    ar: ["مكشوفة", "كشف"],
    fr: ["cabriolet", "decapotable"],
    pt: ["descapotavel", "cabrio"],
  },
};

export function joinPhrases(book: PhraseBook): string {
  return Object.values(book).flat().join(" ");
}
