import { Suspense } from "react";
import Image from "next/image";
import { Clock, Info, MapPin, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { DealerInfoDrawer } from "@/components/car-detail/DealerInfoDrawer";
import { DealerOpeningHours } from "@/components/car-detail/dealer-opening-hours";
import { ListingDesktopGallery } from "@/components/car-detail/ListingDesktopGallery";
import { ListingMobileGallery } from "@/components/car-detail/ListingMobileGallery";
import {
  ChevronRightIcon,
  HeartIcon,
  ShareIcon,
  ShieldIcon,
} from "@/components/icons";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Button } from "@/components/ui/button";
import type { VehicleListing } from "@/domain/catalog/types";
import { convertMinor, formatMoney } from "@/domain/currency/format";
import type { AppLocale } from "@/domain/geo/locales";
import { localize, type Market } from "@/domain/geo/markets";
import { catalogPath } from "@/domain/routing/rent-paths";
import { ListingSection } from "@/features/catalog/listing-section";
import { ListingSkeleton } from "@/features/catalog/listing-skeleton";
import { Link } from "@/i18n/navigation";
import { getDisplayCurrency } from "@/server/preferences/currency";

const FALLBACK_IMAGES = [
  "/blog/blog1.jpg",
  "/blog/blog2.jpg",
  "/blog/blog3.jpg",
] as const;

const normalizeImageSrc = (src: string) => {
  const trimmed = src.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
    ? trimmed
    : `/${trimmed}`;
};

type ListingWithDetails = VehicleListing & {
  year?: number;
  trim?: string;
  locationLabel?: string;
  updatedAtLabel?: string;
  originalDailyPriceMinor?: number;
  weeklyPriceMinor?: number;
  originalWeeklyPriceMinor?: number;
  originalMonthlyPriceMinor?: number;
  includedMileageKm?: number;
  additionalMileageMinor?: number;
  chauffeurDailyMinor?: number;
  mileageLabel?: string;
  mpgLabel?: string;
  fuelType?: string;
  engine?: string;
  exteriorColor?: string;
  interiorColor?: string;
  features?: {
    comfort?: string[];
    technology?: string[];
    safety?: string[];
    appearance?: string[];
  };
  installedOptions?: string[];
  supplierLogo?: string;
  supplierRating?: number;
  supplierReviewsCount?: number;
  supplierPhone?: string;
  supplierWhatsapp?: string;
  mapPreviewImage?: string;
  branchLocations?: string[];
  fastDeliveryLocations?: string[];
  carFleet?: string[];
  languagesSpoken?: string[];
  aboutDealer?: string;
  closesAtLabel?: string;
  branchPickup?: boolean;
  deliveryToYou?: boolean;
  openingHours?: Array<{ dayIndex: number; hours: string }>;
};

