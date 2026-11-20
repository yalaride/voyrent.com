"use client";

import { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";

import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "annually";
type PlanCountryKey = "uae" | "saudiArabia" | "pakistan" | "uk" | "us";
type PackKey = "starter" | "pro" | "luxury";

export interface CountryPlanQuota {
  starter: { listings: number; refreshes: number };
  pro: { listings: number; refreshes: number };
  luxury: { listings: number; refreshes: number };
}

export type PlansFallbackMap = Record<
  PlanCountryKey,
  Record<BillingCycle, CountryPlanQuota>
>;

const COUNTRY_KEYS: PlanCountryKey[] = [
  "uae",
  "saudiArabia",
  "pakistan",
  "uk",
  "us",
];

// Fallback dummy data used when API/server data is not passed
const DUMMY_PLANS_DATA: PlansFallbackMap = {
  uae: {
    monthly: {
      starter: { listings: 10, refreshes: 10 },
      pro: { listings: 20, refreshes: 20 },
      luxury: { listings: 30, refreshes: 30 },
    },
    annually: {
      starter: { listings: 120, refreshes: 120 },
      pro: { listings: 240, refreshes: 240 },
      luxury: { listings: 360, refreshes: 360 },
    },
  },
  saudiArabia: {
    monthly: {
      starter: { listings: 10, refreshes: 12 },
      pro: { listings: 25, refreshes: 25 },
      luxury: { listings: 40, refreshes: 40 },
    },
    annually: {
      starter: { listings: 120, refreshes: 144 },
      pro: { listings: 300, refreshes: 300 },
      luxury: { listings: 480, refreshes: 480 },
    },
  },
  pakistan: {
    monthly: {
      starter: { listings: 8, refreshes: 8 },
      pro: { listings: 15, refreshes: 15 },
      luxury: { listings: 25, refreshes: 25 },
    },
    annually: {
      starter: { listings: 96, refreshes: 96 },
      pro: { listings: 180, refreshes: 180 },
      luxury: { listings: 300, refreshes: 300 },
    },
  },
  uk: {
    monthly: {
      starter: { listings: 10, refreshes: 10 },
      pro: { listings: 20, refreshes: 25 },
      luxury: { listings: 35, refreshes: 35 },
    },
    annually: {
      starter: { listings: 120, refreshes: 120 },
      pro: { listings: 240, refreshes: 300 },
      luxury: { listings: 420, refreshes: 420 },
    },
  },
  us: {
    monthly: {
      starter: { listings: 12, refreshes: 12 },
      pro: { listings: 25, refreshes: 25 },
      luxury: { listings: 50, refreshes: 50 },
    },
    annually: {
      starter: { listings: 144, refreshes: 144 },
      pro: { listings: 300, refreshes: 300 },
      luxury: { listings: 600, refreshes: 600 },
    },
  },
};

interface PricingPlansSectionProps {
  /** Optional API data; falls back to DUMMY_PLANS_DATA when omitted */
  plansData?: Partial<PlansFallbackMap>;
  onRequestQuote?: (selection: {
    plan: PackKey;
    country: PlanCountryKey;
    billing: BillingCycle;
  }) => void;
}

export function PricingPlansSection({
  plansData,
  onRequestQuote,
}: PricingPlansSectionProps) {
  const t = useTranslations("DealerPlans.plans");

  const [country, setCountry] = useState<PlanCountryKey>("uae");
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const sliderRef = useRef<HTMLDivElement>(null);

  const activeQuotas =
    plansData?.[country]?.[billing] ?? DUMMY_PLANS_DATA[country][billing];

  const countryLabel = t(`countries.${country}`);

  const cards: Array<{
    key: PackKey;
    highlighted?: boolean;
    badge?: string;
    title: string;
    subtitle: string;
    features: string[];
  }> = [
    {
      key: "starter",
      title: t("packs.starter.title"),
      subtitle: t("packs.starter.subtitle"),
      features: [
        t(`packs.starter.${billing}.listings`, {
          count: activeQuotas.starter.listings,
        }),
        t(`packs.starter.${billing}.refreshes`, {
          count: activeQuotas.starter.refreshes,
        }),
        t(`packs.starter.${billing}.visibility`),
      ],
    },
    {
      key: "pro",
      highlighted: true,
      badge:
        billing === "annually"
          ? t("packs.pro.annualBadge")
          : t("packs.pro.badge"),
      title: t("packs.pro.title"),
      subtitle: t("packs.pro.subtitle"),
      features: [
        t(`packs.pro.${billing}.listings`, {
          count: activeQuotas.pro.listings,
        }),
        t(`packs.pro.${billing}.refreshes`, {
          count: activeQuotas.pro.refreshes,
        }),
        t(`packs.pro.${billing}.visibility`),
        t(`packs.pro.${billing}.featured`),
      ],
    },
    {
      key: "luxury",
      title: t("packs.luxury.title"),
      subtitle: t("packs.luxury.subtitle"),
      features: [
        t(`packs.luxury.${billing}.listings`, {
          count: activeQuotas.luxury.listings,
        }),
        t(`packs.luxury.${billing}.refreshes`, {
          count: activeQuotas.luxury.refreshes,
        }),
        t(`packs.luxury.${billing}.visibility`),
        t(`packs.luxury.${billing}.featured`),
        t(`packs.luxury.${billing}.multiCity`, { country: countryLabel }),
      ],
    },
  ];

  const handleSlide = (direction: "prev" | "next") => {
    const container = sliderRef.current;
    if (!container) return;

    const scrollAmount = 380;
    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleQuoteClick = (plan: PackKey) => {
    if (onRequestQuote) {
      onRequestQuote({ plan, country, billing });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-background-secondary py-[var(--spacing-space-40)] lg:py-[var(--spacing-space-80)]">
      <LayoutWrapper>
        <div className="flex w-full flex-col gap-[var(--spacing-space-30)]">
          {/* Header Block (753px max width, 10px gap) */}
          <div className="flex w-full max-w-[753px] flex-col items-start gap-[var(--spacing-space-10)] text-start">
            <h2 className="w-full text-[length:var(--text-h1)] leading-[1.16] font-semibold tracking-[-0.02em] text-text-primary md:text-[length:var(--text-title)] lg:text-[3rem]">
              {t("title")}
            </h2>
            <p className="w-full text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal text-text-secondary">
              {t("subtitle")}
            </p>
          </div>

          {/* Controls Row (Country Dropdown + Monthly/Annually Pill Toggle) */}
          <div className="flex w-full flex-col justify-between gap-4 sm:min-h-[56px] sm:flex-row sm:items-center">
            {/* Country Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-full border border-border-default bg-background-primary px-6 text-start text-[length:var(--text-body)] font-normal text-text-primary outline-none transition-colors hover:border-primary sm:w-[220px]"
                >
                  <span className="truncate">{countryLabel}</span>
                  <ChevronDown className="size-4 shrink-0 text-text-secondary" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="rounded-xl bg-background-primary p-1.5"
              >
                {COUNTRY_KEYS.map((key) => (
                  <DropdownMenuItem
                    key={key}
                    onSelect={() => setCountry(key)}
                    className={cn(
                      "cursor-pointer rounded-lg px-3 py-2 text-start text-sm",
                      country === key && "bg-background-secondary font-medium",
                    )}
                  >
                    {t(`countries.${key}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Billing Cycle Switch (Monthly / Annually) */}
            <div
              role="tablist"
              aria-label="Billing cycle"
              className="grid h-14 w-full grid-cols-2 items-center rounded-full border border-border-default bg-background-primary p-1 sm:w-[280px]"
            >
              {(["monthly", "annually"] as const).map((cycle) => {
                const isActive = billing === cycle;
                return (
                  <button
                    key={cycle}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setBilling(cycle)}
                    className={cn(
                      "flex h-full cursor-pointer items-center justify-center rounded-full px-5 text-[length:var(--text-body-small)] font-medium transition-colors",
                      isActive
                        ? "bg-background-section text-text-inverse"
                        : "bg-transparent text-text-secondary hover:text-text-primary",
                    )}
                  >
                    {t(`billing.${cycle}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plans Cards: Mobile = 1-col stack | Tablet = horizontal slider | Desktop = 3-col grid */}
          <div
            ref={sliderRef}
            className="flex flex-col gap-5 md:flex-row md:overflow-x-auto md:pb-2 md:snap-x md:snap-mandatory md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0"
          >
            {cards.map((plan) => {
              const isHighlighted = Boolean(plan.highlighted);

              return (
                <Card
                  key={plan.key}
                  className={cn(
                    "min-h-[480px] w-full justify-between gap-0 rounded-[var(--radius-24)] border-0 px-[var(--spacing-space-24)] pt-8 pb-0 ring-0 shadow-[var(--shadow-spread)] md:w-[390px] md:shrink-0 md:snap-start lg:w-full",
                    isHighlighted
                      ? "bg-primary text-text-inverse"
                      : "bg-background-primary text-text-primary",
                  )}
                >
                  <div>
                    <CardHeader className="gap-2 p-0">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle
                          className={cn(
                            "text-[length:var(--text-h2)] leading-[1.2] font-semibold tracking-[-0.02em] lg:text-[2rem]",
                            isHighlighted
                              ? "text-text-inverse"
                              : "text-text-primary",
                          )}
                        >
                          {plan.title}
                        </CardTitle>

                        {plan.badge && (
                          <span className="shrink-0 rounded-full bg-background-section px-3.5 py-1.5 text-[length:var(--text-caption)] font-medium text-text-inverse">
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <CardDescription
                        className={cn(
                          "text-[length:var(--text-body-small)] leading-[var(--text-body-small--line-height)]",
                          isHighlighted
                            ? "text-text-inverse/90"
                            : "text-text-secondary",
                        )}
                      >
                        {plan.subtitle}
                      </CardDescription>
                    </CardHeader>

                    <div
                      className={cn(
                        "my-6 h-px w-full",
                        isHighlighted
                          ? "bg-text-inverse/20"
                          : "bg-border-subtle",
                      )}
                    />

                    <CardContent className="p-0">
                      <ul className="flex flex-col gap-4">
                        {plan.features.map((feature, index) => (
                          <li
                            key={`${plan.key}-${index}`}
                            className="flex items-center gap-3 text-start text-[length:var(--text-body-small)] leading-[1.4]"
                          >
                            <CircleCheck
                              className={cn(
                                "size-5 shrink-0",
                                isHighlighted
                                  ? "text-text-inverse"
                                  : "text-primary",
                              )}
                            />
                            <span
                              className={
                                isHighlighted
                                  ? "text-text-inverse"
                                  : "text-text-primary"
                              }
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </div>

                  {/* pb-8 restores the 32px bottom card padding overridden by Card's has-data-[slot=card-footer]:pb-0 */}
                  <CardFooter className="mt-8 border-0 bg-transparent px-0 pt-0 pb-8">
                    <Button
                      type="button"
                      size="lg"
                      variant={isHighlighted ? "outline" : "default"}
                      onClick={() => handleQuoteClick(plan.key)}
                      className={cn(
                        "w-full",
                        isHighlighted &&
                          "border-transparent bg-background-primary text-primary hover:bg-background-primary/90 hover:text-primary",
                      )}
                    >
                      {t("cta")}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Tablet-only Slider Navigation Arrows */}
          <div className="hidden items-center justify-center gap-3 md:flex lg:hidden">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={t("previousPlan")}
              onClick={() => handleSlide("prev")}
              className="bg-background-primary"
            >
              <ChevronLeft className="size-4 text-text-primary rtl:rotate-180" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={t("nextPlan")}
              onClick={() => handleSlide("next")}
              className="bg-background-primary"
            >
              <ChevronRight className="size-4 text-text-primary rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
