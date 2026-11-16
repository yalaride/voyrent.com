"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";

import LayoutWrapper from "@/components/layout/LayoutWrapper";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

function FaqCard({
  item,
  idx,
  isOpen,
  baseId,
  onToggle,
}: {
  item: FaqItem;
  idx: number;
  isOpen: boolean;
  baseId: string;
  onToggle: (idx: number) => void;
}) {
  const buttonId = `${baseId}-btn-${idx}`;
  const panelId = `${baseId}-panel-${idx}`;

  return (
    <div className="rounded-[var(--radius-12)] border border-border-default bg-background-primary p-[var(--spacing-space-24)]">
      <button
        id={buttonId}
        type="button"
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={() => onToggle(idx)}
        className="flex w-full items-center justify-between gap-4 text-start"
      >
        <span className="min-w-0 flex-1 text-base font-medium leading-6 text-text-primary sm:text-lg sm:leading-7">
          {item.question}
        </span>
        <span
          aria-hidden="true"
          className="relative inline-flex size-5 shrink-0 items-center justify-center text-text-primary"
        >
          <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
          <span
            className={`absolute h-3.5 w-0.5 rounded-full bg-current transition-transform duration-200 ${
              isOpen ? "scale-y-0" : "scale-y-100"
            }`}
          />
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pt-[var(--spacing-space-12)] text-sm font-normal leading-6 text-text-secondary sm:text-base">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LandingFaqSection({ items }: { items?: FaqItem[] }) {
  const t = useTranslations("Faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  const faqs: FaqItem[] =
    items && items.length > 0
      ? items
      : FAQ_KEYS.map((key) => ({
          id: key,
          question: t(`items.${key}.question`),
          answer: t(`items.${key}.answer`),
        }));

  const splitAt = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, splitAt);
  const rightColumn = faqs.slice(splitAt);

  const toggle = (idx: number) =>
    setOpenIndex((prev) => (prev === idx ? null : idx));

  return (
    <section
      className="bg-background-primary py-12 sm:py-16 lg:py-[var(--spacing-space-80)]"
      aria-labelledby={`${baseId}-title`}
    >
      <LayoutWrapper>
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10 lg:mb-12">
          <h2
            id={`${baseId}-title`}
            className="text-3xl font-semibold leading-[1.2] tracking-[-0.02em] text-text-primary sm:text-[40px]"
          >
            {t("title")}
          </h2>
          <p className="mt-3 text-sm font-normal leading-[1.5] text-text-secondary sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-[var(--spacing-space-12)] lg:grid-cols-2 lg:gap-x-[var(--spacing-space-24)]">
          {[leftColumn, rightColumn].map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="flex flex-col gap-[var(--spacing-space-12)]"
            >
              {column.map((item, columnItemIndex) => {
                const idx =
                  columnIndex === 0
                    ? columnItemIndex
                    : splitAt + columnItemIndex;

                return (
                  <FaqCard
                    key={item.id}
                    item={item}
                    idx={idx}
                    isOpen={openIndex === idx}
                    baseId={baseId}
                    onToggle={toggle}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </LayoutWrapper>
    </section>
  );
}
