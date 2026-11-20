"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";

const emptySubscribe = () => () => {};

function useIsClient() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export type PaymentModeKey = "crypto" | "cash" | "credit" | "debit";

export type PaymentModesLabels = {
  title: string;
  closeLabel?: string;
  crypto: { title: string; description: string };
  cash: { title: string; description: string };
  credit: { title: string; description: string };
  debit: { title: string; description: string };
  tipPrefix: string;
  tipBody: string;
  tipSuffix: string;
  depositNote: string;
};

const PAYMENT_MODE_ICONS: Record<PaymentModeKey, string> = {
  crypto: "/payment-modes/bit.png",
  cash: "/payment-modes/cash.png",
  credit: "/payment-modes/credit.png",
  debit: "/payment-modes/debit.png",
};

export function normalizePaymentModeKey(value: string): PaymentModeKey | null {
  const normalized = value.trim().toLowerCase();
  if (
    normalized.includes("crypto") ||
    normalized.includes("bit") ||
    normalized.includes("btc")
  ) {
    return "crypto";
  }
  if (normalized.includes("cash")) {
    return "cash";
  }
  if (normalized.includes("credit")) {
    return "credit";
  }
  if (normalized.includes("debit")) {
    return "debit";
  }
  return null;
}

export function resolvePaymentModeKeys(
  paymentModes: string[],
): PaymentModeKey[] {
  const keys: PaymentModeKey[] = [];
  for (const mode of paymentModes) {
    const key = normalizePaymentModeKey(mode);
    if (key && !keys.includes(key)) {
      keys.push(key);
    }
  }
  return keys;
}

export function PaymentModesDrawer({
  open,
  onClose,
  labels,
  paymentModes = [],
  lockScroll = true,
}: {
  open: boolean;
  onClose: () => void;
  labels: PaymentModesLabels;
  paymentModes?: string[];
  lockScroll?: boolean;
}) {
  const isClient = useIsClient();

  const resolvedPaymentModes = React.useMemo(
    () => resolvePaymentModeKeys(paymentModes),
    [paymentModes],
  );

  React.useEffect(() => {
    if (!open) return;

    const prevOverflow = lockScroll ? document.body.style.overflow : null;
    if (lockScroll) {
      document.body.style.overflow = "hidden";
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      if (lockScroll && prevOverflow !== null) {
        document.body.style.overflow = prevOverflow;
      }
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, lockScroll]);

  if (!isClient) return null;

  return createPortal(
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[80] transition-[visibility] duration-300 ${
        open ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ease-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Left-side Slide Drawer (Equal Size: max-w-[440px]) */}
      {/* Right-side Slide Drawer (Equal Size: max-w-[440px]) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
        inert={!open}
        className={`fixed inset-y-0 end-0 z-[81] flex w-full max-w-[440px] flex-col bg-background-primary shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <h2 className="text-[16px] font-medium leading-[1.5] text-text-primary">
            {labels.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.closeLabel ?? "Close"}
            className="inline-flex size-6 cursor-pointer items-center justify-center rounded-[var(--radius-4)] text-primary transition-opacity hover:opacity-75"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="filter-scrollbar flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-3.5">
            {resolvedPaymentModes.map((modeKey) => {
              const modeText = labels[modeKey];
              const iconSrc = PAYMENT_MODE_ICONS[modeKey];

              return (
                <div
                  key={modeKey}
                  className="flex items-start gap-3.5 rounded-[var(--radius-12)] border border-border-default bg-background-primary p-4"
                >
                  <div className="relative mt-0.5 size-8 shrink-0">
                    <Image
                      src={iconSrc}
                      alt={modeText.title}
                      fill
                      sizes="32px"
                      className="object-contain"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-[15px] font-medium leading-[1.35] text-text-primary">
                      {modeText.title}
                    </h3>
                    <p className="text-[13px] leading-[1.45] text-text-secondary">
                      {modeText.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tip & Deposit Notes */}
          <div className="mt-6 flex flex-col gap-4 text-[13.5px] leading-[1.55] text-text-secondary">
            <p>
              <span className="font-medium text-text-primary">
                {labels.tipPrefix}
              </span>{" "}
              {labels.tipBody}{" "}
              <span className="font-medium text-text-primary">
                {labels.tipSuffix}
              </span>
            </p>

            <p>{labels.depositNote}</p>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
