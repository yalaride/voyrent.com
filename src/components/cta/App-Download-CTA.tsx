import Image, { type StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";

import appCtaPhonesImg from "../../../public/cta/Landing-Section-CTA.png"; // adjust path to /public
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
      <div className="flex w-full flex-col items-center justify-between gap-8  sm:flex-row sm:gap-6 lg:min-h-[448px] lg:gap-10 ">
        {/* Left Side Content */}
        <div className="flex w-full flex-1 flex-col items-center gap-6 text-center sm:max-w-[683px] sm:items-start sm:gap-8 sm:text-start">
          <div className="flex w-full flex-col items-center gap-[var(--spacing-space-8)] sm:items-start">
            <h2 className="text-[32px] font-semibold leading-[1.16] tracking-[-0.02em] text-text-primary sm:text-[36px] lg:text-[48px]">
              {t.rich("title", {
                brand: (chunks) => (
                  <span className="text-primary">{chunks}</span>
                ),
              })}
            </h2>
            <p className="max-w-[440px] text-sm font-medium leading-[1.5] text-text-secondary sm:max-w-[683px] sm:text-base">
              {t("subtitle")}
            </p>
          </div>

          {/* Mobile & Tablet Single Pill Button */}
          <a
            href={downloadHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-base font-medium text-text-inverse transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
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

        {/* Right Side Phones Mockup (no `fill`, eager loading) */}
        <div className="flex w-full max-w-[320px] shrink-0 items-center justify-center sm:w-[280px] sm:max-w-none md:w-[340px] lg:w-[440px]">
          <Image
            src={imageSrc}
            alt={t("imageAlt")}
            width={440}
            height={360}
            loading="eager"
            sizes="(max-width: 639px) 320px, (max-width: 1023px) 340px, 440px"
            className="h-[260px] w-full object-contain object-center sm:h-[270px] md:h-[310px] lg:h-[360px]"
          />
        </div>
      </div>
    </LayoutWrapper>
  );
}
