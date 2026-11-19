import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AppDownloadCta } from "@/components/cta/App-Download-CTA";
import { SectionBannerCta } from "@/components/cta/SectionBannerCta";
import LandingFaqSection from "@/components/faqs/Landing-Section-faqs";
import {
  BestRatesIcon,
  BookDirectlyIcon,
  FreeOfChargeIcon,
  HugeSelectionIcon,
  LocalSuppliersIcon,
  ShortlistShareIcon,
} from "@/components/icons/index";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { RentingStepsSection } from "@/components/marketplace/RentingStepsSection";
import { isLocale } from "@/domain/geo/locales";
import { getMarket } from "@/domain/geo/markets";
import { AppShell } from "@/features/shell/app-shell";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: { absolute: `${t("marketplaceTitle")} · GleeCars` } };
}

export default function CarMarketplacePage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" />}>
      <CarMarketplaceContent params={params} />
    </Suspense>
  );
}

async function CarMarketplaceContent({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);

  const market = getMarket("ae", "dubai");
  if (!market) notFound();

  const tDealerCta = await getTranslations("DealerPlansCta");

  return (
    <AppShell locale={locale} market={market}>
      <AppDownloadCta />
      <MarketplaceBenefitsSection />
      <RentingStepsSection />
      <SectionBannerCta
        title={tDealerCta("title")}
        description={tDealerCta("description")}
        buttonLabel={tDealerCta("buttonLabel")}
        href={`/${locale}/dealer-plans`}
      />
      <LandingFaqSection />
    </AppShell>
  );
}

async function MarketplaceBenefitsSection() {
  const t = await getTranslations("MarketplaceBenefits");

  const features = [
    {
      id: "hugeSelection",
      Icon: HugeSelectionIcon,
      title: t("items.hugeSelection.title"),
      description: t("items.hugeSelection.description"),
    },
    {
      id: "freeOfCharge",
      Icon: FreeOfChargeIcon,
      title: t("items.freeOfCharge.title"),
      description: t("items.freeOfCharge.description"),
    },
    {
      id: "bestRates",
      Icon: BestRatesIcon,
      title: t("items.bestRates.title"),
      description: t("items.bestRates.description"),
    },
    {
      id: "localSuppliers",
      Icon: LocalSuppliersIcon,
      title: t("items.localSuppliers.title"),
      description: t("items.localSuppliers.description"),
    },
    {
      id: "bookOrBuyDirectly",
      Icon: BookDirectlyIcon,
      title: t("items.bookOrBuyDirectly.title"),
      description: t("items.bookOrBuyDirectly.description"),
    },
    {
      id: "shortlistShare",
      Icon: ShortlistShareIcon,
      title: t("items.shortlistShare.title"),
      description: t("items.shortlistShare.description"),
    },
  ];

  return (
    <section className="w-full bg-background-primary pt-[var(--spacing-space-40)] pb-[var(--spacing-space-40)] lg:pb-[var(--spacing-space-80)]">
      <LayoutWrapper>
        <div className="flex w-full flex-col items-center gap-[var(--spacing-space-40)] lg:gap-[60px]">
          <h2 className="mx-auto w-full max-w-[1280px] text-center text-[length:var(--text-h1)] leading-[1.16] font-semibold tracking-[-0.02em] text-text-primary md:text-[length:var(--text-title)] lg:text-[3rem]">
            {t("title")}
          </h2>

          <div className="mx-auto grid w-full max-w-[1158px] grid-cols-1 gap-[var(--spacing-space-40)] md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ id, Icon, title, description }) => (
              <article
                key={id}
                className="flex w-full flex-col items-start gap-[var(--spacing-space-20)]"
              >
                <Icon className="h-[52px] w-[52px] shrink-0 text-primary" />

                <div className="flex w-full flex-col items-start gap-[var(--spacing-space-8)] text-start">
                  <h3 className="w-full text-[length:var(--text-h4)] leading-[1.26] font-semibold tracking-[-0.02em] text-text-primary">
                    {title}
                  </h3>
                  <p className="w-full text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal text-text-secondary">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
