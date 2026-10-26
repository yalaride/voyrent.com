"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { getFamousSearch } from "@/domain/catalog/famous-searches";
import { catalogPath } from "@/domain/routing/rent-paths";
import { BODY_TYPES, isBodyType, type MakeOption, type ModelOption, type SearchSuggestion, type VehicleSearchQuery } from "@/domain/catalog/types";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const controlClass = "h-11 w-full data-[size=default]:h-11";

export function SearchPanel({
  country,
  city,
  makes,
  models,
  initial,
}: {
  country: string;
  city: string;
  makes: MakeOption[];
  models: ModelOption[];
  initial?: Partial<VehicleSearchQuery>;
}) {
  const t = useTranslations("Search");
  const bodyLabels = useTranslations("BodyTypes");
  const router = useRouter();
  const queryId = useId();
  const [make, setMake] = useState(initial?.make ?? "any");
  const [model, setModel] = useState(initial?.model ?? "any");
  const [bodyType, setBodyType] = useState(initial?.bodyType ?? "any");
  const [query, setQuery] = useState(initial?.q ?? "");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);

  const visibleModels = make === "any" ? models : models.filter((item) => item.makeSlug === make);

  useEffect(() => {
    const trimmed = query.trim();
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
  }, [city, country, query]);

  function navigate(next: Partial<VehicleSearchQuery>) {
    setOpen(false);
    router.push(catalogPath(city, next));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({
      make: make === "any" ? undefined : make,
      model: model === "any" ? undefined : model,
      bodyType: isBodyType(bodyType) ? bodyType : undefined,
      q: query.trim() || undefined,
    });
  }

  function applySuggestion(suggestion: SearchSuggestion) {
    if (suggestion.kind === "famous") {
      navigate(getFamousSearch(suggestion.slug)?.query ?? {});
      return;
    }

    if (suggestion.kind === "bodyType") {
      setBodyType(suggestion.slug);
      navigate({ bodyType: suggestion.slug });
      return;
    }

    if (suggestion.kind === "make") {
      setMake(suggestion.slug);
      setModel("any");
      setQuery(suggestion.label);
      setOpen(false);
      return;
    }

    setMake(suggestion.makeSlug);
    setModel(suggestion.slug);
    setQuery(suggestion.label);
    setOpen(false);
  }

  function suggestionLabel(suggestion: SearchSuggestion) {
    if (suggestion.kind === "famous") return t(`famous.${suggestion.messageKey}`);
    if (suggestion.kind === "bodyType") return bodyLabels(suggestion.slug);
    return suggestion.label;
  }

  return (
    <form role="search" onSubmit={onSubmit} className="grid gap-3">
      <div
        className="relative grid gap-1.5"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setOpen(false);
          }
        }}
      >
        <Label htmlFor={queryId}>{t("query")}</Label>
        <Input
          id={queryId}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (event.target.value.trim().length < 2) setOpen(false);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          placeholder={t("queryPlaceholder")}
          autoComplete="off"
          spellCheck={false}
          className="h-11"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${queryId}-suggestions`}
          aria-autocomplete="list"
        />
        {open && suggestions.length > 0 ? (
          <ul
            id={`${queryId}-suggestions`}
            role="listbox"
            aria-label={t("suggestions")}
            className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-auto rounded-xl border bg-popover p-1 shadow-lg"
          >
            {suggestions.map((suggestion) => (
              <li key={`${suggestion.kind}-${suggestion.slug}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  className="flex w-full rounded-lg px-3 py-2 text-start text-sm hover:bg-muted"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applySuggestion(suggestion)}
                >
                  {suggestionLabel(suggestion)}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <div className="grid gap-1.5">
          <Label htmlFor={`${queryId}-make`}>{t("make")}</Label>
          <Select
            value={make}
            onValueChange={(value) => {
              setMake(value);
              setModel("any");
            }}
          >
            <SelectTrigger id={`${queryId}-make`} className={controlClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="any">{t("anyMake")}</SelectItem>
              {makes.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${queryId}-model`}>{t("model")}</Label>
          <Select value={visibleModels.some((item) => item.slug === model) ? model : "any"} onValueChange={setModel}>
            <SelectTrigger id={`${queryId}-model`} className={controlClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="any">{t("anyModel")}</SelectItem>
              {visibleModels.map((item) => (
                <SelectItem key={`${item.makeSlug}-${item.slug}`} value={item.slug}>
                  {make === "any" ? `${item.makeName} ${item.name}` : item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${queryId}-type`}>{t("type")}</Label>
          <Select value={bodyType} onValueChange={setBodyType}>
            <SelectTrigger id={`${queryId}-type`} className={controlClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="any">{t("anyType")}</SelectItem>
              {BODY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {bodyLabels(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid items-end">
          <Button type="submit" className="h-11 w-full">
            {t("submit")}
          </Button>
        </div>
      </div>
    </form>
  );
}
