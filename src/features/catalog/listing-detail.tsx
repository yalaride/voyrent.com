import { Suspense } from "react";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { DealerOpeningHours } from "@/components/car-detail/dealer-opening-hours";
import { ListingDealerDrawer } from "@/components/car-detail/ListingDealerDrawer";
import { ListingDesktopGallery } from "@/components/car-detail/ListingDesktopGallery";
import {
  ListingFeaturesCard,
  type FeatureCategoryData,
} from "@/components/car-detail/ListingFeaturesCard";
import { ListingMobileGallery } from "@/components/car-detail/ListingMobileGallery";
import {
  ListingPricingCard,
  type PricingPeriodData,
} from "@/components/car-detail/ListingPricingCard";
import {
  ListingRentalTerms,
  type RentalTermItem,
} from "@/components/car-detail/ListingRentalTerms";
import {
  CheckIcon,
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
import { slugify } from "@/lib/slugify";
import { getDisplayCurrency } from "@/server/preferences/currency";

const FALLBACK_IMAGES = [
  "/blog/blog1.jpg",
  "/blog/blog2.jpg",
  "/blog/blog3.jpg",
  "/car-image/image-1.jpg",
  "/car-image/image-2.jpg",
  "/car-image/image-3.jpg",
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
  dailyMileageKm?: number;
  weeklyMileageKm?: number;
  monthlyMileageKm?: number;
  additionalMileageMinor?: number;
  additionalMileageDailyMinor?: number;
  additionalMileageWeeklyMinor?: number;
  additionalMileageMonthlyMinor?: number;
  chauffeurDailyMinor?: number;
  chauffeurWeeklyMinor?: number;
  chauffeurMonthlyMinor?: number;
  chauffeurTooltipText?: string;
  minDays?: number;
  insuranceIncluded?: boolean;
  mileagePolicyText?: string;
  fuelPolicyText?: string;
  depositPolicyText?: string;
  rentalPolicyText?: string;
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
  supplierSlug?: string;
  supplierLogo?: string;
  supplierPhone?: string;
  supplierWhatsapp?: string;
  mapPreviewImage?: string;
  carFleet?: string[];
  listedIn?: string[];
  paymentModes?: string[];
  closesAtLabel?: string;
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
  const [t, body, currency, pm] = await Promise.all([
    getTranslations("Listings"),
    getTranslations("BodyTypes"),
    getDisplayCurrency(market.currency),
    getTranslations("paymentModes"),
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
  const showLessFeaturesLabel = tf("showLess", "Show less");
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
  const kmUnit = tf("kmUnit", "km");

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

  // Per-period mileage limits (API values or calculated fallbacks)
  const dailyMileageKm =
    details.dailyMileageKm ?? details.includedMileageKm ?? 250;
  const weeklyMileageKm = details.weeklyMileageKm ?? dailyMileageKm * 7;
  const monthlyMileageKm = details.monthlyMileageKm ?? dailyMileageKm * 22;

  const formatKm = (count: number) =>
    t.has("kmValue") ? t("kmValue", { count }) : `${count} ${kmUnit}`;

  // Per-period additional mileage charges (API values or fallback)
  const additionalMileageDailyMinor =
    details.additionalMileageDailyMinor ?? details.additionalMileageMinor;
  const additionalMileageWeeklyMinor =
    details.additionalMileageWeeklyMinor ?? additionalMileageDailyMinor;
  const additionalMileageMonthlyMinor =
    details.additionalMileageMonthlyMinor ?? additionalMileageDailyMinor;

  const formatExtraKmCharge = (minor?: number) => {
    const formatted = minor
      ? formatConverted(minor)
      : formatMoney(convertMinor(136, "USD", currency), currency, locale);
    return `${formatted} / ${kmUnit}`;
  };

  // Per-period chauffeur charges (API values or scaled fallback)
  const chauffeurDailyMinor = details.chauffeurDailyMinor;
  const chauffeurWeeklyMinor =
    details.chauffeurWeeklyMinor ??
    (chauffeurDailyMinor ? chauffeurDailyMinor * 7 : 540 * 7);
  const chauffeurMonthlyMinor =
    details.chauffeurMonthlyMinor ??
    (chauffeurDailyMinor ? chauffeurDailyMinor * 22 : 540 * 22);

  const formatChauffeur = (minor: number | undefined, unit: string) => {
    const formatted = minor
      ? formatConverted(minor)
      : formatMoney(convertMinor(540, "USD", currency), currency, locale);
    return `${formatted} / ${unit}`;
  };

  const pricingPeriods: PricingPeriodData[] = [
    {
      key: "day",
      price: daily,
      originalPrice: originalDaily,
      unit: dayUnit,
      includedMileageText: formatKm(dailyMileageKm),
      additionalMileageText: formatExtraKmCharge(additionalMileageDailyMinor),
      chauffeurText: formatChauffeur(chauffeurDailyMinor, dayUnit),
    },
    {
      key: "week",
      price: weekly,
      originalPrice: originalWeekly,
      unit: weekUnit,
      includedMileageText: formatKm(weeklyMileageKm),
      additionalMileageText: formatExtraKmCharge(additionalMileageWeeklyMinor),
      chauffeurText: formatChauffeur(chauffeurWeeklyMinor, weekUnit),
    },
    {
      key: "month",
      price: monthly,
      originalPrice: originalMonthly,
      unit: monthUnit,
      includedMileageText: formatKm(monthlyMileageKm),
      additionalMileageText: formatExtraKmCharge(additionalMileageMonthlyMinor),
      chauffeurText: formatChauffeur(chauffeurMonthlyMinor, monthUnit),
    },
  ];

  const minRentalText =
    details.minDays && details.minDays > 1 && t.has("minDays")
      ? t("minDays", { count: details.minDays })
      : tf("oneDayRentalAvailable", "1 day rental available");
  const showInsuranceIncluded = details.insuranceIncluded !== false;
  const insuranceIncludedText = tf("insuranceIncluded", "Insurance included");

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

  const featureCategories: FeatureCategoryData[] = [
    {
      key: "comfort",
      title: tf("featureComfort", "Comfort & Convenience"),
      items:
        details.features?.comfort && details.features.comfort.length > 0
          ? details.features.comfort
          : defaultFeatureItems,
      expandedFallbackItems: [
        tf("fallbackComfort1", "Dual-Zone Climate Control"),
        tf("fallbackComfort2", "Keyless Entry & Push Start"),
        tf("fallbackComfort3", "Leather Upholstery"),
      ],
    },
    {
      key: "technology",
      title: tf("featureTechnology", "Technology & Connectivity"),
      items:
        details.features?.technology && details.features.technology.length > 0
          ? details.features.technology
          : defaultFeatureItems,
      expandedFallbackItems: [
        tf("fallbackTech1", "Apple CarPlay & Android Auto"),
        tf("fallbackTech2", "Bluetooth Audio & Hands-Free"),
        tf("fallbackTech3", "Digital Instrument Cluster"),
      ],
    },
    {
      key: "safety",
      title: tf("featureSafety", "Safety & driver assistance"),
      items:
        details.features?.safety && details.features.safety.length > 0
          ? details.features.safety
          : defaultFeatureItems,
      expandedFallbackItems: [
        tf("fallbackSafety1", "Adaptive Cruise Control"),
        tf("fallbackSafety2", "Blind Spot Monitoring"),
        tf("fallbackSafety3", "360° Parking Sensors"),
      ],
    },
    {
      key: "appearance",
      title: tf("featureAppearance", "Appearance & Style"),
      items:
        details.features?.appearance && details.features.appearance.length > 0
          ? details.features.appearance
          : defaultFeatureItems,
      expandedFallbackItems: [
        tf("fallbackAppearance1", "LED Headlights"),
        tf("fallbackAppearance2", "Alloy Wheels"),
        tf("fallbackAppearance3", "Panoramic Sunroof"),
      ],
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

  const rentalTermItems: RentalTermItem[] = [
    {
      key: "mileagePolicy",
      label: tf("mileagePolicy", "Mileage Policy"),
      tooltip:
        details.mileagePolicyText?.trim() ||
        tf(
          "mileagePolicyTooltip",
          "Included mileage applies per selected period. Extra distance beyond the limit is billed per km.",
        ),
    },
    {
      key: "fuelPolicy",
      label: tf("fuelPolicy", "Fuel Policy"),
      tooltip:
        details.fuelPolicyText?.trim() ||
        tf(
          "fuelPolicyTooltip",
          "Full-to-full fuel policy: return the vehicle with the same fuel level as provided at pickup.",
        ),
    },
    {
      key: "depositPolicy",
      label: tf("depositPolicy", "Deposit Policy"),
      tooltip:
        details.depositPolicyText?.trim() ||
        tf(
          "depositPolicyTooltip",
          "A refundable security deposit may be required at pickup and is released after vehicle inspection.",
        ),
    },
    {
      key: "rentalPolicy",
      label: tf("rentalPolicy", "Rental Policy"),
      tooltip:
        details.rentalPolicyText?.trim() ||
        tf(
          "rentalPolicyTooltip",
          "Valid driver's license, ID or passport, and minimum age requirements apply at rental pickup.",
        ),
    },
  ];

  const phoneHref = details.supplierPhone
    ? `tel:${details.supplierPhone}`
    : "#";
  const whatsappHref = details.supplierWhatsapp
    ? `https://wa.me/${details.supplierWhatsapp.replace(/\D/g, "")}`
    : "#";

  const dealerLocationLabel = details.locationLabel?.trim() || cityName;

  const compactDrawerLocation =
    details.locationLabel?.trim() ||
    (t.has("fallbackDealerCityCountry")
      ? t("fallbackDealerCityCountry", { city: cityName })
      : `${cityName}, Pakistan`);

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

  const listedInFallback =
    details.listedIn && details.listedIn.length > 0
      ? details.listedIn
      : [tf("fallbackListedIn1", "Sports Car Rentals in Model Town")];

  const paymentModesFallback =
    details.paymentModes && details.paymentModes.length > 0
      ? details.paymentModes
      : tf("fallbackPaymentModes", "Cash, Credit Card, Debit Card, Crypto")
          .split(/,|،/)
          .map((mode) => mode.trim())
          .filter(Boolean);

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
  const companySlug = details.supplierSlug?.trim() || slugify(listing.supplier);

  const dealerHref = `/company/${market.city}/${companySlug}`;
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
                <h1 className="text-[22px] font-semibold leading-[1.3] tracking-tight text-text-primary sm:text-[26px] lg:text-[32px] lg:leading-[1.35]">
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

            {/* 2. Pricing Card + Rental Availability / Insurance Highlights */}
            <div className="order-2 flex flex-col gap-4 sm:gap-6">
              <ListingPricingCard
                title={pricingTitle}
                periods={pricingPeriods}
                includedMileageLabel={tf(
                  "includedMileage",
                  "Included mileage limit",
                )}
                additionalMileageLabel={tf(
                  "additionalMileageCharges",
                  "Additional mileage charges",
                )}
                chauffeurLabel={tf(
                  "chauffeurCharges",
                  "Additional Chauffeur / Driver charges",
                )}
                chauffeurTooltip={
                  details.chauffeurTooltipText?.trim() ||
                  tf(
                    "chauffeurTooltip",
                    "Optional professional chauffeur service billed per selected rental period.",
                  )
                }
              />

              <div className="flex flex-wrap items-center gap-x-10 gap-y-3 rounded-[var(--radius-24)] border border-border-default bg-background-primary px-4 py-4 sm:px-8 sm:py-5">
                <span className="inline-flex items-center gap-2.5 text-[14px] font-normal text-text-secondary sm:text-[15px]">
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-text-inverse">
                    <CheckIcon className="size-3" />
                  </span>
                  <span>{minRentalText}</span>
                </span>

                {showInsuranceIncluded ? (
                  <span className="inline-flex items-center gap-2.5 text-[14px] font-normal text-text-secondary sm:text-[15px]">
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-text-inverse">
                      <CheckIcon className="size-3" />
                    </span>
                    <span>{insuranceIncludedText}</span>
                  </span>
                ) : null}
              </div>
            </div>

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
            <ListingFeaturesCard
              featuresTitle={featuresTitle}
              categories={featureCategories}
              viewAllFeaturesLabel={viewAllFeaturesLabel}
              showLessLabel={showLessFeaturesLabel}
              installedOptionsTitle={installedOptionsTitle}
              installedOptions={installedOptions}
              installedOptionsNote={installedOptionsNote}
            />
          </div>

          {/* Dealer Info & Contact Card */}
          <aside className="order-3 flex h-fit w-full flex-col gap-[var(--spacing-space-16)] rounded-[var(--radius-24)] border border-border-default bg-background-primary p-4 sm:gap-[var(--spacing-space-20)] sm:p-[var(--spacing-space-24)] lg:sticky lg:top-28 lg:col-start-2 lg:row-start-1 lg:order-none">
            {/* Dealer Header (Review & rating section removed) */}
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

              <div className="flex min-w-0 flex-1 flex-col">
                <p className="flex items-center gap-1.5 text-[17px] font-semibold leading-tight text-text-primary sm:text-[18px]">
                  <span className="truncate">{listing.supplier}</span>
                  <ShieldIcon className="size-4 shrink-0 text-primary" />
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

              {/* Rental Terms with hover/focus tooltips */}
              <ListingRentalTerms
                title={tf("rentalTerms", "Rental Terms")}
                items={rentalTermItems}
              />

              <hr className="border-t border-border-subtle" />

              {/* Dealer's Info & Location */}
              <div className="py-[var(--spacing-space-4)] sm:py-[var(--spacing-space-12)]">
                <ListingDealerDrawer
                  labels={{
                    triggerLabel: tf(
                      "dealerInfoLocation",
                      "Dealer's Info & Location",
                    ),
                    drawerTitle: tf("dealerInfoTitle", "Dealer Information"),
                    viewMoreDetail: tf("viewMoreDetail", "View more detail"),
                    viewAllCarsByDealer: tf(
                      "viewAllCarsByDealer",
                      "View All Cars by this Dealer",
                    ),
                    carFleetTitle: tf("carFleet", "Car Fleet"),
                    listedInTitle: tf("listedIn", "Listed In"),
                    paymentModesLabel: tf("paymentModes", "Payment Modes"),
                    closeLabel: tf("close", "Close"),
                    paymentModes: {
                      title: pm("title"),
                      closeLabel: tf("close", "Close"),
                      crypto: {
                        title: pm("crypto.title"),
                        description: pm("crypto.description"),
                      },
                      cash: {
                        title: pm("cash.title"),
                        description: pm("cash.description"),
                      },
                      credit: {
                        title: pm("credit.title"),
                        description: pm("credit.description"),
                      },
                      debit: {
                        title: pm("debit.title"),
                        description: pm("debit.description"),
                      },
                      tipPrefix: pm("tipPrefix"),
                      tipBody: pm("tipBody"),
                      tipSuffix: pm("tipSuffix"),
                      depositNote: pm("depositNote"),
                    },
                  }}
                  supplierName={listing.supplier}
                  locationLabel={compactDrawerLocation}
                  mapPreviewImage={details.mapPreviewImage}
                  dealerHref={dealerHref}
                  carFleet={carFleetFallback}
                  listedIn={listedInFallback}
                  paymentModes={paymentModesFallback}
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
