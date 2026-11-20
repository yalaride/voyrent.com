"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { FAMOUS_SEARCHES, getFamousSearch } from "@/domain/catalog/famous-searches";
import { catalogPath } from "@/domain/routing/rent-paths";
import type { SearchSuggestion, VehicleSearchQuery } from "@/domain/catalog/types";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const popularSuggestions: SearchSuggestion[] = FAMOUS_SEARCHES.map((item) => ({
  kind: "famous",
  slug: item.slug,
  messageKey: item.messageKey,
}));

export function SearchPanel({
  country,
  city,
  initialQuery = "",
}: {
  country: string;
  city: string;
  initialQuery?: string;
}) {
  const t = useTranslations("Search");
  const bodyLabels = useTranslations("BodyTypes");
  const router = useRouter();
  const queryId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>(popularSuggestions);
  const [open, setOpen] = useState(false);

  const trimmed = query.trim();
  const showingPopular = trimmed.length < 2;

  useEffect(() => {
    if (trimmed.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ country, city, q: trimmed });
        const response = await fetch(`/api/v1/catalog/suggestions?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const body = (await response.json()) as { success: boolean; data?: SearchSuggestion[] };
        if (body.success && body.data) {
          setSuggestions(body.data);
          setOpen(true);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }, 160);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [city, country, trimmed]);

  function navigate(next: Partial<VehicleSearchQuery>) {
    setOpen(false);
    router.push(catalogPath(city, next));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({ q: trimmed || undefined });
  }

  function applySuggestion(suggestion: SearchSuggestion) {
    if (suggestion.kind === "famous") {
      navigate(getFamousSearch(suggestion.slug)?.query ?? {});
      return;
    }

    if (suggestion.kind === "bodyType") {
      navigate({ bodyType: suggestion.slug });
      return;
    }

    if (suggestion.kind === "make") {
      navigate({ make: suggestion.slug });
      return;
    }

    navigate({ make: suggestion.makeSlug, model: suggestion.slug });
  }

  function suggestionLabel(suggestion: SearchSuggestion) {
    if (suggestion.kind === "famous") return t(`famous.${suggestion.messageKey}`);
    if (suggestion.kind === "bodyType") return bodyLabels(suggestion.slug);
    return suggestion.label;
  }

  const visible = showingPopular ? popularSuggestions : suggestions;

  return (
    <form role="search" onSubmit={onSubmit} className="flex items-center gap-2">
      <div
        className="relative min-w-0 flex-1"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setOpen(false);
          }
        }}
      >
        <Search className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
        <Input
          id={queryId}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={t("queryPlaceholder")}
          autoComplete="off"
          spellCheck={false}
          aria-label={t("query")}
          className="h-11 ps-9"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${queryId}-suggestions`}
          aria-autocomplete="list"
        />
        {open && visible.length > 0 ? (
          <ul
            id={`${queryId}-suggestions`}
            role="listbox"
            aria-label={showingPopular ? t("popular") : t("suggestions")}
            className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-auto rounded-xl border border-border-default bg-background-primary p-1 shadow-large"
          >
            {visible.map((suggestion) => (
              <li key={`${suggestion.kind}-${suggestion.slug}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  className="flex w-full rounded-lg px-3 py-2.5 text-start text-sm text-text-primary hover:bg-background-secondary"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    applySuggestion(suggestion);
                  }}
                  onClick={() => applySuggestion(suggestion)}
                >
                  {suggestionLabel(suggestion)}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <Button type="submit" className="h-11 shrink-0 px-5">
        {t("submit")}
      </Button>
    </form>
  );
}
