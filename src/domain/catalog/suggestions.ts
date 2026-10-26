import { FAMOUS_SEARCHES } from "@/domain/catalog/famous-searches";
import { BODY_KEYWORDS, type PhraseBook } from "@/domain/catalog/keywords";
import { normalizeSearch } from "@/domain/catalog/text";
import { BODY_TYPES, type MakeOption, type ModelOption, type SearchSuggestion } from "@/domain/catalog/types";

const SUGGESTION_LIMIT = 8;

function phraseMatches(book: PhraseBook, query: string): boolean {
  return Object.values(book).some((phrases) =>
    phrases.some((phrase) => normalizeSearch(phrase).includes(query)),
  );
}

export function suggestSearches(input: {
  q: string;
  makes: readonly MakeOption[];
  models: readonly ModelOption[];
}): SearchSuggestion[] {
  const query = normalizeSearch(input.q);

  if (query.length < 2) {
    return [];
  }

  const suggestions: SearchSuggestion[] = [];

  for (const famous of FAMOUS_SEARCHES) {
    if (phraseMatches(famous.keywords, query) || famous.slug.includes(query)) {
      suggestions.push({
        kind: "famous",
        slug: famous.slug,
        messageKey: famous.messageKey,
      });
    }
  }

  for (const make of input.makes) {
    if (normalizeSearch(make.name).includes(query) || make.slug.includes(query)) {
      suggestions.push({ kind: "make", slug: make.slug, label: make.name });
    }
  }

  for (const model of input.models) {
    const label = `${model.makeName} ${model.name}`;
    if (normalizeSearch(label).includes(query) || model.slug.includes(query)) {
      suggestions.push({
        kind: "model",
        slug: model.slug,
        makeSlug: model.makeSlug,
        label,
      });
    }
  }

  for (const bodyType of BODY_TYPES) {
    if (phraseMatches(BODY_KEYWORDS[bodyType], query) || bodyType.includes(query)) {
      suggestions.push({ kind: "bodyType", slug: bodyType, messageKey: bodyType });
    }
  }

  return suggestions.slice(0, SUGGESTION_LIMIT);
}
