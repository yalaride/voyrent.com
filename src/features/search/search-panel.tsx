"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  FAMOUS_SEARCHES,
  getFamousSearch,
} from "@/domain/catalog/famous-searches";
import { catalogPath } from "@/domain/routing/rent-paths";
import type {
  SearchSuggestion,
  VehicleSearchQuery,
} from "@/domain/catalog/types";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

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
  const [suggestions, setSuggestions] =
    useState<SearchSuggestion[]>(popularSuggestions);
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
        const body = (await response.json()) as {
          success: boolean;
          data?: SearchSuggestion[];
        };
        if (body.success && body.data) {
          setSuggestions(body.data);
          setOpen(true);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
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
    if (suggestion.kind === "famous")
      return t(`famous.${suggestion.messageKey}`);
    if (suggestion.kind === "bodyType") return bodyLabels(suggestion.slug);
    return suggestion.label;
  }

  const visible = showingPopular ? popularSuggestions : suggestions;

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-[363px] sm:max-w-[490px] md:max-w-[561px] lg:max-w-[637px]"
    >
      {/* Pill container with semi-transparent frosted styling */}
      <div
        className="relative flex h-[54px] w-full items-center rounded-full border border-white/50 bg-background-primary/60 p-[5px] shadow-large backdrop-blur-md transition-all focus-within:border-white focus-within:bg-background-primary focus-within:shadow-spread dark:border-white/15 dark:bg-black/40"
        onBlur={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            setOpen(false);
          }
        }}
      >
        <Search className="pointer-events-none ms-3.5 size-5 shrink-0 text-text-secondary" />

        <input
          id={queryId}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={t("queryPlaceholder")}
          autoComplete="off"
          spellCheck={false}
          aria-label={t("query")}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${queryId}-suggestions`}
          aria-autocomplete="list"
          className="h-full flex-1 bg-transparent px-3 text-sm text-text-primary placeholder:text-text-primary focus:outline-none sm:text-base"
        />

        {/* Circular icon button on mobile & tab (< lg); wide text pill button on desktop (lg:) */}
        <Button
          type="submit"
          aria-label={t("submit")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary p-0 text-primary-foreground shadow-sm transition-all hover:bg-primary/90 lg:h-11 lg:w-auto lg:px-6"
        >
          <span className="hidden text-sm font-medium lg:inline">
            {t("submit")}
          </span>
          <ArrowRight className="size-5 lg:hidden rtl:rotate-180" />
        </Button>

        {/* Suggestions Dropdown */}
        {open && visible.length > 0 ? (
          <ul
            id={`${queryId}-suggestions`}
            role="listbox"
            aria-label={showingPopular ? t("popular") : t("suggestions")}
            className="absolute inset-x-0 top-[calc(100%+8px)] z-30 max-h-72 overflow-auto rounded-2xl border border-border-default bg-background-primary p-1.5 text-start shadow-large"
          >
            {visible.map((suggestion) => (
              <li key={`${suggestion.kind}-${suggestion.slug}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  className="flex w-full rounded-xl px-3.5 py-2.5 text-start text-sm text-text-primary transition-colors hover:bg-background-secondary"
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
    </form>
  );
}
