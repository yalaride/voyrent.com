"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import type {
  ContinentKey,
  RoadRuleCountryView,
} from "@/domain/catalog/road-rules";
import { cn } from "@/lib/utils";

interface RoadRulesClientProps {
  continents: ContinentKey[];
  countries: RoadRuleCountryView[];
}

export function RoadRulesClient({
  continents,
  countries,
}: RoadRulesClientProps) {
  const t = useTranslations("RoadRules");

  const defaultCountry = countries[0];
  const [selectedContinent, setSelectedContinent] = useState<
    ContinentKey | undefined
  >(defaultCountry?.continentKey ?? continents[0]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>(
    defaultCountry?.id ?? "",
  );

  const filteredCountries = useMemo(
    () =>
      selectedContinent
        ? countries.filter(
            (country) => country.continentKey === selectedContinent,
          )
        : [],
    [countries, selectedContinent],
  );

  // Strictly match within filteredCountries so continent & country never desync
  const selectedCountry = useMemo(
    () =>
      filteredCountries.find((country) => country.id === selectedCountryId) ??
      filteredCountries[0] ??
      null,
    [filteredCountries, selectedCountryId],
  );

  const guide = selectedCountry?.guide ?? null;

  const handleContinentChange = (nextContinent: ContinentKey) => {
    setSelectedContinent(nextContinent);
    const firstCountry = countries.find(
      (country) => country.continentKey === nextContinent,
    );
    setSelectedCountryId(firstCountry?.id ?? "");
  };

  const handleDownloadPdf = () => {
    if (!selectedCountry?.pdfUrl) return;

    const link = document.createElement("a");
    link.href = selectedCountry.pdfUrl;
    link.download = selectedCountry.pdfFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Section 2: Filter / Button Row */}
      <div className="w-full rounded-b-[var(--radius-24)] border-b border-border-subtle bg-background-primary py-5 sm:py-[var(--spacing-space-24)]">
        <LayoutWrapper>
          <div className="flex w-full flex-col gap-[var(--spacing-space-16)] sm:w-[527px] sm:flex-row sm:items-center">
            <FloatingDropdown
              label={t("filters.selectContinent")}
              value={
                selectedContinent ? t(`continents.${selectedContinent}`) : ""
              }
              disabled={continents.length === 0}
              className="sm:w-[255.5px]"
            >
              {continents.map((continentKey) => (
                <DropdownMenuItem
                  key={continentKey}
                  onSelect={() => handleContinentChange(continentKey)}
                  className="cursor-pointer py-2 text-start text-[length:var(--text-body-small)]"
                >
                  {t(`continents.${continentKey}`)}
                </DropdownMenuItem>
              ))}
            </FloatingDropdown>

            <FloatingDropdown
              label={t("filters.selectCountry")}
              value={
                selectedCountry
                  ? t(`countries.${selectedCountry.countryKey}`)
                  : t("filters.countryPlaceholder")
              }
              disabled={filteredCountries.length === 0}
              className="sm:w-[255.5px]"
            >
              {filteredCountries.map((country) => (
                <DropdownMenuItem
                  key={country.id}
                  onSelect={() => setSelectedCountryId(country.id)}
                  className="cursor-pointer py-2 text-start text-[length:var(--text-body-small)]"
                >
                  {t(`countries.${country.countryKey}`)}
                </DropdownMenuItem>
              ))}
            </FloatingDropdown>
          </div>
        </LayoutWrapper>
      </div>

      {/* Section 3: Main Content Area */}
      <LayoutWrapper>
        <div className="w-full bg-background-primary pt-8 pb-14 md:pt-[var(--spacing-space-40)] md:pb-[var(--spacing-space-80)]">
          {selectedCountry && guide ? (
            <div className="flex w-full flex-col items-start gap-8 md:gap-[var(--spacing-space-40)]">
              {/* Heading + Subtitle + Outline Download Button */}
              <div className="flex w-full flex-col items-start justify-between gap-5 md:flex-row md:items-center md:gap-6">
                <div className="flex w-full min-w-0 flex-1 max-w-[1121px] flex-col gap-[var(--spacing-space-8)]">
                  <h2 className="text-[24px] leading-[1.2] font-semibold tracking-[-0.02em] text-text-primary sm:text-[30px] lg:text-[36px]">
                    {guide.heading}
                  </h2>
                  <p className="text-start text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-medium tracking-normal text-text-secondary md:text-justify">
                    {guide.subtitle}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={!selectedCountry.pdfUrl}
                  onClick={handleDownloadPdf}
                  className="w-full md:w-auto md:min-w-[159px]"
                >
                  {t("downloadPdf")}
                </Button>
              </div>

              {/* Road Rule Sections */}
              {guide.sections.map((section) => (
                <section
                  key={section.id}
                  className="flex w-full flex-col items-start gap-[var(--spacing-space-8)]"
                >
                  <h3 className="w-full text-[length:var(--text-h4)] leading-[1.26] font-semibold tracking-[-0.02em] text-text-primary">
                    {section.title}
                  </h3>

                  {section.paragraphs && section.paragraphs.length > 0 && (
                    <div className="w-full space-y-[var(--spacing-space-8)] text-start text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal tracking-normal text-text-secondary">
                      {section.paragraphs.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  )}

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="w-full list-disc space-y-[var(--spacing-space-8)] ps-[var(--spacing-space-20)] text-start text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal tracking-normal text-text-secondary">
                      {section.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  {section.subsections && section.subsections.length > 0 && (
                    <div className="w-full space-y-[var(--spacing-space-16)] pt-[var(--spacing-space-8)]">
                      {section.subsections.map((sub, subIdx) => (
                        <div
                          key={subIdx}
                          className="space-y-[var(--spacing-space-8)]"
                        >
                          <h4 className="text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-semibold text-text-primary">
                            {sub.subtitle}
                          </h4>
                          <ul className="list-disc space-y-[var(--spacing-space-8)] ps-[var(--spacing-space-20)] text-start text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal tracking-normal text-text-secondary">
                            {sub.bullets.map((bullet, bulletIdx) => (
                              <li key={bulletIdx}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <p className="text-[length:var(--text-body)] leading-[var(--text-body--line-height)] text-text-secondary">
              {t("emptyState")}
            </p>
          )}
        </div>
      </LayoutWrapper>
    </>
  );
}

function FloatingField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[52px] w-full items-center rounded-[var(--radius-8)] border border-border-default bg-background-primary px-[var(--spacing-space-20)] py-[var(--spacing-space-10)] transition-colors focus-within:border-primary",
        className,
      )}
    >
      <Label className="absolute -top-2 start-4 bg-background-primary px-1 text-[length:var(--text-caption)] leading-[1.1] font-normal text-text-primary">
        {label}
      </Label>
      {children}
    </div>
  );
}

function FloatingDropdown({
  label,
  value,
  disabled,
  className,
  children,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <FloatingField label={label} className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <button
            type="button"
            disabled={disabled}
            aria-label={label}
            className="flex h-full w-full cursor-pointer items-center justify-between gap-[var(--spacing-space-8)] text-start text-[length:var(--text-body)] leading-[var(--text-body--line-height)] text-text-primary outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="truncate">{value}</span>
            <ChevronDown className="size-4 shrink-0 text-text-secondary" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[230px] rounded-[var(--radius-8)] border-border-subtle bg-background-primary shadow-[var(--shadow-medium)]"
        >
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </FloatingField>
  );
}
