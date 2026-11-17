"use client";

import * as React from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "@/components/icons";
import {
  ListingCard,
  type ListingCardModel,
} from "@/features/catalog/listing-card";

interface ListingSliderProps {
  cards: ListingCardModel[];
  heading: string;
  subtitle: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  emptyTitle: string;
  emptyBody: string;
  variant?: "default" | "search";
  showHeader?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const TOTAL_DOTS = 4;

export function ListingSlider({
  cards,
  heading,
  subtitle,
  viewAllHref,
  viewAllLabel,
  emptyTitle,
  emptyBody,
  variant = "default",
  showHeader = true,
  autoPlay = false,
  autoPlayInterval = 3500,
}: ListingSliderProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [activeDot, setActiveDot] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const checkScrollState = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;

    const maxScroll = Math.max(0, scrollWidth - clientWidth);
    const absScrollLeft = Math.abs(scrollLeft);

    setCanScrollLeft(absScrollLeft > 4);
    setCanScrollRight(absScrollLeft < maxScroll - 4);

    if (maxScroll > 0) {
      const progress = absScrollLeft / maxScroll;
      const index = Math.min(
        TOTAL_DOTS - 1,
        Math.max(0, Math.round(progress * (TOTAL_DOTS - 1))),
      );
      setActiveDot(index);
    } else {
      setActiveDot(0);
    }
  }, []);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener("scroll", checkScrollState, { passive: true });
    window.addEventListener("resize", checkScrollState);
    return () => {
      el.removeEventListener("scroll", checkScrollState);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [checkScrollState, cards.length]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const firstCard = el.firstElementChild as HTMLElement | null;
    const scrollAmount = firstCard ? firstCard.offsetWidth + 16 : 324;
    const isRtl = getComputedStyle(el).direction === "rtl";
    const sign = isRtl ? -1 : 1;

    el.scrollBy({
      left: (direction === "left" ? -scrollAmount : scrollAmount) * sign,
      behavior: "smooth",
    });
  };

  const handleDotClick = React.useCallback((index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const isRtl = getComputedStyle(el).direction === "rtl";
    const targetScroll = (index / (TOTAL_DOTS - 1)) * maxScroll;

    el.scrollTo({
      left: isRtl ? -targetScroll : targetScroll,
      behavior: "smooth",
    });
  }, []);

  // Auto-slide for search page slider (disabled by default on landing page)
  React.useEffect(() => {
    if (!autoPlay || isPaused || cards.length <= 1) return;

    const timer = window.setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      if (maxScroll <= 4) return;

      const isRtl = getComputedStyle(el).direction === "rtl";
      const absScrollLeft = Math.abs(el.scrollLeft);

      if (absScrollLeft >= maxScroll - 8) {
        // Loop back to the first card
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const firstCard = el.firstElementChild as HTMLElement | null;
        const step = firstCard ? firstCard.offsetWidth + 16 : 324;
        el.scrollBy({
          left: (isRtl ? -1 : 1) * step,
          behavior: "smooth",
        });
      }
    }, autoPlayInterval);

    return () => window.clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isPaused, cards.length]);

  const hasOverflow = canScrollLeft || canScrollRight;

  return (
    <div
      className="w-full"
      onMouseEnter={autoPlay ? () => setIsPaused(true) : undefined}
      onMouseLeave={autoPlay ? () => setIsPaused(false) : undefined}
      onFocusCapture={autoPlay ? () => setIsPaused(true) : undefined}
      onBlurCapture={autoPlay ? () => setIsPaused(false) : undefined}
    >
      {/* Header Section (Landing Page only) */}
      {showHeader ? (
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex max-w-[601px] flex-col gap-2">
            <h2 className="text-[28px] font-semibold leading-[120%] tracking-[-0.02em] text-text-primary md:text-[36px]">
              {heading}
            </h2>
            <p className="text-sm leading-[150%] text-text-secondary md:text-base">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4 self-start md:self-end">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!canScrollLeft}
                onClick={() => handleScroll("left")}
                aria-label="Previous listings"
                className="size-10 rounded-full border border-[#CCD0D8] bg-background-primary text-text-primary shadow-none transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeftIcon className="size-4 shrink-0 rtl:rotate-180" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!canScrollRight}
                onClick={() => handleScroll("right")}
                aria-label="Next listings"
                className="size-10 rounded-full border border-[#CCD0D8] bg-background-primary text-text-primary shadow-none transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRightIcon className="size-4 shrink-0 rtl:rotate-180" />
              </Button>
            </div>

            {viewAllHref && viewAllLabel ? (
              <Button
                asChild
                variant="outline"
                className="h-10 w-[107px] min-w-[107px] gap-2 rounded-full border border-[#0B7AD3] bg-transparent py-0 pe-3 ps-4 text-sm font-medium text-[#0B7AD3] shadow-none transition-colors hover:bg-[#0B7AD3]/10"
              >
                <Link href={viewAllHref}>
                  <span className="truncate">{viewAllLabel}</span>
                  <ArrowRightIcon className="size-4 shrink-0 rtl:rotate-180" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Cards List / Slider */}
      {cards.length === 0 ? (
        <div
          className={`${showHeader ? "mt-8" : ""} rounded-2xl border border-dashed border-border-default bg-background-primary px-6 py-12 text-center`}
        >
          <h3 className="text-lg font-semibold text-text-primary">
            {emptyTitle}
          </h3>
          <p className="mt-2 text-sm text-text-secondary">{emptyBody}</p>
        </div>
      ) : (
        <>
          <div
            ref={scrollContainerRef}
            className={`${showHeader ? "mt-8" : "mt-1"} flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 pt-1
                       [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
          >
            {cards.map((listing) => (
              <div
                key={listing.id ?? listing.href}
                className={
                  variant === "search"
                    ? "min-w-0 shrink-0 snap-start w-[min(308px,calc(100vw-48px))] sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)]"
                    : "min-w-0 shrink-0 snap-start w-[min(308px,calc(100vw-48px))] md:w-[calc((100%-32px)/2.5)] xl:w-[308px]"
                }
              >
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>

          {hasOverflow && (
            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: TOTAL_DOTS }).map((_, index) => {
                const isActive = activeDot === index;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDotClick(index)}
                    aria-label={`Go to slide page ${index + 1}`}
                    className={`h-2 transition-all duration-300 focus:outline-none ${
                      isActive
                        ? "w-8 rounded-full bg-[#18181B]"
                        : "w-2 rounded-full bg-[#CCD0D8] hover:bg-neutral-400"
                    }`}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ListingSlider;
