import { getTranslations } from "next-intl/server";

import {
  FeaturedListingsIcon,
  GrowCitiesIcon,
  ListingsOnTopIcon,
  ManageOnePlaceIcon,
  OwnRatesIcon,
  ReachRentersIcon,
} from "@/components/icons/index";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export async function FleetBenefitsSection() {
  const t = await getTranslations("DealerPlans.benefits");

  const features = [
    {
      id: "reachRenters",
      Icon: ReachRentersIcon,
      title: t("items.reachRenters.title"),
      description: t("items.reachRenters.description"),
    },
    {
      id: "featuredListings",
      Icon: FeaturedListingsIcon,
      title: t("items.featuredListings.title"),
      description: t("items.featuredListings.description"),
    },
    {
      id: "listingsOnTop",
      Icon: ListingsOnTopIcon,
      title: t("items.listingsOnTop.title"),
      description: t("items.listingsOnTop.description"),
    },
    {
      id: "ownRates",
      Icon: OwnRatesIcon,
      title: t("items.ownRates.title"),
      description: t("items.ownRates.description"),
    },
    {
      id: "manageOnePlace",
      Icon: ManageOnePlaceIcon,
      title: t("items.manageOnePlace.title"),
      description: t("items.manageOnePlace.description"),
    },
    {
      id: "growCities",
      Icon: GrowCitiesIcon,
      title: t("items.growCities.title"),
      description: t("items.growCities.description"),
    },
  ];

  return (
    <section className="w-full bg-background-primary pt-[var(--spacing-space-40)] pb-[var(--spacing-space-40)] lg:pb-[var(--spacing-space-80)]">
      <LayoutWrapper>
        <div className="flex w-full flex-col items-center gap-[var(--spacing-space-40)] lg:gap-[60px]">
          {/* Header Block (686px max-width, 12px gap) */}
          <div className="mx-auto flex w-full max-w-[686px] flex-col items-center gap-[var(--spacing-space-12)] text-center">
            <h2 className="w-full text-[length:var(--text-h1)] leading-[1.16] font-semibold tracking-[-0.02em] text-text-primary md:text-[length:var(--text-title)] lg:text-[3rem]">
              {t("title")}
            </h2>
            <p className="w-full text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal text-text-secondary">
              {t("subtitle")}
            </p>
          </div>

          {/* 3-Column Feature Grid (1158px max-width, 40px gap -> 359px per card) */}
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
