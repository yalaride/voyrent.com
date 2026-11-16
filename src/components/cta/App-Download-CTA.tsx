import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { AppleLogoIcon, GooglePlayIcon } from "@/components/icons";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

interface AppDownloadCtaProps {
  googlePlayHref?: string;
  appStoreHref?: string;
  imageSrc?: string;
}

export async function AppDownloadCta({
  googlePlayHref = "https://play.google.com",
  appStoreHref = "https://apps.apple.com",
  imageSrc = "/landing-page/app-cta-phones.png",
}: AppDownloadCtaProps) {
  const t = await getTranslations("AppCta");

  return (
    /* Section: 1440px container, lg:min-h-[448px], py-120px px-80px, gap-40px */
    <LayoutWrapper className="w-full bg-background-primary">
      <div className="mx-auto flex w-full max-w-[var(--container-1440)] flex-col items-center justify-between gap-10 px-4 py-12 md:py-16 lg:min-h-[448px] lg:flex-row lg:py-[120px]">
        {/* Left Side Content: max-w 683px */}
        <div className="flex w-full max-w-[683px] flex-col items-start gap-8">
          {/* Heading + Subtitle: gap 8px */}
          <div className="flex w-full flex-col gap-[var(--spacing-space-8)]">
            <h2 className="text-3xl font-semibold leading-[1.16] tracking-[-0.02em] text-text-primary sm:text-4xl lg:text-[48px]">
              {t.rich("title", {
                brand: (chunks) => (
                  <span className="text-primary">{chunks}</span>
                ),
              })}
            </h2>
            <p className="max-w-[683px] text-base font-medium leading-[1.5] text-text-secondary">
              {t("subtitle")}
            </p>
          </div>

          {/* Store Buttons: 168 x 56, padding 12px 16px, gap 8px, radius/8 */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={googlePlayHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 min-w-[168px] items-center gap-[var(--spacing-space-8)] rounded-[var(--radius-8)] bg-background-section px-[var(--spacing-space-16)] py-[var(--spacing-space-12)] text-text-inverse transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <GooglePlayIcon className="size-7 shrink-0" />
              <span className="flex flex-col items-start text-start leading-tight">
                <span className="text-[11px] font-normal text-text-inverse/80">
                  {t("googlePlayTop")}
                </span>
                <span className="text-base font-semibold tracking-tight text-text-inverse">
                  {t("googlePlayName")}
                </span>
              </span>
            </a>

            <a
              href={appStoreHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 min-w-[168px] items-center gap-[var(--spacing-space-8)] rounded-[var(--radius-8)] bg-background-section px-[var(--spacing-space-16)] py-[var(--spacing-space-12)] text-text-inverse transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <AppleLogoIcon className="size-7 shrink-0" />
              <span className="flex flex-col items-start text-start leading-tight">
                <span className="text-[11px] font-normal text-text-inverse/80">
                  {t("appStoreTop")}
                </span>
                <span className="text-base font-semibold tracking-tight text-text-inverse">
                  {t("appStoreName")}
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* Right Side Phones Mockup */}
        <div className="relative h-[280px] w-full max-w-[440px] shrink-0 sm:h-[340px] lg:h-[360px]">
          <Image
            src={imageSrc}
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 1024px) 100vw, 440px"
            className="object-contain object-center"
          />
        </div>
      </div>
    </LayoutWrapper>
  );
}
