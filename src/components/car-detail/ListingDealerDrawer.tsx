"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowRight, MapPin, X } from "lucide-react";

import { Link } from "@/i18n/navigation";
import {
  PaymentModesDrawer,
  resolvePaymentModeKeys,
  type PaymentModesLabels,
} from "./payment-modes";

const emptySubscribe = () => () => {};

function useIsClient() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export type ListingDealerDrawerLabels = {
  triggerLabel: string;
  drawerTitle: string;
  viewMoreDetail: string;
  viewAllCarsByDealer: string;
  carFleetTitle: string;
  listedInTitle: string;
  paymentModesLabel: string;
  paymentModes: PaymentModesLabels;
  closeLabel?: string;
};

export function ListingDealerDrawer({
  labels,
  supplierName,
  locationLabel,
  mapPreviewImage,
  dealerHref,
  carFleet = [],
  listedIn = [],
  paymentModes = [],
}: {
  labels: ListingDealerDrawerLabels;
  supplierName: string;
  locationLabel: string;
  mapPreviewImage?: string;
  dealerHref: string;
  carFleet?: string[];
  listedIn?: string[];
  paymentModes?: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const [paymentsOpen, setPaymentsOpen] = React.useState(false);
  const isClient = useIsClient();

  const hasPaymentModes = React.useMemo(
    () => resolvePaymentModeKeys(paymentModes).length > 0,
    [paymentModes],
  );

  React.useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !paymentsOpen) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, paymentsOpen]);

  const handleCloseAll = () => {
    setPaymentsOpen(false);
    setOpen(false);
  };

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
              className={`fixed inset-0 z-[75] transition-[visibility] duration-300 ${
                open
                  ? "pointer-events-auto visible"
                  : "pointer-events-none invisible"
              }`}
            >
              {/* Backdrop */}
              <div
                onClick={handleCloseAll}
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
                className={`fixed inset-y-0 end-0 z-[76] flex w-full max-w-[440px] flex-col bg-background-primary shadow-2xl transition-transform duration-300 ease-out ${
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
                    onClick={handleCloseAll}
                    aria-label={labels.closeLabel ?? "Close"}
                    className="inline-flex size-6 cursor-pointer items-center justify-center rounded-[var(--radius-4)] text-primary transition-opacity hover:opacity-75"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Scrollable Body */}
                <div className="filter-scrollbar flex-1 overflow-y-auto px-6 py-5">
                  <div className="flex flex-col gap-5">
                    {/* Location + Map Preview */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-[15px] font-medium text-text-primary">
                        <MapPin className="size-4 shrink-0 text-text-primary" />
                        <span>{locationLabel}</span>
                      </div>

                      <div className="relative flex h-[180px] w-full items-center justify-center overflow-hidden rounded-[var(--radius-16)] border border-border-subtle bg-background-secondary">
                        {mapPreviewImage ? (
                          <Image
                            src={mapPreviewImage}
                            alt={locationLabel}
                            fill
                            sizes="392px"
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
                    </div>

                    {/* Outlined Button: View All Cars by this Dealer */}
                    <Link
                      href={dealerHref}
                      onClick={handleCloseAll}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-5 py-2.5 text-[14px] font-medium text-primary no-underline transition-colors hover:bg-primary/5"
                    >
                      <span>{labels.viewAllCarsByDealer}</span>
                      <ArrowRight className="size-4 shrink-0 rtl:rotate-180" />
                    </Link>

                    {/* Car Fleet */}
                    {carFleet.length > 0 ? (
                      <>
                        <hr className="border-t border-border-subtle" />
                        <section className="flex flex-col gap-3">
                          <h3 className="text-[15px] font-medium text-text-primary">
                            {labels.carFleetTitle}
                          </h3>
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
                        </section>
                      </>
                    ) : null}

                    {/* Listed In */}
                    {listedIn.length > 0 ? (
                      <>
                        <hr className="border-t border-border-subtle" />
                        <section className="flex flex-col gap-3">
                          <h3 className="text-[15px] font-medium text-text-primary">
                            {labels.listedInTitle}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {listedIn.map((item, idx) => (
                              <span
                                key={`${item}-${idx}`}
                                className="inline-flex items-center rounded-full border border-border-default bg-background-primary px-3.5 py-1.5 text-[13px] font-medium text-text-primary"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </section>
                      </>
                    ) : null}

                    {/* Payment Modes Button */}
                    {hasPaymentModes ? (
                      <>
                        <hr className="border-t border-border-subtle" />
                        <button
                          type="button"
                          onClick={() => setPaymentsOpen(true)}
                          aria-expanded={paymentsOpen}
                          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-5 py-2.5 text-[14px] font-medium text-primary transition-colors hover:bg-primary/5"
                        >
                          <span>{labels.paymentModesLabel}</span>
                          <ArrowRight className="size-4 shrink-0 rtl:rotate-180" />
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </aside>
            </div>,
            document.body,
          )
        : null}

      {/* Separate Left-Side Payment Modes Drawer */}
      <PaymentModesDrawer
        open={paymentsOpen}
        onClose={() => setPaymentsOpen(false)}
        paymentModes={paymentModes}
        lockScroll={false}
        labels={{
          ...labels.paymentModes,
          closeLabel: labels.paymentModes.closeLabel ?? labels.closeLabel,
        }}
      />
    </>
  );
}
