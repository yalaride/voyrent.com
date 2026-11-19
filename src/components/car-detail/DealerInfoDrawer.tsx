"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Check, ChevronDown, ChevronUp, MapPin, X } from "lucide-react";

import type { OpeningHourRow } from "@/components/car-detail/dealer-opening-hours";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

function useIsClient() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function DrawerAccordionSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = React.useState(defaultOpen);

  return (
    <section className="border-b border-border-subtle last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-5 py-[var(--spacing-space-12)] text-start text-[16px] font-medium leading-[1.5] text-text-primary transition-colors hover:text-primary"
      >
        <span>{title}</span>
        {expanded ? (
          <ChevronUp className="size-5 shrink-0 text-text-primary" />
        ) : (
          <ChevronDown className="size-5 shrink-0 text-text-primary" />
        )}
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-4 pt-1">{children}</div>
        </div>
      </div>
    </section>
  );
}

export type DealerDrawerLabels = {
  triggerLabel: string;
  drawerTitle: string;
  branchInCityTitle: string;
  viewMoreDetail: string;
  branchLocationsTitle: string;
  shopTimingsTitle: string;
  deliveryPickupTitle: string;
  branchPickupLabel: string;
  deliveryToYouLabel: string;
  airportDeliveryLabel: string;
  fastDeliveryLocationsTitle: string;
  carFleetTitle: string;
  goodToKnowTitle: string;
  languagesSpokenTitle: string;
  aboutDealerTitle: string;
  callLabel: string;
  whatsappLabel: string;
  closeLabel?: string;
};

