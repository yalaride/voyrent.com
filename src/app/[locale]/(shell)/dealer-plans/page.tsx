import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale } from "@/domain/geo/locales";
import { PlansHeroSection } from "@/components/dealer-plans/plans-hero-section";
import { FleetBenefitsSection } from "@/components/dealer-plans/fleet-benefits-section";
import LandingFaqSection from "@/components/faqs/Landing-Section-faqs";
import { PricingPlansSection } from "@/components/dealer-plans/pricing-plans-section";
type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: "DealerPlans" });
  return { title: { absolute: `${t("metaTitle")} · GleeCars` } };
}

export default function DealerPlansPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" />}>
      <DealerPlansContent params={params} />
    </Suspense>
  );
}

async function DealerPlansContent({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);

  return (
    <>
      <PlansHeroSection />
      <FleetBenefitsSection />
      {/* Add your pricing/plans sections below */}

      <PricingPlansSection />
      <LandingFaqSection />
    </>
  );
}
