import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  InventoryBoxIcon,
  PhoneCallIcon,
  UsersGroupIcon,
} from "@/components/icons";

interface DealerBannerProps {
  joinHref?: string;
  pricingHref?: string;
  imageSrc?: string;
}

export async function DealerBanner({
  joinHref = "/dealers/join",
  pricingHref = "/pricing",
  imageSrc = "/landing-page/dealer-banner.png",
}: DealerBannerProps) {
  const t = await getTranslations("DealerBanner");

  return (
    /* Outer Section: 1440px container, height 530px on desktop, 1px top border, padding 60px 80px */
    <section className="w-full border-t border-border-default">
      <div className="mx-auto w-full max-w-[var(--container-1440)] px-4 py-10 sm:px-6 lg:h-[530px] lg:px-[var(--spacing-space-80)] lg:py-[60px]">
        {/* Inner Banner Card: 1280 x 410, radius 24px, left text inset top 80px / start 60px */}
        <div className="relative flex min-h-[380px] w-full flex-col justify-between gap-8 overflow-hidden rounded-[var(--radius-24)] bg-background-section px-6 py-8 sm:px-10 lg:h-[410px] lg:px-[60px] lg:py-[80px]">
          {/* Background Showroom Image */}
          <Image
            src={imageSrc}
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 1440px) 100vw, 1280px"
            className="object-cover object-center rtl:-scale-x-100"
          />

          {/* Gradient Overlay: 90deg, rgba(0,0,0,0.8) 29.49% -> rgba(0,0,0,0) 100% */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.8)_29.49%,rgba(0,0,0,0)_100%)] rtl:bg-[linear-gradient(270deg,rgba(0,0,0,0.8)_29.49%,rgba(0,0,0,0)_100%)]"
          />

          {/* Left Text + Button Column: width 580, height 250, gap 32 */}
          <div className="relative z-10 flex w-full max-w-[580px] flex-col gap-8 lg:min-h-[250px]">
            <div className="flex flex-col gap-4">
              {/* Heading: 580 x 112, 48px SemiBold, line-height 116%, -2% tracking */}
              <h2 className="text-3xl font-semibold leading-[1.16] tracking-[-0.02em] text-text-inverse sm:text-4xl lg:text-[48px]">
                {t("title")}
              </h2>

              {/* Subtitle: 580 x 48, 16px Regular, line-height 150% */}
              <p className="max-w-[580px] text-base font-normal leading-[1.5] text-text-inverse">
                {t("subtitle")}
              </p>
            </div>

            {/* Button Row: width ~311, height 48, gap 10 */}
            <div className="flex flex-wrap items-center gap-[var(--spacing-space-10)]">
              <Button variant="default" size="lg" asChild>
                <Link href={joinHref}>{t("joinCta")}</Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-text-inverse/60 bg-transparent text-text-inverse hover:border-text-inverse hover:bg-text-inverse/10 hover:text-text-inverse"
                asChild
              >
                <Link href={pricingHref}>{t("pricingCta")}</Link>
              </Button>
            </div>
          </div>

          {/* Right-side 3 Badges (inline on mobile/tablet, exact 1280x410 coordinates on desktop) */}
          <ul className="relative z-10 flex flex-wrap gap-2.5 lg:static">
            {/* Dealer Dashboard: hug x 44, top 85px, left 1034px (47px from end of 1280px card) */}
            <li className="inline-flex h-[var(--spacing-dim-44)] items-center gap-[var(--spacing-space-6)] rounded-[var(--radius-12)] bg-background-primary/95 px-[var(--spacing-space-16)] py-[var(--spacing-space-10)] text-sm font-medium text-text-primary shadow-[var(--shadow-medium)] backdrop-blur-sm lg:absolute lg:top-[85px] lg:end-[47px]">
              <UsersGroupIcon className="size-4 shrink-0 text-primary" />
              <span className="whitespace-nowrap">{t("badgeDashboard")}</span>
            </li>

            {/* Manage Inventory: 200 x 44, top 211px, left 712px (55.6% of 1280px card) */}
            <li className="inline-flex h-[var(--spacing-dim-44)] min-w-[200px] items-center justify-center gap-[var(--spacing-space-6)] rounded-[var(--radius-12)] bg-background-primary/95 px-[var(--spacing-space-16)] py-[var(--spacing-space-10)] text-sm font-medium text-text-primary shadow-[var(--shadow-medium)] backdrop-blur-sm lg:absolute lg:top-[211px] lg:start-[55.6%] xl:start-[712px]">
              <InventoryBoxIcon className="size-4 shrink-0 text-primary" />
              <span className="whitespace-nowrap">{t("badgeInventory")}</span>
            </li>

            {/* Direct Customer Calls: 44px height, bottom-right */}
            <li className="inline-flex h-[var(--spacing-dim-44)] items-center gap-[var(--spacing-space-6)] rounded-[var(--radius-12)] bg-background-primary/95 px-[var(--spacing-space-16)] py-[var(--spacing-space-10)] text-sm font-medium text-text-primary shadow-[var(--shadow-medium)] backdrop-blur-sm lg:absolute lg:bottom-[64px] lg:end-[72px]">
              <PhoneCallIcon className="size-4 shrink-0 text-primary" />
              <span className="whitespace-nowrap">{t("badgeCalls")}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
