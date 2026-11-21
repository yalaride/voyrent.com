"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { catalogPath } from "@/domain/routing/rent-paths";

export const BRAND_LOGOS: Record<string, string> = {
  audi: "/brands/audi.svg",
  bmw: "/brands/bmw.svg",
  chevrolet: "/brands/chevrolet.svg",
  ford: "/brands/ford.svg",
  gmc: "/brands/icons8-gmc-48 1.svg",
  hyundai: "/brands/hyundai.svg",
  lamborghini: "/brands/lamborghini.svg",
  porsche: "/brands/porsche.svg",
  "rolls-royce": "/brands/rolls-royce.svg",
  tesla: "/brands/tesla.svg",
  volkswagen: "/brands/volkswagen.svg",
};

const COPIES = [0, 1, 2] as const;
const SCROLL_STEP = 280;

export function BrandSlider({
  city,
  brands,
}: {
  city: string;
  brands: { slug: string; name: string }[];
}) {
  const tNav = useTranslations("Listings");
  const locale = useLocale();

  const items = brands.map((brand) => ({
    slug: brand.slug,
    logo: BRAND_LOGOS[brand.slug],
    name: brand.name,
  }));

  return (
    <BrandSliderView
      city={city}
      brands={items}
      isRtl={locale === "ar"}
      prevLabel={tNav("previous")}
      nextLabel={tNav("next")}
    />
  );
}

function BrandSliderView({
  city,
  brands,
  isRtl,
  prevLabel,
  nextLabel,
}: {
  city: string;
  brands: { slug: string; logo?: string; name: string }[];
  isRtl: boolean;
  prevLabel: string;
  nextLabel: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // In RTL, modern browsers use negative scrollLeft values as you scroll left
  const dirSign = isRtl ? -1 : 1;

  const getSetWidth = useCallback(() => {
    const el = scrollRef.current;
    if (!el || brands.length === 0) return 0;

    const first = el.children[0] as HTMLElement | undefined;
    const secondSetFirst = el.children[brands.length] as
      | HTMLElement
      | undefined;
    if (!first || !secondSetFirst) return 0;

    return Math.abs(secondSetFirst.offsetLeft - first.offsetLeft);
  }, [brands.length]);

  // Start positioned at the beginning of the middle copy so both directions loop seamlessly
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const setWidth = getSetWidth();
    if (setWidth > 0) {
      el.scrollLeft = setWidth * dirSign;
    }
  }, [dirSign, getSetWidth]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Re-center silently into the middle copy after scrolling settles
    scrollTimeoutRef.current = setTimeout(() => {
      const setWidth = getSetWidth();
      if (setWidth === 0) return;

      const pos = el.scrollLeft * dirSign;
      if (pos < setWidth * 0.5) {
        el.scrollLeft = (pos + setWidth) * dirSign;
      } else if (pos >= setWidth * 1.5) {
        el.scrollLeft = (pos - setWidth) * dirSign;
      }
    }, 150);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const setWidth = getSetWidth();
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (setWidth === 0 || maxScroll <= 0) return;

    let pos = el.scrollLeft * dirSign;

    if (direction === "left") {
      // Jump ahead by one set silently before smooth scrolling if near the start edge
      if (pos - SCROLL_STEP < 0) {
        pos += setWidth;
        el.scrollLeft = pos * dirSign;
      }

      el.scrollBy({
        left: -SCROLL_STEP * dirSign,
        behavior: "smooth",
      });
    } else {
      // Jump back by one set silently before smooth scrolling if near the end edge
      if (pos + SCROLL_STEP > maxScroll) {
        pos -= setWidth;
        el.scrollLeft = pos * dirSign;
      }

      el.scrollBy({
        left: SCROLL_STEP * dirSign,
        behavior: "smooth",
      });
    }
  };

  if (brands.length === 0) return null;

  return (
    <div className="relative flex w-full items-center gap-[10px] px-4 py-3">
      {/* Scroll Left Button */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label={prevLabel}
        className="hidden h-[40px] w-[30px] shrink-0 items-center justify-center rounded-[999px] border border-[var(--Border-Default,#CCD0D8)] bg-white text-neutral-700 transition hover:bg-neutral-50 active:scale-95 md:flex"
      >
        <ChevronLeft className="h-[14px] w-[14px] transition-transform rtl:rotate-180" />
      </button>

      {/* Scroll Track (note: no `scroll-smooth` class so instant loop resets don't animate) */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="no-scrollbar flex min-w-0 flex-1 items-center gap-[10px] overflow-x-auto py-1 [-webkit-overflow-scrolling:touch]"
      >
        {COPIES.map((copyIndex) =>
          brands.map((brand, brandIndex) => (
            <Link
              key={`${copyIndex}-${brand.slug}-${brandIndex}`}
              href={catalogPath(city, { make: brand.slug })}
              aria-hidden={copyIndex !== 1}
              tabIndex={copyIndex !== 1 ? -1 : undefined}
              className="flex h-[40px] min-w-[128px] shrink-0 items-center justify-center gap-1 rounded-[999px] border border-[var(--Border-Default,#CCD0D8)] bg-white py-0 pe-[16px] ps-[12px] transition hover:border-neutral-900 hover:shadow-xs"
            >
              <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt=""
                    width={18}
                    height={18}
                    className="max-h-[18px] max-w-[18px] object-contain"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-text-secondary">
                    {brand.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </span>
              <span className="truncate text-xs font-semibold text-neutral-800">
                {brand.name}
              </span>
            </Link>
          )),
        )}
      </div>

      {/* Scroll Right Button */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label={nextLabel}
        className="hidden h-[40px] w-[30px] shrink-0 items-center justify-center rounded-[999px] border border-[var(--Border-Default,#CCD0D8)] bg-white text-neutral-700 transition hover:bg-neutral-50 active:scale-95 md:flex"
      >
        <ChevronRight className="h-[14px] w-[14px] transition-transform rtl:rotate-180" />
      </button>
    </div>
  );
}
