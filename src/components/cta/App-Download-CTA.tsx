import Image, { type StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";

import appCtaPhonesImg from "../../../public/cta/Landing-Section-CTA.png";
import { AppleLogoIcon, GooglePlayIcon } from "@/components/icons";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

interface AppDownloadCtaProps {
  googlePlayHref?: string;
  appStoreHref?: string;
  downloadHref?: string;
  downloadLabel?: string;
  imageSrc?: string | StaticImageData;
}

export async function AppDownloadCta({
  googlePlayHref = "https://play.google.com",
  appStoreHref = "https://apps.apple.com",
  downloadHref = appStoreHref,
  downloadLabel = "Download App",
  imageSrc = appCtaPhonesImg,
}: AppDownloadCtaProps) {
  const t = await getTranslations("AppCta");

  return (
    <LayoutWrapper className="w-full bg-background-primary">
      {/* 
        NOTE: If LayoutWrapper does NOT already apply horizontal padding 
        (16px / 32px / 80px), add:
        px-[var(--spacing-space-16)] md:px-8 lg:px-[var(--spacing-space-80)]
      */}
      <div className="flex w-full flex-col items-center justify-between gap-[50px] py-[60px] md:h-[335px] md:flex-row md:gap-[var(--spacing-space-20)] md:py-0 lg:h-[448px] lg:gap-[var(--spacing-space-40)]">
        {/* Left Side Content */}
        <div className="flex w-full flex-col items-center gap-[var(--spacing-space-20)] text-center md:max-w-[401px] md:items-start md:py-[60px] md:text-start lg:max-w-[683px] lg:gap-[var(--spacing-space-40)] lg:py-[120px]">
          <div className="flex w-full flex-col items-center gap-[var(--spacing-space-8)] md:items-start">
            <h2 className="text-[36px] font-semibold leading-[1.16] tracking-[-0.02em] text-text-primary lg:text-[48px]">
              {t.rich("title", {
                brand: (chunks) => (
                  <span className="text-primary">{chunks}</span>
                ),
              })}
            </h2>
            <p className="w-full text-sm font-medium leading-[1.5] text-text-secondary md:text-base">
              {t("subtitle")}
            </p>
          </div>

          {/* Mobile & Tablet Single Pill Button */}
          <a
            href={downloadHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 min-w-[160px] items-center justify-center gap-[var(--spacing-space-10)] rounded-[var(--radius-999)] bg-primary px-[var(--spacing-space-24)] py-[var(--spacing-space-10)] text-base font-medium text-text-inverse transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
          >
            {downloadLabel}
          </a>

          {/* Desktop Store Buttons */}
          <div className="hidden flex-wrap items-center gap-3 lg:flex">
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
        <div className="flex w-full max-w-[320px] shrink-0 items-center justify-center md:h-full md:w-[283px] md:max-w-none lg:w-[440px]">
          <Image
            src={imageSrc}
            alt={t("imageAlt")}
            width={440}
            height={448}
            loading="eager"
            sizes="(max-width: 767px) 320px, (max-width: 1023px) 283px, 440px"
            className="h-[258px] w-full object-contain object-center md:h-full md:max-h-[335px] lg:max-h-[448px]"
          />
        </div>
      </div>
    </LayoutWrapper>
  );
}
