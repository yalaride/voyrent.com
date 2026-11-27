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

export type ListingSliderVariant = "default" | "search" | "related";

interface ListingSliderProps {
  cards: ListingCardModel[];
  heading: string;
  subtitle: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  emptyTitle: string;
  emptyBody: string;
  variant?: ListingSliderVariant;
  desktopColumns?: 3 | 4;
  showHeader?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  scrollBy?: "page" | "card";
}

const CARD_GAP_PX = 16; // matches Tailwind gap-4

export function ListingSlider({
  cards,
  heading,
  subtitle,
  viewAllHref,
  viewAllLabel,
  emptyTitle,
  emptyBody,
  variant = "default",
  desktopColumns = 4,
  showHeader = true,
  autoPlay = false,
  autoPlayInterval = 3500,
  scrollBy,
}: ListingSliderProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [activeDot, setActiveDot] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(1);
  const [isPaused, setIsPaused] = React.useState(false);

  const isLanding = variant === "default";
  const resolvedScrollBy = scrollBy ?? (variant === "search" ? "card" : "page");

  const getMetrics = React.useCallback(
    (el: HTMLDivElement) => {
      const firstCard = el.firstElementChild as HTMLElement | null;
      const cardWidth = firstCard ? firstCard.offsetWidth : el.clientWidth;
      const cardStep = cardWidth + CARD_GAP_PX;
      const visibleCount = Math.max(
        1,
        Math.round((el.clientWidth + CARD_GAP_PX) / cardStep),
      );
      const pageStep = visibleCount * cardStep;
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      const totalPages = Math.max(1, Math.ceil(cards.length / visibleCount));

      return { cardStep, pageStep, maxScroll, totalPages };
    },
    [cards.length],
  );

  const syncScrollState = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { pageStep, maxScroll, totalPages } = getMetrics(el);
    const absScrollLeft = Math.abs(el.scrollLeft);

    setCanScrollLeft(absScrollLeft > 4);
    setCanScrollRight(absScrollLeft < maxScroll - 4);
    setPageCount(totalPages);

    if (maxScroll <= 4 || totalPages <= 1) {
      setActiveDot(0);
      return;
    }

    if (absScrollLeft >= maxScroll - 4) {
      setActiveDot(totalPages - 1);
      return;
    }

    const currentPage = Math.round(absScrollLeft / pageStep);
    setActiveDot(Math.min(totalPages - 1, Math.max(0, currentPage)));
  }, [getMetrics]);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(syncScrollState)
        : null;
    observer?.observe(el);

    return () => {
      el.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
      observer?.disconnect();
    };
  }, [syncScrollState]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { cardStep, pageStep } = getMetrics(el);
    const step = resolvedScrollBy === "page" ? pageStep : cardStep;
    const isRtl = getComputedStyle(el).direction === "rtl";
    const sign = isRtl ? -1 : 1;

    el.scrollBy({
      left: (direction === "left" ? -step : step) * sign,
      behavior: "smooth",
    });
  };

  const handleDotClick = React.useCallback(
    (pageIndex: number) => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const { pageStep, maxScroll } = getMetrics(el);
      const isRtl = getComputedStyle(el).direction === "rtl";
      const targetScroll = Math.min(pageIndex * pageStep, maxScroll);

      el.scrollTo({
        left: isRtl ? -targetScroll : targetScroll,
        behavior: "smooth",
      });
    },
    [getMetrics],
  );

  React.useEffect(() => {
    if (!autoPlay || isPaused || cards.length <= 1) return;

    const timer = window.setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const { cardStep, pageStep, maxScroll } = getMetrics(el);
      if (maxScroll <= 4) return;

      const isRtl = getComputedStyle(el).direction === "rtl";
      const absScrollLeft = Math.abs(el.scrollLeft);

      if (absScrollLeft >= maxScroll - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const step = resolvedScrollBy === "page" ? pageStep : cardStep;
        el.scrollBy({
          left: (isRtl ? -1 : 1) * step,
          behavior: "smooth",
        });
      }
    }, autoPlayInterval);

    return () => window.clearInterval(timer);
  }, [
    autoPlay,
    autoPlayInterval,
    isPaused,
    cards.length,
    getMetrics,
    resolvedScrollBy,
  ]);

  // Landing mobile shows 1 card + partial 2nd card peek; sm+ uses exact widths with zero cutoffs
  const mobileCardWidth = isLanding ? "w-[82%]" : "w-full";
  const cardWidthClass =
    desktopColumns === 3
      ? `${mobileCardWidth} min-w-0 shrink-0 snap-start sm:w-[calc((100%-16px)/2)] xl:w-[calc((100%-32px)/3)]`
      : `${mobileCardWidth} min-w-0 shrink-0 snap-start sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-32px)/3)] xl:w-[calc((100%-48px)/4)]`;
  const hasOverflow = canScrollLeft || canScrollRight;

  const shopButton =
    viewAllHref && viewAllLabel ? (
      <Button
        asChild
        variant="outline"
        className="h-10 min-w-[107px] gap-2 rounded-full border border-[#0B7AD3] bg-transparent py-0 pe-3 ps-4 text-sm font-medium text-[#0B7AD3] shadow-none transition-colors hover:bg-[#0B7AD3]/10"
      >
        <Link href={viewAllHref}>
          <span className="truncate">{viewAllLabel}</span>
          <ArrowRightIcon className="size-4 shrink-0 rtl:rotate-180" />
        </Link>
      </Button>
    ) : null;

  return (
    <div
      className="w-full"
      onMouseEnter={autoPlay ? () => setIsPaused(true) : undefined}
      onMouseLeave={autoPlay ? () => setIsPaused(false) : undefined}
      onFocusCapture={autoPlay ? () => setIsPaused(true) : undefined}
      onBlurCapture={autoPlay ? () => setIsPaused(false) : undefined}
    >
      {showHeader ? (
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex max-w-[601px] flex-col gap-2">
            <h2
              className={
                isLanding
                  ? "text-[24px] font-semibold leading-[120%] tracking-[-0.02em] text-text-primary md:text-[28px]"
                  : "text-[28px] font-semibold leading-[120%] tracking-[-0.02em] text-text-primary md:text-[36px]"
              }
            >
              {heading}
            </h2>
            <p
              className={
                isLanding
                  ? "text-[16px] leading-[150%] text-text-secondary"
                  : "text-sm leading-[150%] text-text-secondary md:text-base"
              }
            >
              {subtitle}
            </p>
          </div>
          {showHeader && isLanding && shopButton ? (
            <div className="flex md:hidden">{shopButton}</div>
          ) : null}

          <div
            className={`${isLanding ? "hidden md:flex" : "flex"} items-center gap-4 self-start md:self-end`}
          >
            <div
              className={`${isLanding ? "hidden lg:flex" : "flex"} items-center gap-2`}
            >
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

            {shopButton}
          </div>
        </div>
      ) : null}

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
              <div key={listing.id ?? listing.href} className={cardWidthClass}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>

          {hasOverflow && pageCount > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, index) => {
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
          ) : null}
        </>
      )}
    </div>
  );
}

export default ListingSlider;
