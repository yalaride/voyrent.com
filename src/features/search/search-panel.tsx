"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { ArrowRight, Search, X } from "lucide-react";
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
  variant = "hero",
  currentQuery,
}: {
  country: string;
  city: string;
  initialQuery?: string;
  variant?: "hero" | "toolbar";
  currentQuery?: Partial<VehicleSearchQuery>;
}) {
  const t = useTranslations("Search");
  const bodyLabels = useTranslations("BodyTypes");
  const router = useRouter();
  const queryId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [selectedQuery, setSelectedQuery] =
    useState<Partial<VehicleSearchQuery> | null>(null);
  const [suggestions, setSuggestions] =
    useState<SearchSuggestion[]>(popularSuggestions);
  const [open, setOpen] = useState(false);

  const trimmed = query.trim();
  const showingPopular = trimmed.length < 2;
  const isToolbar = variant === "toolbar";

  useEffect(() => {
    if (trimmed.length < 2 || selectedQuery !== null) {
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
  }, [city, country, selectedQuery, trimmed]);

  function navigate(next: Partial<VehicleSearchQuery>) {
    setOpen(false);
    const merged =
      isToolbar && currentQuery ? { ...currentQuery, ...next, page: 1 } : next;
    router.push(catalogPath(city, merged));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedQuery) {
      navigate(selectedQuery);
      return;
    }
    navigate({ q: trimmed || undefined });
  }

  function suggestionQuery(
    suggestion: SearchSuggestion,
  ): Partial<VehicleSearchQuery> {
    if (suggestion.kind === "famous") {
      return getFamousSearch(suggestion.slug)?.query ?? {};
    }

    if (suggestion.kind === "bodyType") {
      return { bodyType: suggestion.slug };
    }

    if (suggestion.kind === "make") {
      return { make: suggestion.slug, model: undefined };
    }

    return { make: suggestion.makeSlug, model: suggestion.slug };
  }

  function applySuggestion(suggestion: SearchSuggestion) {
    setQuery(suggestionLabel(suggestion));
    const next = suggestionQuery(suggestion);
    setSelectedQuery(next);
    setOpen(false);

    if (isToolbar) {
      navigate(next);
    }
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
      className={
        isToolbar
          ? "w-full lg:max-w-[330px] shrink-0"
          : "mx-auto w-full max-w-[363px] sm:max-w-[490px] md:max-w-[561px] lg:max-w-[637px]"
      }
    >
      <div
        className={
          isToolbar
            ? "relative flex h-11 w-full items-center rounded-full border border-white/25 bg-white/5 px-1.5 transition-colors focus-within:border-white/60 focus-within:bg-white/10"
            : "relative flex h-[54px] w-full items-center rounded-full border border-white/50 bg-background-primary/60 p-[5px] shadow-large backdrop-blur-md transition-all focus-within:border-white focus-within:bg-background-primary focus-within:shadow-spread dark:border-white/15 dark:bg-black/40"
        }
        onBlur={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            setOpen(false);
          }
        }}
      >
        <Search
          className={
            isToolbar
              ? "pointer-events-none ms-2.5 size-4 shrink-0 text-white/70"
              : "pointer-events-none ms-3.5 size-5 shrink-0 text-text-secondary"
          }
        />

        <input
          id={queryId}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedQuery(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("queryPlaceholder")}
          autoComplete="off"
          spellCheck={false}
          aria-label={t("query")}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${queryId}-suggestions`}
          aria-autocomplete="list"
          className={
            isToolbar
              ? "h-full flex-1 bg-transparent px-2.5 text-sm text-white placeholder:text-white/70 focus:outline-none"
              : "h-full flex-1 bg-transparent px-3 text-sm text-text-primary placeholder:text-text-primary focus:outline-none sm:text-base"
          }
        />

        {isToolbar ? (
          query.length > 0 ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setSelectedQuery(null);
                if (initialQuery) {
                  navigate({ q: undefined });
                }
              }}
              className="me-1.5 flex size-7 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          ) : null
        ) : (
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
        )}

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
