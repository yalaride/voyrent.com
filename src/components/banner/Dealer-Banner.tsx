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
    <section className="w-full border-t border-border-default">
      <div className="mx-auto w-full max-w-[var(--container-1440)] px-0 py-0 lg:h-[530px] lg:px-[var(--spacing-space-80)] lg:py-[60px]">
        <div className="relative flex min-h-[368px] w-full flex-col items-center justify-center gap-8 overflow-hidden rounded-none bg-background-section px-4 py-[60px] sm:min-h-[380px] sm:items-start sm:px-8 sm:py-14 lg:h-[410px] lg:justify-between lg:rounded-[var(--radius-24)] lg:px-[60px] lg:py-[80px]">
          {/* Background Image & Gradient — removed on mobile, shown on tablet & desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none hidden sm:block"
          >
            <Image
              src={imageSrc}
              alt={t("imageAlt")}
              fill
              sizes="(max-width: 1440px) 100vw, 1280px"
              className="object-cover object-center rtl:-scale-x-100"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.8)_29.49%,rgba(0,0,0,0)_100%)] rtl:bg-[linear-gradient(270deg,rgba(0,0,0,0.8)_29.49%,rgba(0,0,0,0)_100%)]" />
          </div>

          {/* Text + Button Column */}
          <div className="relative z-10 flex w-full max-w-[361px] flex-col items-center gap-8 text-center sm:max-w-[500px] sm:items-start sm:text-start lg:min-h-[250px] lg:max-w-[520px] xl:max-w-[580px]">
            <div className="flex flex-col gap-[10px] lg:gap-4">
              <h2 className="text-[36px] font-semibold leading-[1.2] text-text-inverse ltr:tracking-[-0.02em] sm:text-[42px] sm:leading-[1.16] lg:text-[48px]">
                {t("title")}
              </h2>

              <p className="text-base font-normal leading-[1.5] text-text-inverse lg:max-w-[580px]">
                {t("subtitle")}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-space-10)] sm:justify-start">
              <Button
                variant="default"
                size="lg"
                className="h-12 rounded-full px-6"
                asChild
              >
                <Link href={joinHref}>{t("joinCta")}</Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-text-inverse/60 bg-transparent px-6 text-text-inverse hover:border-text-inverse hover:bg-text-inverse/10 hover:text-text-inverse"
                asChild
              >
                <Link href={pricingHref}>{t("pricingCta")}</Link>
              </Button>
            </div>
          </div>

          {/* 3 Badges — removed on mobile & tablet, shown on desktop (lg+) */}
          <ul className="hidden lg:block">
            <li className="inline-flex h-[var(--spacing-dim-44)] items-center gap-[var(--spacing-space-6)] rounded-[var(--radius-12)] bg-background-primary/95 px-[var(--spacing-space-16)] py-[var(--spacing-space-10)] text-sm font-medium text-text-primary shadow-[var(--shadow-medium)] backdrop-blur-sm lg:absolute lg:top-[85px] lg:end-[47px]">
              <UsersGroupIcon className="size-4 shrink-0 text-primary" />
              <span className="whitespace-nowrap">{t("badgeDashboard")}</span>
            </li>

            <li className="inline-flex h-[var(--spacing-dim-44)] min-w-[200px] items-center justify-center gap-[var(--spacing-space-6)] rounded-[var(--radius-12)] bg-background-primary/95 px-[var(--spacing-space-16)] py-[var(--spacing-space-10)] text-sm font-medium text-text-primary shadow-[var(--shadow-medium)] backdrop-blur-sm lg:absolute lg:top-[211px] lg:start-[62%] xl:start-[712px]">
              <InventoryBoxIcon className="size-4 shrink-0 text-primary" />
              <span className="whitespace-nowrap">{t("badgeInventory")}</span>
            </li>

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