export async function ListingDetail({
  market,
  locale,
  listing,
}: {
  market: Market;
  locale: AppLocale;
  listing: VehicleListing;
}) {
  const [t, body, currency] = await Promise.all([
    getTranslations("Listings"),
    getTranslations("BodyTypes"),
    getDisplayCurrency(market.currency),
  ]);

  const tf = (key: string, fallback: string) =>
    t.has(key) ? t(key) : fallback;

  const details = listing as ListingWithDetails;

  const homeLabel = tf("home", "Home");
  const breadcrumbLabel = tf("breadcrumb", "Breadcrumb");
  const premiumLabel = tf("premium", "Premium");
  const shareLabel = tf("share", "Share");
  const saveLabel = tf("save", "Save");
  const prevImageLabel = tf("prevImage", "Previous image");
  const nextImageLabel = tf("nextImage", "Next image");
  const showMoreImagesLabel = tf("showMoreImages", "Show more");
  const pricingTitle = tf("pricingTitle", "Pricing");
  const overviewTitle = tf("overviewTitle", "Overview");
  const featuresTitle = tf("featuresTitle", "Features");
  const viewAllFeaturesLabel = tf("viewAllFeatures", "View all features");
  const installedOptionsTitle = tf(
    "installedOptionsTitle",
    "Installed options & packages",
  );
  const installedOptionsNote = tf(
    "installedOptionsNote",
    "*May replace standard equipment.",
  );

  const dayUnit = tf("dayUnit", "day");
  const weekUnit = tf("weekUnit", "week");
  const monthUnit = tf("monthUnit", "mon");

  const cityName = localize(market.cityNames, locale);
  const fullTitle = [details.year, listing.make, listing.model, details.trim]
    .filter(Boolean)
    .join(" ");

  const formatConverted = (amountMinor: number) =>
    formatMoney(
      convertMinor(amountMinor, listing.currency, currency),
      currency,
      locale,
    );

  const daily = formatConverted(listing.dailyPriceMinor);
  const weeklyMinor = details.weeklyPriceMinor ?? listing.dailyPriceMinor * 7;
  const weekly = formatConverted(weeklyMinor);
  const monthlyMinor =
    listing.monthlyPriceMinor ?? listing.dailyPriceMinor * 22;
  const monthly = formatConverted(monthlyMinor);

  const originalDaily = details.originalDailyPriceMinor
    ? formatConverted(details.originalDailyPriceMinor)
    : null;
  const originalWeekly = details.originalWeeklyPriceMinor
    ? formatConverted(details.originalWeeklyPriceMinor)
    : null;
  const originalMonthly = details.originalMonthlyPriceMinor
    ? formatConverted(details.originalMonthlyPriceMinor)
    : null;

  const includedMileageKm = details.includedMileageKm ?? 1750;
  const additionalMileagePrice = details.additionalMileageMinor
    ? formatConverted(details.additionalMileageMinor)
    : formatMoney(convertMinor(136, "USD", currency), currency, locale);
  const chauffeurDailyPrice = details.chauffeurDailyMinor
    ? formatConverted(details.chauffeurDailyMinor)
    : formatMoney(convertMinor(540, "USD", currency), currency, locale);

  const rawImages =
    "images" in listing && Array.isArray(listing.images)
      ? listing.images
          .filter(
            (src): src is string =>
              typeof src === "string" && src.trim().length > 0,
          )
          .map(normalizeImageSrc)
          .filter(Boolean)
      : [];

  const galleryImages = rawImages.length > 0 ? rawImages : [...FALLBACK_IMAGES];

  const breadcrumbLinkClass =
    "inline-flex shrink-0 items-center text-center text-[14px] font-medium leading-[1.5] tracking-normal text-text-secondary no-underline transition-colors hover:text-text-primary hover:no-underline md:text-[16px]";

  const engineLabel =
    details.engine?.trim() || tf("fallbackEngine", "3.0L V6 Twin-Turbo");

  const overviewRows: Array<{ label: string; value: string }> = [
    {
      label: tf("bodyType", body("title")),
      value: body(listing.bodyType),
    },
    {
      label: tf("make", "Make"),
      value: listing.make,
    },
    {
      label: tf("model", "Model"),
      value: listing.model,
    },
    {
      label: tf("mileage", "Mileage"),
      value: details.mileageLabel?.trim() || tf("fallbackMileage", "12,500 km"),
    },
    {
      label: tf("seatingCapacity", "Seating Capacity"),
      value: t.has("passengers")
        ? t("passengers", { count: listing.seats })
        : t("seats", { count: listing.seats }),
    },
    {
      label: tf("mpg", "Mpg"),
      value: details.mpgLabel?.trim() || tf("fallbackMpg", "22 City / 30 Hwy"),
    },
    {
      label: tf("transmissionLabel", "Transmission"),
      value: t(listing.transmission),
    },
    {
      label: tf("fuelType", "Fuel Type"),
      value: details.fuelType?.trim() || tf("gasoline", "Gasoline"),
    },
    {
      label: tf("engine", "Engine"),
      value: engineLabel,
    },
    {
      label: tf("extColor", "Ext. Color"),
      value:
        details.exteriorColor?.trim() ||
        tf("fallbackExtColor", "Obsidian Black"),
    },
    {
      label: tf("intColor", "Int. Color"),
      value:
        details.interiorColor?.trim() ||
        tf("fallbackIntColor", "Beige Leather"),
    },
  ];

  const defaultFeatureItems = [
    tf("featureBackupCamera", "Backup Camera"),
    tf("featureCleanTitle", "Clean Title"),
    tf("featureNoAccidents", "No Accidents"),
  ];

  const featureCategories = [
    {
      key: "comfort",
      title: tf("featureComfort", "Comfort & Convenience"),
      items:
        details.features?.comfort && details.features.comfort.length > 0
          ? details.features.comfort
          : defaultFeatureItems,
    },
    {
      key: "technology",
      title: tf("featureTechnology", "Technology & Connectivity"),
      items:
        details.features?.technology && details.features.technology.length > 0
          ? details.features.technology
          : defaultFeatureItems,
    },
    {
      key: "safety",
      title: tf("featureSafety", "Safety & driver assistance"),
      items:
        details.features?.safety && details.features.safety.length > 0
          ? details.features.safety
          : defaultFeatureItems,
    },
    {
      key: "appearance",
      title: tf("featureAppearance", "Appearance & Style"),
      items:
        details.features?.appearance && details.features.appearance.length > 0
          ? details.features.appearance
          : defaultFeatureItems,
    },
  ];

  const installedOptions =
    details.installedOptions && details.installedOptions.length > 0
      ? details.installedOptions
      : [
          `${tf("engine", "Engine")}: ${engineLabel}`,
          `${tf("transmissionLabel", "Transmission")}: ${t(listing.transmission)}`,
          ...(listing.airportDelivery
            ? [tf("airport", "Airport Delivery")]
            : []),
          ...(!listing.depositRequired ? [tf("noDeposit", "No Deposit")] : []),
        ];

  const phoneHref = details.supplierPhone
    ? `tel:${details.supplierPhone}`
    : "#";
  const whatsappHref = details.supplierWhatsapp
    ? `https://wa.me/${details.supplierWhatsapp.replace(/\D/g, "")}`
    : "#";

  const supplierRating = details.supplierRating ?? 4.7;
  const reviewsLabel = t.has("reviewsCount")
    ? t("reviewsCount", {
        count: details.supplierReviewsCount ?? 812,
      })
    : `${details.supplierReviewsCount ?? 812} reviews`;

  const dealerLocationLabel = details.locationLabel?.trim() || cityName;

  const drawerAddressFallback =
    details.locationLabel?.trim() ||
    tf("fallbackDealerAddress", "3914 Hempstead Tpke, Levittown, NY 11756");

  const branchLocationsFallback =
    details.branchLocations && details.branchLocations.length > 0
      ? details.branchLocations
      : [
          tf("fallbackBranchLocation1", "Gulberg, Lahore"),
          tf("fallbackBranchLocation2", "Model Town, Lahore"),
        ];

  const fastDeliveryLocationsFallback =
    details.fastDeliveryLocations && details.fastDeliveryLocations.length > 0
      ? details.fastDeliveryLocations
      : [
          tf("fallbackDeliveryLocation1", "Airport Terminal 1"),
          tf("fallbackDeliveryLocation2", "Dubai Harbour"),
          tf("fallbackDeliveryLocation3", "Dubai South"),
          tf("fallbackDeliveryLocation4", "Ruwi"),
          tf("fallbackDeliveryLocation5", "Sheikh Zayed Road"),
          tf("fallbackDeliveryLocation6", "JBR"),
          tf("fallbackDeliveryLocation7", "Business Bay"),
          tf("fallbackDeliveryLocation8", "Palm Jumeirah"),
          tf("fallbackDeliveryLocation9", "Dubai Mall"),
        ];

  const carFleetFallback =
    details.carFleet && details.carFleet.length > 0
      ? details.carFleet
      : [
          tf("fallbackFleetCommercial", "Commercial"),
          tf("fallbackFleetSuv", "SUV"),
          tf("fallbackFleetLuxury", "Luxury"),
          tf("fallbackFleetHybrid", "Hybrid"),
          tf("fallbackFleetConvertible", "Convertible"),
          tf("fallbackFleetSupercar", "Supercar"),
        ];

  const languagesSpokenFallback =
    details.languagesSpoken && details.languagesSpoken.length > 0
      ? details.languagesSpoken
      : [
          tf("fallbackLanguageEnglish", "English"),
          tf("fallbackLanguageArabic", "Arabic"),
          tf("fallbackLanguageUrdu", "Urdu"),
          tf("fallbackLanguageFrench", "French"),
        ];

  const aboutDealerFallback =
    details.aboutDealer?.trim() ||
    (t.has("fallbackAboutDealer")
      ? t("fallbackAboutDealer", {
          name: listing.supplier,
          city: cityName,
        })
      : `Discover luxury and comfort with ${listing.supplier}, your premier choice for car rentals in ${cityName}. Whether you're a resident or a visitor, our aim is to make renting a premium automobile effortless and enjoyable. Our experienced and knowledgeable staff is dedicated to listening to your requirements and recommending the ideal vehicle for your journey, ensuring a seamless blend of style, luxury, and convenience.`);

  const defaultHours = tf("defaultOpeningHours", "9:00 AM - 7:00 PM");
  const dayKeys = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  const fallbackDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ] as const;

  const openStatusLabel = tf("openStatus", "Open");
  const closesAtTime =
    details.closesAtLabel ?? tf("defaultClosesAtTime", "7:00 PM");
  const closesAtLabel = t.has("closesAt")
    ? t("closesAt", { time: closesAtTime })
    : `Closes at ${closesAtTime}`;

  const schedule = dayKeys.map((key, idx) => ({
    dayIndex: idx,
    label: tf(key, fallbackDays[idx]),
    hours:
      details.openingHours?.find((d) => d.dayIndex === idx)?.hours ??
      defaultHours,
  }));

  const callLabel = tf("call", "Call");
  const whatsappLabel = tf("whatsapp", "WhatsApp");

  const callButton = (
    <Button
      asChild
      variant="default"
      size="lg"
      className="w-full rounded-full px-4 no-underline"
    >
      <a href={phoneHref}>
        <Image
          unoptimized
          src="/icons/phone.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
          className="size-5 shrink-0 brightness-0 invert"
        />
        <span>{callLabel}</span>
      </a>
    </Button>
  );

  const whatsappButton = (
    <Button
      asChild
      variant="whatsapp-solid"
      size="lg"
      className="w-full rounded-full px-4 no-underline"
    >
      <a
        href={whatsappHref}
        target={details.supplierWhatsapp ? "_blank" : undefined}
        rel={details.supplierWhatsapp ? "noopener noreferrer" : undefined}
      >
        <Image
          unoptimized
          src="/icons/whatsapp.svg"
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
          className="size-5 shrink-0 brightness-0 invert"
        />
        <span>{whatsappLabel}</span>
      </a>
    </Button>
  );

  return (
    <article className="w-full">
      {/* Breadcrumb Bar */}
      <div className="w-full border-t border-border-subtle bg-background-primary">
        <LayoutWrapper className="flex min-h-12 items-center py-3 md:min-h-16 md:py-[var(--spacing-space-20)]">
          <nav aria-label={breadcrumbLabel} className="w-full">
            <ol className="flex flex-nowrap items-center gap-[var(--spacing-space-6)] overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap">
              <li className="inline-flex shrink-0 items-center">
                <Link href="/" className={breadcrumbLinkClass}>
                  {homeLabel}
                </Link>
              </li>

              <li
                aria-hidden="true"
                className="inline-flex shrink-0 items-center"
              >
                <ChevronRightIcon className="size-4 shrink-0 text-text-secondary rtl:rotate-180" />
              </li>

              <li className="inline-flex shrink-0 items-center">
                <Link
                  href={catalogPath(market.city)}
                  className={breadcrumbLinkClass}
                >
                  {cityName}
                </Link>
              </li>

              <li
                aria-hidden="true"
                className="inline-flex shrink-0 items-center"
              >
                <ChevronRightIcon className="size-4 shrink-0 text-text-secondary rtl:rotate-180" />
              </li>

              <li className="inline-flex shrink-0 items-center">
                <Link
                  href={catalogPath(market.city, { make: listing.makeSlug })}
                  className={breadcrumbLinkClass}
                >
                  {listing.make}
                </Link>
              </li>

              <li
                aria-hidden="true"
                className="inline-flex shrink-0 items-center"
              >
                <ChevronRightIcon className="size-4 shrink-0 text-text-secondary rtl:rotate-180" />
              </li>

              <li className="inline-flex shrink-0 items-center">
                <span
                  aria-current="page"
                  className="inline-flex items-center text-[14px] font-medium leading-[1.5] tracking-normal text-text-primary no-underline md:text-[16px]"
                >
                  {fullTitle}
                </span>
              </li>
            </ol>
          </nav>
        </LayoutWrapper>
      </div>

      <LayoutWrapper className="pb-24 sm:pb-12">
        {/* Mobile & Tablet Gallery (< lg) */}
        <ListingMobileGallery
          images={galleryImages}
          title={fullTitle}
          isFeatured={Boolean(listing.featured)}
          premiumLabel={premiumLabel}
          prevLabel={prevImageLabel}
          nextLabel={nextImageLabel}
        />

        {/* Desktop Gallery (lg+) */}
        <ListingDesktopGallery
          images={galleryImages}
          title={fullTitle}
          isFeatured={Boolean(listing.featured)}
          premiumLabel={premiumLabel}
          prevLabel={prevImageLabel}
          nextLabel={nextImageLabel}
          showMoreLabel={showMoreImagesLabel}
        />

        {/* Main Responsive Layout */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:grid-cols-[minmax(0,845px)_minmax(0,1fr)]">
          {/* Left Column Group */}
          <div className="contents lg:flex lg:flex-col lg:gap-6">
            {/* 1. Title + Location + Last Updated + Action Buttons */}
            <header className="order-1 flex flex-col gap-[var(--spacing-space-12)] sm:gap-[var(--spacing-space-16)]">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <h1 className="text-[22px] font-semibold leading-[1.3] tracking-tight text-text-primary sm:text-[28px] lg:text-[32px] lg:leading-[1.35]">
                  {fullTitle}
                </h1>

                <div className="flex shrink-0 items-center gap-[var(--spacing-space-8)]">
                  <Button variant="outline" size="icon" aria-label={shareLabel}>
                    <ShareIcon />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={saveLabel}
                    className="hover:border-danger hover:text-danger"
                  >
                    <HeartIcon />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-[var(--spacing-space-4)] text-[14px] font-normal leading-[1.5] tracking-normal text-text-secondary sm:text-[16px]">
                <p className="flex items-center gap-[var(--spacing-space-6)]">
                  <MapPin className="size-4 shrink-0" />
                  <span>{dealerLocationLabel}</span>
                </p>
                <p className="flex items-center gap-[var(--spacing-space-6)]">
                  <Clock className="size-4 shrink-0" />
                  <span>
                    {details.updatedAtLabel ??
                      tf("lastUpdatedDefault", "Recently updated")}
                  </span>
                </p>
              </div>
            </header>

            {/* 2. Pricing Card */}
            <section className="order-2 flex flex-col gap-[var(--spacing-space-16)] rounded-[var(--radius-24)] border border-border-default bg-background-primary p-4 sm:gap-[var(--spacing-space-20)] sm:p-8">
              <h2 className="text-[20px] font-semibold leading-[1.26] tracking-[-0.02em] text-text-primary sm:text-[24px]">
                {pricingTitle}
              </h2>

              <div className="grid min-h-[86px] grid-cols-3 gap-1.5 rounded-[var(--radius-16)] bg-background-secondary p-[var(--spacing-space-6)] sm:gap-[var(--spacing-space-12)]">
                {/* Daily */}
                <div className="flex flex-col items-center justify-center rounded-[var(--radius-12)] bg-background-primary px-2 py-2.5 text-center shadow-[var(--shadow-small)] sm:px-4">
                  {originalDaily ? (
                    <span className="text-xs font-normal text-text-secondary line-through sm:text-sm">
                      {originalDaily}
                    </span>
                  ) : null}
                  <div className="flex flex-col items-center justify-center sm:flex-row sm:items-baseline sm:gap-1">
                    <span className="text-[18px] font-bold leading-tight text-primary sm:text-[22px]">
                      {daily}
                    </span>
                    <span className="text-xs font-normal text-text-secondary sm:text-sm">
                      <span className="hidden sm:inline">/ </span>
                      {dayUnit}
                    </span>
                  </div>
                </div>

                {/* Weekly */}
                <div className="flex flex-col items-center justify-center rounded-[var(--radius-12)] px-2 py-2.5 text-center sm:px-4">
                  {originalWeekly ? (
                    <span className="text-xs font-normal text-text-secondary line-through sm:text-sm">
                      {originalWeekly}
                    </span>
                  ) : null}
                  <div className="flex flex-col items-center justify-center sm:flex-row sm:items-baseline sm:gap-1">
                    <span className="text-[18px] font-bold leading-tight text-primary sm:text-[22px]">
                      {weekly}
                    </span>
                    <span className="text-xs font-normal text-text-secondary sm:text-sm">
                      <span className="hidden sm:inline">/ </span>
                      {weekUnit}
                    </span>
                  </div>
                </div>

                {/* Monthly */}
                <div className="flex flex-col items-center justify-center rounded-[var(--radius-12)] px-2 py-2.5 text-center sm:px-4">
                  {originalMonthly ? (
                    <span className="text-xs font-normal text-text-secondary line-through sm:text-sm">
                      {originalMonthly}
                    </span>
                  ) : null}
                  <div className="flex flex-col items-center justify-center sm:flex-row sm:items-baseline sm:gap-1">
                    <span className="text-[18px] font-bold leading-tight text-primary sm:text-[22px]">
                      {monthly}
                    </span>
                    <span className="text-xs font-normal text-text-secondary sm:text-sm">
                      <span className="hidden sm:inline">/ </span>
                      {monthUnit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[var(--spacing-space-8)] text-[14px] leading-[1.5] sm:text-[16px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-text-secondary">
                    {tf("includedMileage", "Included mileage limit")}
                  </span>
                  <span className="shrink-0 whitespace-nowrap font-medium text-text-primary">
                    {t.has("kmValue")
                      ? t("kmValue", { count: includedMileageKm })
                      : `${includedMileageKm} km`}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-text-secondary">
                    {tf(
                      "additionalMileageCharges",
                      "Additional mileage charges",
                    )}
                  </span>
                  <span className="shrink-0 whitespace-nowrap font-medium text-text-primary">
                    {additionalMileagePrice} / {tf("kmUnit", "km")}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-[var(--spacing-space-6)] text-text-secondary">
                    <span>
                      {tf(
                        "chauffeurCharges",
                        "Additional Chauffeur / Driver charges",
                      )}
                    </span>
                    <Info
                      className="size-4 shrink-0 text-text-secondary"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="shrink-0 whitespace-nowrap font-medium text-text-primary">
                    {chauffeurDailyPrice} / {dayUnit}
                  </span>
                </div>
              </div>
            </section>

            {/* 3. Overview Card */}
            <section className="order-4 flex flex-col gap-[var(--spacing-space-16)] rounded-[var(--radius-24)] border border-border-default bg-background-primary p-4 sm:gap-[var(--spacing-space-20)] sm:p-8">
              <h2 className="text-[20px] font-semibold leading-[1.26] tracking-[-0.02em] text-text-primary sm:text-[24px]">
                {overviewTitle}
              </h2>

              <dl className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
                {overviewRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex min-h-[52px] items-center justify-between gap-[var(--spacing-space-6)] border-b border-border-subtle py-[var(--spacing-space-12)] sm:min-h-[56px] sm:py-[var(--spacing-space-16)]"
                  >
                    <dt className="text-[14px] font-normal leading-[1.5] text-text-secondary sm:text-[15px]">
                      {row.label}
                    </dt>
                    <dd className="text-end text-[14px] font-medium leading-[1.5] text-text-primary sm:text-[15px]">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* 4. Features + Installed Options & Packages Card */}
            <section className="order-5 flex flex-col gap-6 rounded-[var(--radius-24)] border border-border-default bg-background-primary p-4 sm:gap-8 sm:p-8">
              <h2 className="text-[20px] font-semibold leading-[1.26] tracking-[-0.02em] text-text-primary sm:text-[24px]">
                {featuresTitle}
              </h2>

              <hr className="border-t border-border-subtle" />

              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {featureCategories.map((category) => (
                    <div
                      key={category.key}
                      className="flex flex-col gap-[var(--spacing-space-12)]"
                    >
                      <h3 className="text-[18px] font-semibold leading-[1.4] text-text-primary">
                        {category.title}
                      </h3>
                      <ul className="list-disc space-y-1.5 ps-5 text-[15px] font-normal leading-[1.5] text-text-secondary">
                        {category.items.map((item, idx) => (
                          <li key={`${category.key}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div>
                  <button
                    type="button"
                    className="cursor-pointer text-[15px] font-medium text-link no-underline transition-opacity hover:opacity-80"
                  >
                    {viewAllFeaturesLabel}
                  </button>
                </div>
              </div>

              <hr className="border-t border-border-subtle" />

              <div className="flex flex-col gap-[var(--spacing-space-16)]">
                <h2 className="text-[20px] font-semibold leading-[1.26] tracking-[-0.02em] text-text-primary sm:text-[24px]">
                  {installedOptionsTitle}
                </h2>

                <ul className="space-y-2.5 text-[15px] font-normal leading-[1.5] text-text-secondary">
                  {installedOptions.map((option, idx) => (
                    <li key={idx}>{option}</li>
                  ))}
                </ul>

                <p className="pt-2 text-xs text-text-secondary">
                  {installedOptionsNote}
                </p>
              </div>
            </section>
          </div>

          {/* Dealer Info & Contact Card */}
          <aside className="order-3 flex h-fit w-full flex-col gap-[var(--spacing-space-16)] rounded-[var(--radius-24)] border border-border-default bg-background-primary p-4 sm:gap-[var(--spacing-space-20)] sm:p-[var(--spacing-space-24)] lg:sticky lg:top-28 lg:col-start-2 lg:row-start-1 lg:order-none">
            {/* Dealer Header */}
            <div className="flex items-center gap-[var(--spacing-space-12)]">
              <div className="relative flex size-[52px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-default bg-background-secondary text-sm font-semibold text-text-primary">
                {details.supplierLogo ? (
                  <Image
                    src={details.supplierLogo}
                    alt={listing.supplier}
                    fill
                    sizes="52px"
                    className="object-cover"
                  />
                ) : (
                  <span>{listing.supplier.slice(0, 2).toUpperCase()}</span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-space-6)]">
                <p className="flex items-center gap-1.5 text-[17px] font-semibold leading-tight text-text-primary sm:text-[18px]">
                  <span className="truncate">{listing.supplier}</span>
                  <ShieldIcon className="size-4 shrink-0 text-primary" />
                </p>

                <p className="flex items-center gap-1.5 text-sm leading-tight">
                  <Star className="size-4 shrink-0 fill-warning text-warning" />
                  <span className="font-semibold text-text-primary">
                    {supplierRating.toFixed(1)}
                  </span>
                  <span className="text-text-secondary">({reviewsLabel})</span>
                </p>
              </div>
            </div>

            <hr className="border-t border-border-subtle" />

            {/* Other Details */}
            <div className="flex flex-col gap-[var(--spacing-space-12)]">
              <DealerOpeningHours
                openStatusLabel={openStatusLabel}
                closesAtLabel={closesAtLabel}
                schedule={schedule}
              />

              <hr className="border-t border-border-subtle" />

              {/* Rental Terms */}
              <div className="flex flex-col gap-[var(--spacing-space-12)]">
                <h3 className="text-[16px] font-semibold leading-[1.4] text-text-primary">
                  {tf("rentalTerms", "Rental Terms")}
                </h3>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[14px] leading-[1.4] text-text-secondary sm:grid-cols-4 sm:text-[15px] lg:grid-cols-2">
                  {[
                    { key: "mileagePolicy", fallback: "Mileage Policy" },
                    { key: "fuelPolicy", fallback: "Fuel Policy" },
                    { key: "depositPolicy", fallback: "Deposit Policy" },
                    { key: "rentalPolicy", fallback: "Rental Policy" },
                  ].map((item) => {
                    const label = tf(item.key, item.fallback);
                    return (
                      <button
                        key={item.key}
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-1.5 text-start transition-colors hover:text-text-primary"
                      >
                        <span className="truncate">{label}</span>
                        <Info
                          className="size-4 shrink-0 text-text-secondary"
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="border-t border-border-subtle" />

              {/* Dealer's Info & Location */}
              <div className="py-[var(--spacing-space-4)] sm:py-[var(--spacing-space-12)]">
                <DealerInfoDrawer
                  labels={{
                    triggerLabel: tf(
                      "dealerInfoLocation",
                      "Dealer's Info & Location",
                    ),
                    drawerTitle: tf("dealerInfoTitle", "Dealer Information"),
                    branchInCityTitle: t.has("branchInCity")
                      ? t("branchInCity", { city: cityName })
                      : `Branch in ${cityName}`,
                    viewMoreDetail: tf("viewMoreDetail", "View more detail"),
                    branchLocationsTitle: tf(
                      "branchLocations",
                      "Branch Locations",
                    ),
                    shopTimingsTitle: tf("shopTimings", "Shop Timings"),
                    deliveryPickupTitle: tf(
                      "deliveryPickupServices",
                      "Delivery & Pick-up Services",
                    ),
                    branchPickupLabel: tf("branchPickup", "Branch Pick-up"),
                    deliveryToYouLabel: tf("deliveryToYou", "Delivery to You"),
                    airportDeliveryLabel: tf("airport", "Airport Delivery"),
                    fastDeliveryLocationsTitle: tf(
                      "fastDeliveryLocations",
                      "Fast Delivery Locations",
                    ),
                    carFleetTitle: tf("carFleet", "Car Fleet"),
                    goodToKnowTitle: tf("goodToKnow", "Good to know"),
                    languagesSpokenTitle: tf(
                      "languagesSpoken",
                      "Languages Spoken",
                    ),
                    aboutDealerTitle: t.has("aboutDealer")
                      ? t("aboutDealer", { name: listing.supplier })
                      : `About ${listing.supplier}`,
                    callLabel,
                    whatsappLabel,
                    closeLabel: tf("close", "Close"),
                  }}
                  supplierName={listing.supplier}
                  locationLabel={drawerAddressFallback}
                  mapPreviewImage={details.mapPreviewImage}
                  branchLocations={branchLocationsFallback}
                  schedule={schedule}
                  branchPickup={details.branchPickup ?? true}
                  deliveryToYou={details.deliveryToYou ?? true}
                  airportDelivery={listing.airportDelivery ?? true}
                  fastDeliveryLocations={fastDeliveryLocationsFallback}
                  carFleet={carFleetFallback}
                  languagesSpoken={languagesSpokenFallback}
                  aboutDealer={aboutDealerFallback}
                  phoneHref={phoneHref}
                  whatsappHref={whatsappHref}
                  hasWhatsapp={Boolean(details.supplierWhatsapp)}
                />
              </div>
            </div>

            {/* Action Buttons inside card for Tablet & Desktop (sm+) */}
            <div className="hidden grid-cols-2 gap-[var(--spacing-space-12)] sm:grid">
              {callButton}
              {whatsappButton}
            </div>
          </aside>
        </div>
      </LayoutWrapper>

      <Suspense fallback={<ListingSkeleton />}>
        <ListingSection
          market={market}
          locale={locale}
          query={{
            country: market.country,
            city: market.city,
            locale,
            sort: "recommended",
            page: 1,
            limit: 6,
          }}
        />
      </Suspense>

      {/* Sticky Bottom Action Bar for Mobile (< sm) */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-[var(--spacing-space-12)] border-t border-border-default bg-background-primary px-4 py-3 shadow-[var(--shadow-medium)] sm:hidden">
        {callButton}
        {whatsappButton}
      </div>
    </article>
  );
}
