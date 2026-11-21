import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { RoadRulesClient } from "@/components/road-rules/RoadRulesClient";
import {
  CONTINENTS,
  getRoadRulesByLocale,
  type AppLocale,
} from "@/domain/catalog/road-rules";
import { isLocale } from "@/domain/geo/locales";
import { Link } from "@/i18n/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default function RoadRulesPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background-primary" />}>
      <RoadRulesContent params={params} />
    </Suspense>
  );
}

async function RoadRulesContent({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "RoadRules" });

  // Later when backend is ready, fetch RoadRuleCountryView[] here for `locale`
  const countries = getRoadRulesByLocale(locale as AppLocale);

  return (
    <div className="w-full flex-1 bg-background-primary font-sans text-text-primary">
      {/* Section 1: Header / Hero Section */}
      <section className="w-full bg-background-secondary py-8 sm:py-12 lg:py-16">
        <LayoutWrapper>
          <div className="flex w-full flex-col items-start gap-4 sm:gap-6 lg:gap-[var(--spacing-space-40)]">
            <nav
              aria-label={t("breadcrumb.ariaLabel")}
              className="text-[length:var(--text-body-small)] leading-[var(--text-body--line-height)] font-medium tracking-normal text-text-secondary sm:text-[length:var(--text-body)]"
            >
              <Link
                href="/"
                className="text-text-secondary transition-colors hover:text-text-primary"
              >
                {t("breadcrumb.home")}
              </Link>
              <span aria-hidden="true" className="text-text-secondary">
                {" / "}
              </span>
              <span className="text-text-secondary">
                {t("breadcrumb.current")}
              </span>
            </nav>

            <h1 className="w-full text-[28px] leading-[1.16] font-semibold tracking-[-0.02em] text-text-primary sm:text-[38px] lg:text-[48px]">
              {t("hero.title")}
            </h1>
          </div>
        </LayoutWrapper>
      </section>

      {/* Section 2 (Filter Bar) + Section 3 (Selected Country Guide) */}
      <RoadRulesClient continents={CONTINENTS} countries={countries} />
    </div>
  );
}
