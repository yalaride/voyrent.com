"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons/index";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const RENTING_STEPS = [
  { id: "searchCompare", imageSrc: "/marketplace/image-1.png" },
  { id: "chooseCar", imageSrc: "/marketplace/image-2.png" },
  { id: "contactBook", imageSrc: "/marketplace/image-3.png" },
] as const;

export function RentingStepsSection() {
  const t = useTranslations("RentingSteps");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollPrev(el.scrollLeft > 2);
    setCanScrollNext(el.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  const handleScroll = (direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "next" ? 432 : -432,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-background-primary pt-[var(--spacing-space-40)] pb-[var(--spacing-space-40)] lg:pb-[var(--spacing-space-80)]">
      <LayoutWrapper>
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-[var(--spacing-space-30)] md:gap-[var(--spacing-space-40)] lg:gap-[60px]">
          <h2 className="w-full text-center text-[length:var(--text-h1)] leading-[1.16] font-semibold tracking-[-0.02em] text-text-primary md:text-[length:var(--text-title)] lg:text-[3rem]">
            {t("title")}
          </h2>

          <div className="w-full">
            <div
              ref={scrollRef}
              onScroll={updateScrollState}
              className="flex w-full flex-col gap-[var(--spacing-space-16)] md:flex-row md:snap-x md:snap-mandatory md:overflow-x-auto md:scroll-smooth md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:overflow-visible"
            >
              {RENTING_STEPS.map(({ id, imageSrc }) => (
                <article
                  key={id}
                  className="flex w-full flex-col gap-0 overflow-hidden rounded-[var(--radius-24)] border border-border-subtle bg-background-primary md:w-[416px] md:shrink-0 md:snap-start lg:min-h-[431px] lg:w-full"
                >
                  <div className="relative aspect-[414/257] w-full shrink-0 overflow-hidden bg-background-secondary">
                    <Image
                      src={imageSrc}
                      alt={t(`steps.${id}.imageAlt`)}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 416px, 33vw"
                      className="object-contain object-center"
                    />
                  </div>

                  <div className="flex flex-1 flex-col items-start gap-[var(--spacing-space-8)] px-[var(--spacing-space-20)] pt-[var(--spacing-space-20)] pb-[var(--spacing-space-24)] text-start">
                    <h3 className="w-full text-[length:var(--text-h3)] leading-[1.26] font-semibold tracking-[-0.02em] text-text-primary">
                      {t(`steps.${id}.title`)}
                    </h3>
                    <p className="w-full text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal text-text-secondary">
                      {t(`steps.${id}.description`)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Tablet-only carousel buttons */}
            <div className="mt-[var(--spacing-space-24)] hidden items-center justify-center gap-[var(--spacing-space-12)] md:flex lg:hidden">
              <button
                type="button"
                onClick={() => handleScroll("prev")}
                disabled={!canScrollPrev}
                aria-label={t("previousSlide")}
                className="flex h-[var(--spacing-dim-40)] w-[var(--spacing-dim-40)] items-center justify-center rounded-full border border-border-subtle bg-background-primary text-text-primary transition-colors hover:bg-background-secondary disabled:cursor-not-allowed disabled:text-text-disabled disabled:hover:bg-background-primary"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("next")}
                disabled={!canScrollNext}
                aria-label={t("nextSlide")}
                className="flex h-[var(--spacing-dim-40)] w-[var(--spacing-dim-40)] items-center justify-center rounded-full border border-border-subtle bg-background-primary text-text-primary transition-colors hover:bg-background-secondary disabled:cursor-not-allowed disabled:text-text-disabled disabled:hover:bg-background-primary"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}