export function DealerInfoDrawer({
  labels,
  supplierName,
  locationLabel,
  mapPreviewImage,
  branchLocations = [],
  schedule,
  branchPickup = false,
  deliveryToYou = false,
  airportDelivery = false,
  fastDeliveryLocations = [],
  carFleet = [],
  languagesSpoken = [],
  aboutDealer,
  phoneHref,
  whatsappHref,
  hasWhatsapp,
}: {
  labels: DealerDrawerLabels;
  supplierName: string;
  locationLabel: string;
  mapPreviewImage?: string;
  branchLocations?: string[];
  schedule: OpeningHourRow[];
  branchPickup?: boolean;
  deliveryToYou?: boolean;
  airportDelivery?: boolean;
  fastDeliveryLocations?: string[];
  carFleet?: string[];
  languagesSpoken?: string[];
  aboutDealer?: string;
  phoneHref: string;
  whatsappHref: string;
  hasWhatsapp: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const isClient = useIsClient();
  const todayIndex = isClient ? new Date().getDay() : -1;

  React.useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const deliveryServices = [
    ...(branchPickup ? [labels.branchPickupLabel] : []),
    ...(deliveryToYou ? [labels.deliveryToYouLabel] : []),
    ...(airportDelivery ? [labels.airportDeliveryLabel] : []),
  ];

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${supplierName} ${locationLabel}`,
  )}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer items-center gap-2 text-[15px] font-medium text-text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
      >
        <MapPin className="size-4 shrink-0" />
        <span>{labels.triggerLabel}</span>
      </button>

      {isClient
        ? createPortal(
            <div
              aria-hidden={!open}
              className={`fixed inset-0 z-[75] transition-visibility duration-300 ${
                open
                  ? "pointer-events-auto visible"
                  : "pointer-events-none invisible"
              }`}
            >
              {/* Backdrop */}
              <div
                onClick={() => setOpen(false)}
                className={`fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
                  open ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Right-side Slide Drawer */}
              <aside
                role="dialog"
                aria-modal="true"
                aria-label={labels.drawerTitle}
                inert={!open}
                className={`fixed inset-y-0 end-0 z-[76] flex w-full max-w-[480px] flex-col bg-background-primary shadow-2xl transition-transform duration-300 ease-out ${
                  open
                    ? "translate-x-0"
                    : "translate-x-full rtl:-translate-x-full"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
                  <h2 className="text-[16px] font-medium leading-[1.5] text-text-primary">
                    {labels.drawerTitle}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={labels.closeLabel ?? "Close"}
                    className="inline-flex size-6 cursor-pointer items-center justify-center rounded-[var(--radius-4)] text-primary transition-opacity hover:opacity-75"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Scrollable Body */}
                <div className="filter-scrollbar flex-1 overflow-y-auto px-6 py-2">
                  {/* 1. Branch in {City} + Map Preview */}
                  <DrawerAccordionSection title={labels.branchInCityTitle}>
                    <div className="flex flex-col gap-3">
                      <div className="relative flex h-[176px] w-full items-center justify-center overflow-hidden rounded-[var(--radius-16)] border border-border-subtle bg-background-secondary">
                        {mapPreviewImage ? (
                          <Image
                            src={mapPreviewImage}
                            alt={locationLabel}
                            fill
                            sizes="432px"
                            className="object-cover"
                          />
                        ) : (
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60"
                          />
                        )}

                        <a
                          href={mapsSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 inline-flex items-center gap-2 rounded-full bg-background-primary px-4 py-2 text-[14px] font-medium text-text-primary shadow-[var(--shadow-medium)] transition-transform hover:scale-[1.02]"
                        >
                          <MapPin className="size-4 shrink-0 text-text-primary" />
                          <span>{labels.viewMoreDetail}</span>
                        </a>
                      </div>

                      <div className="flex items-start gap-2 text-[14px] leading-[1.5] text-text-secondary">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-text-secondary" />
                        <span>{locationLabel}</span>
                      </div>
                    </div>
                  </DrawerAccordionSection>

                  {/* 2. Branch Locations */}
                  {branchLocations.length > 0 ? (
                    <DrawerAccordionSection title={labels.branchLocationsTitle}>
                      <ul className="list-disc space-y-2 ps-5 text-[14px] leading-[1.5] text-text-primary">
                        {branchLocations.map((branch, idx) => (
                          <li key={`${branch}-${idx}`}>{branch}</li>
                        ))}
                      </ul>
                    </DrawerAccordionSection>
                  ) : null}

                  {/* 3. Shop Timings */}
                  <DrawerAccordionSection title={labels.shopTimingsTitle}>
                    <dl className="flex flex-col gap-2.5 text-[14px] leading-[1.5]">
                      {schedule.map((row) => {
                        const isToday = row.dayIndex === todayIndex;
                        return (
                          <div
                            key={row.dayIndex}
                            className={`flex items-center justify-between gap-4 ${
                              isToday
                                ? "font-semibold text-text-primary"
                                : "font-normal text-text-secondary"
                            }`}
                          >
                            <dt>{row.label}</dt>
                            <dd className="tabular-nums">{row.hours}</dd>
                          </div>
                        );
                      })}
                    </dl>
                  </DrawerAccordionSection>

                  {/* 4. Delivery & Pick-up Services */}
                  {deliveryServices.length > 0 ||
                  fastDeliveryLocations.length > 0 ? (
                    <DrawerAccordionSection title={labels.deliveryPickupTitle}>
                      <div className="flex flex-col gap-4">
                        {deliveryServices.length > 0 ? (
                          <ul className="flex flex-col gap-2">
                            {deliveryServices.map((service) => (
                              <li
                                key={service}
                                className="inline-flex items-center gap-2 text-[14px] font-medium text-primary"
                              >
                                <Check className="size-4 shrink-0" />
                                <span>{service}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        {fastDeliveryLocations.length > 0 ? (
                          <div className="flex flex-col gap-2.5">
                            <p className="text-[14px] font-normal text-text-secondary">
                              {labels.fastDeliveryLocationsTitle}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {fastDeliveryLocations.map((loc, idx) => (
                                <span
                                  key={`${loc}-${idx}`}
                                  className="inline-flex items-center rounded-full border border-border-default bg-background-primary px-3.5 py-1.5 text-[13px] font-medium text-text-primary"
                                >
                                  {loc}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </DrawerAccordionSection>
                  ) : null}

                  {/* 5. Car Fleet */}
                  {carFleet.length > 0 ? (
                    <DrawerAccordionSection title={labels.carFleetTitle}>
                      <div className="flex flex-wrap gap-2">
                        {carFleet.map((item, idx) => (
                          <span
                            key={`${item}-${idx}`}
                            className="inline-flex items-center rounded-full border border-border-default bg-background-primary px-3.5 py-1.5 text-[13px] font-medium text-text-primary"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </DrawerAccordionSection>
                  ) : null}

                  {/* 6. Good to know (Languages Spoken) */}
                  {languagesSpoken.length > 0 ? (
                    <DrawerAccordionSection title={labels.goodToKnowTitle}>
                      <div className="flex flex-col gap-2.5">
                        <p className="text-[14px] font-normal text-text-secondary">
                          {labels.languagesSpokenTitle}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {languagesSpoken.map((lang, idx) => (
                            <span
                              key={`${lang}-${idx}`}
                              className="inline-flex items-center rounded-full border border-border-default bg-background-primary px-3.5 py-1.5 text-[13px] font-medium text-text-primary"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </DrawerAccordionSection>
                  ) : null}

                  {/* 7. About {Dealer} */}
                  {aboutDealer ? (
                    <DrawerAccordionSection title={labels.aboutDealerTitle}>
                      <p className="text-[14px] leading-[1.6] text-text-secondary">
                        {aboutDealer}
                      </p>
                    </DrawerAccordionSection>
                  ) : null}
                </div>

                {/* Sticky Footer Actions */}
                <div className="grid grid-cols-2 gap-3 border-t border-border-subtle bg-background-primary px-6 py-4">
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
                      <span>{labels.callLabel}</span>
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="whatsapp-solid"
                    size="lg"
                    className="w-full rounded-full px-4 no-underline"
                  >
                    <a
                      href={whatsappHref}
                      target={hasWhatsapp ? "_blank" : undefined}
                      rel={hasWhatsapp ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!hasWhatsapp) e.preventDefault();
                      }}
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
                      <span>{labels.whatsappLabel}</span>
                    </a>
                  </Button>
                </div>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
