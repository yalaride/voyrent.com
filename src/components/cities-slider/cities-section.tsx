"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

export interface PopularCityItem {
  slug: string;
  name: string;
  href: string;
  image?: string;
  carCount?: number;
}

interface PopularCitiesSliderProps {
  countryName: string;
  cities: PopularCityItem[];
  /** Optional fallback subtitle when carCount is not provided */
  fallbackSubtitle?: string;
}

const DEFAULT_CARD_WIDTH = 311;
const CARD_GAP = 12;

export function PopularCitiesSlider({
  countryName,
  cities,
  fallbackSubtitle,
}: PopularCitiesSliderProps) {
  const t = useTranslations("Cities");
  const headingId = useId();
  const trackRef = useRef<HTMLUListElement>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const currentScroll = Math.abs(el.scrollLeft);

    setCanScrollPrev(currentScroll > 2);
    setCanScrollNext(maxScroll > 2 && currentScroll < maxScroll - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    updateScrollButtons();

    if (!el) return;

    const observer = new ResizeObserver(() => updateScrollButtons());
    observer.observe(el);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [cities.length, updateScrollButtons]);

  if (cities.length === 0) {
    return null;
  }

  const handleScroll = (direction: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;

    const firstCard = el.querySelector("li");
    const cardWidth = firstCard ? firstCard.offsetWidth : DEFAULT_CARD_WIDTH;
    const isRtl = getComputedStyle(el).direction === "rtl";
    const step = cardWidth + CARD_GAP;
    const delta = (direction === "next" ? 1 : -1) * (isRtl ? -step : step);

    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <LayoutWrapper>
      <section aria-labelledby={headingId} className="mt-10">
        {/* Header Row: max-w 1280, min-h 43px, justify-between */}
        <div className="flex min-h-[43px] items-center justify-between gap-4">
          <h2
            id={headingId}
            className="text-2xl font-semibold tracking-tight text-text-primary sm:text-[28px] sm:leading-[1.26] sm:tracking-[-0.02em]"
          >
            {t("sliderTitle", { country: countryName })}
          </h2>

          {/* Slider Controls: 40x40 circular buttons, gap 6px, 1px border */}
          <div className="flex shrink-0 items-center gap-[6px]">
            <button
              type="button"
              onClick={() => handleScroll("prev")}
              disabled={!canScrollPrev}
              aria-label={t("previousSlide")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-background-primary text-text-primary transition-colors hover:border-text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeftIcon className="h-4 w-4 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("next")}
              disabled={!canScrollNext}
              aria-label={t("nextSlide")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-background-primary text-text-primary transition-colors hover:border-text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRightIcon className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Slider Track: height 200px, gap 12px */}
        <ul
          ref={trackRef}
          onScroll={updateScrollButtons}
          className="mt-4 flex h-[200px] gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cities.map((city) => (
            <li
              key={city.slug}
              className="h-[200px] w-[280px] shrink-0 snap-start sm:w-[311px]"
            >
              <Link
                href={city.href}
                className="group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-2xl bg-neutral-900 p-5"
              >
                {city.image ? (
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    sizes="(max-width: 640px) 280px, 311px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}

                {/* Gradient overlay: 180deg, transparent 50% -> #000000 100% */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_50%,#000000_100%)]"
                />

                {/* Card Text Block: 271px inner width, 49px height */}
                <div className="relative z-10 flex w-full max-w-[271px] flex-col gap-0">
                  <span className="truncate text-[20px] font-semibold leading-[1.26] tracking-[-0.02em] text-[var(--Text-Inverse,#FFFFFF)]">
                    {city.name}
                  </span>
                  <span className="truncate text-[16px] font-normal leading-[1.5] tracking-[0] text-[var(--Text-Inverse,#FFFFFF)]">
                    {typeof city.carCount === "number"
                      ? t("carsAvailable", { count: city.carCount })
                      : (fallbackSubtitle ?? countryName)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </LayoutWrapper>
  );
}
