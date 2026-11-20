import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { OpeningHourRow } from "@/components/car-detail/dealer-opening-hours";
import { DealerInfoDrawer } from "@/components/company/DealerInfoDrawer";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import type { AppLocale } from "@/domain/geo/locales";
import { localize, type Market } from "@/domain/geo/markets";

export type CompanyProfile = {
  slug: string;
  name: string;
  locationLabel?: string;
  mapPreviewImage?: string;
  branchLocations?: string[];
  openingHours?: Array<{ dayIndex: number; hours: string }>;
  branchPickup?: boolean;
  deliveryToYou?: boolean;
  airportDelivery?: boolean;
  fastDeliveryLocations?: string[];
  carFleet?: string[];
  languagesSpoken?: string[];
  aboutDealer?: string;
  phone?: string;
  whatsapp?: string;
};

export async function CompanyHeader({
  market,
  locale,
  company,
  totalCars,
}: {
  market: Market;
  locale: AppLocale;
  company: CompanyProfile;
  totalCars: number;
}) {
  const t = await getTranslations("Listings");
  const tf = (key: string, fallback: string) =>
    t.has(key) ? t(key) : fallback;

  const cityName = localize(market.cityNames, locale);

  const pageTitle = t.has("dealerPageTitle")
    ? t("dealerPageTitle", { name: company.name, city: cityName })
    : `${company.name}: Live Offers in ${cityName}`;

  const pageSubtitle = t.has("dealerPageSubtitle")
    ? t("dealerPageSubtitle", { count: totalCars })
    : `Choose among ${totalCars} rental cars and book directly via RutaRide. Zero commission, zero booking fees!`;

  const highlights = [
    tf("instantCallOrWhatsapp", "Instant call or WhatsApp"),
    tf("bookDirectWithDealer", "Book direct with dealer"),
    tf("ratesUpdatedDaily", "Rates updated daily"),
  ];

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

  const schedule: OpeningHourRow[] = dayKeys.map((key, idx) => ({
    dayIndex: idx,
    label: tf(key, fallbackDays[idx]),
    hours:
      company.openingHours?.find((d) => d.dayIndex === idx)?.hours ??
      defaultHours,
  }));

  const locationLabel =
    company.locationLabel?.trim() || tf("fallbackDealerAddress", cityName);

  const branchLocations =
    company.branchLocations && company.branchLocations.length > 0
      ? company.branchLocations
      : [
          tf("fallbackBranchLocation1", "Gulberg, Lahore"),
          tf("fallbackBranchLocation2", "Model Town, Lahore"),
        ];

  const fastDeliveryLocations =
    company.fastDeliveryLocations && company.fastDeliveryLocations.length > 0
      ? company.fastDeliveryLocations
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

  const carFleet =
    company.carFleet && company.carFleet.length > 0
      ? company.carFleet
      : [
          tf("fallbackFleetCommercial", "Commercial"),
          tf("fallbackFleetSuv", "SUV"),
          tf("fallbackFleetLuxury", "Luxury"),
          tf("fallbackFleetHybrid", "Hybrid"),
          tf("fallbackFleetConvertible", "Convertible"),
          tf("fallbackFleetSupercar", "Supercar"),
        ];

  const languagesSpoken =
    company.languagesSpoken && company.languagesSpoken.length > 0
      ? company.languagesSpoken
      : [
          tf("fallbackLanguageEnglish", "English"),
          tf("fallbackLanguageArabic", "Arabic"),
          tf("fallbackLanguageUrdu", "Urdu"),
          tf("fallbackLanguageFrench", "French"),
        ];

  const aboutDealer =
    company.aboutDealer?.trim() ||
    (t.has("fallbackAboutDealer")
      ? t("fallbackAboutDealer", { name: company.name, city: cityName })
      : `Discover luxury and comfort with ${company.name}, your premier choice for car rentals in ${cityName}.`);

  const cleanPhone = company.phone?.replace(/[^\d+]/g, "") ?? "";
  const cleanWhatsapp = company.whatsapp?.replace(/\D/g, "") ?? "";

  return (
    <section className="w-full border-b border-border-subtle bg-background-secondary/70 py-6 sm:py-8">
      <LayoutWrapper>
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-start sm:gap-6">
          {/* Left: Title, Subtitle & Check Highlights */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] font-semibold leading-[1.25] tracking-tight text-text-primary sm:text-[28px] lg:text-[32px]">
              {pageTitle}
            </h1>

            <p className="text-[14px] font-normal leading-[1.5] text-text-secondary sm:text-[15px]">
              {pageSubtitle}
            </p>

            <ul className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-normal text-text-secondary sm:text-[14px]">
              {highlights.map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check
                    className="size-4 shrink-0 text-text-secondary"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: "View more detail" button -> opens DealerInfoDrawer */}
          <div className="shrink-0">
            <DealerInfoDrawer
              triggerVariant="outline-pill"
              labels={{
                triggerLabel: tf("viewMoreDetail", "View more detail"),
                drawerTitle: tf("dealerInfoTitle", "Dealer Information"),
                branchInCityTitle: t.has("branchInCity")
                  ? t("branchInCity", { city: cityName })
                  : `Branch in ${cityName}`,
                viewMoreDetail: tf("viewMoreDetail", "View more detail"),
                branchLocationsTitle: tf("branchLocations", "Branch Locations"),
                shopTimingsTitle: tf("shopTimings", "Shop Timings"),
                deliveryPickupTitle: tf(
                  "deliveryPickupServices",
                  "Delivery & Pick-up Services",
                ),
                branchPickupLabel: tf("branchPickup", "Branch Pick-up"),
                deliveryToYouLabel: tf("deliveryToYou", "Delivery to You"),
                airportDeliveryLabel: tf("airport", "Airport delivery"),
                fastDeliveryLocationsTitle: tf(
                  "fastDeliveryLocations",
                  "Fast Delivery Locations",
                ),
                carFleetTitle: tf("carFleet", "Car Fleet"),
                goodToKnowTitle: tf("goodToKnow", "Good to know"),
                languagesSpokenTitle: tf("languagesSpoken", "Languages Spoken"),
                aboutDealerTitle: t.has("aboutDealer")
                  ? t("aboutDealer", { name: company.name })
                  : `About ${company.name}`,
                callLabel: tf("call", "Call"),
                whatsappLabel: tf("whatsapp", "WhatsApp"),
                closeLabel: tf("close", "Close"),
              }}
              supplierName={company.name}
              locationLabel={locationLabel}
              mapPreviewImage={company.mapPreviewImage}
              branchLocations={branchLocations}
              schedule={schedule}
              branchPickup={company.branchPickup ?? true}
              deliveryToYou={company.deliveryToYou ?? true}
              airportDelivery={company.airportDelivery ?? true}
              fastDeliveryLocations={fastDeliveryLocations}
              carFleet={carFleet}
              languagesSpoken={languagesSpoken}
              aboutDealer={aboutDealer}
              phoneHref={cleanPhone ? `tel:${cleanPhone}` : undefined}
              whatsappHref={
                cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}` : undefined
              }
              hasPhone={cleanPhone.length > 0}
              hasWhatsapp={cleanWhatsapp.length > 0}
            />
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
