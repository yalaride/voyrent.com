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
}

const TOTAL_DOTS = 4; // 4 dots as shown in Figma Image 1

export function ListingSlider({
  cards,
  heading,
  subtitle,
  viewAllHref,
  viewAllLabel,
  emptyTitle,
  emptyBody,
}: ListingSliderProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [activeDot, setActiveDot] = React.useState(0);

  const checkScrollState = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;

    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);

    // Calculate active pagination dot (0 to TOTAL_DOTS - 1)
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = scrollLeft / maxScroll;
      const index = Math.min(
        TOTAL_DOTS - 1,
        Math.max(0, Math.round(progress * (TOTAL_DOTS - 1))),
      );
      setActiveDot(index);
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
    const scrollAmount = 324; // Card width + gap
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleDotClick = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const targetScroll = (index / (TOTAL_DOTS - 1)) * maxScroll;
    el.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        {/* Left Side: Title & Subtitle */}
        <div className="flex max-w-[601px] flex-col gap-2">
          <h2 className="text-[28px] font-semibold leading-[120%] tracking-[-0.02em] text-text-primary md:text-[36px]">
            {heading}
          </h2>
          <p className="text-sm leading-[150%] text-text-secondary md:text-base">
            {subtitle}
          </p>
        </div>

        {/* Right Side Controls: Figma Spec (width: 211px; height: 40px; gap: 16px) */}
        <div className="flex items-center gap-4 self-start md:self-end">
          {/* Arrow Buttons: [<] [>] */}
          <div className="flex items-center gap-2">
            {/* Previous (<) Button */}
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

            {/* Next (>) Button */}
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

          {/* Shop All Button: 107px x 40px, ps: 16px, pe: 12px, gap: 8px, border: #0B7AD3 */}
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

      {/* Cards List / Slider */}
      {cards.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border-default bg-background-primary  py-12 text-center">
          <h3 className="text-lg font-semibold text-text-primary">
            {emptyTitle}
          </h3>
          <p className="mt-2 text-sm text-text-secondary">{emptyBody}</p>
        </div>
      ) : (
        <>
          <div
            ref={scrollContainerRef}
            className="mt-8 flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth scroll-px-4
                       [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                       -mx-4 px-4 sm:-mx-6 sm:px-6 xl:mx-0 xl:px-0"
          >
            {cards.map((listing) => (
              <div
                key={listing.id ?? listing.href}
                className="shrink-0 snap-start
                           w-[calc((100vw-48px)/1.45)] min-w-[250px] max-w-[280px]
                           md:w-[calc((100%-32px)/2.5)] md:min-w-0 md:max-w-none 
                           xl:w-[308px] xl:max-w-none"
              >
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>

          {/* Slider Pagination Indicator (Image 1: Active pill + dots) */}
          <div className="mt-6 flex items-center justify-center gap-2">
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
        </>
      )}
    </div>
  );
}
