"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { catalogPath } from "@/domain/routing/rent-paths";
import { BRAND_LOGOS, formatBrandName } from "@/domain/catalog/brand-logos";

export { BRAND_LOGOS };

const COPIES = [0, 1, 2] as const;
const SCROLL_STEP = 280;

export function BrandSlider({
  city,
  brands = [],
}: {
  city: string;
  brands?: { slug: string; name: string }[];
}) {
  const tNav = useTranslations("Listings");
  const tBrands = useTranslations("Brands");
  const locale = useLocale();

  const items = useMemo(() => {
    const seen = new Set<string>();
    const result: { slug: string; logo?: string; name: string }[] = [];

    const getBrandName = (slug: string, fallback?: string) => {
      const key = slug.toLowerCase();
      if (tBrands.has(key as never)) {
        return tBrands(key as never);
      }
      return fallback || formatBrandName(key);
    };

    // 1. Keep any brands passed via props first
    for (const brand of brands) {
      const normalized = brand.slug.toLowerCase();
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      result.push({
        slug: brand.slug,
        logo: BRAND_LOGOS[brand.slug] ?? BRAND_LOGOS[normalized],
        name: getBrandName(normalized, brand.name),
      });
    }

    // 2. Append all remaining brands from BRAND_LOGOS
    for (const [slug, logo] of Object.entries(BRAND_LOGOS)) {
      const normalized = slug.toLowerCase();
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      result.push({
        slug: normalized,
        logo,
        name: getBrandName(normalized),
      });
    }

    return result;
  }, [brands, tBrands]);

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
  const isAdjustingRef = useRef(false);

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

  const jumpSilently = useCallback((el: HTMLDivElement, targetLeft: number) => {
    isAdjustingRef.current = true;
    el.scrollLeft = targetLeft;
    requestAnimationFrame(() => {
      isAdjustingRef.current = false;
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const setWidth = getSetWidth();
    if (setWidth > 0) {
      jumpSilently(el, setWidth * dirSign);
    }
  }, [dirSign, getSetWidth, jumpSilently]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || isAdjustingRef.current) return;

    const setWidth = getSetWidth();
    if (setWidth === 0) return;

    const pos = el.scrollLeft * dirSign;

    if (pos < setWidth * 0.25) {
      jumpSilently(el, (pos + setWidth) * dirSign);
      return;
    }
    if (pos > setWidth * 1.75) {
      jumpSilently(el, (pos - setWidth) * dirSign);
      return;
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const currentSetWidth = getSetWidth();
      if (currentSetWidth === 0) return;

      const settledPos = el.scrollLeft * dirSign;
      if (settledPos < currentSetWidth * 0.5) {
        jumpSilently(el, (settledPos + currentSetWidth) * dirSign);
      } else if (settledPos >= currentSetWidth * 1.5) {
        jumpSilently(el, (settledPos - currentSetWidth) * dirSign);
      }
    }, 150);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const setWidth = getSetWidth();
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (setWidth === 0 || maxScroll <= 0) return;

    const pos = el.scrollLeft * dirSign;
    let wrapped = false;

    if (direction === "left" && pos - SCROLL_STEP < setWidth * 0.25) {
      jumpSilently(el, (pos + setWidth) * dirSign);
      wrapped = true;
    } else if (direction === "right" && pos + SCROLL_STEP > setWidth * 1.75) {
      jumpSilently(el, (pos - setWidth) * dirSign);
      wrapped = true;
    }

    const delta = (direction === "left" ? -SCROLL_STEP : SCROLL_STEP) * dirSign;

    if (wrapped) {
      requestAnimationFrame(() => {
        el.scrollBy({ left: delta, behavior: "smooth" });
      });
    } else {
      el.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  if (brands.length === 0) return null;

  return (
    <div className="relative flex w-full items-center gap-[10px] px-4 py-3">
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label={prevLabel}
        className="hidden h-[40px] w-[30px] shrink-0 items-center justify-center rounded-[999px] border border-[var(--Border-Default,#CCD0D8)] bg-white text-neutral-700 transition hover:bg-neutral-50 active:scale-95 md:flex"
      >
        <ChevronLeft className="h-[14px] w-[14px] transition-transform rtl:rotate-180" />
      </button>

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
              className="flex h-[40px] min-w-[128px] shrink-0 items-center justify-center gap-[6px] rounded-[999px] border border-[var(--Border-Default,#CCD0D8)] bg-white px-[14px] py-0 transition hover:border-neutral-900 hover:shadow-xs"
            >
              <span className="relative flex h-[20px] w-[20px] shrink-0 items-center justify-center">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt=""
                    width={24}
                    height={24}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-[10px] font-bold leading-none text-text-secondary">
                    {brand.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </span>
              <span className="truncate text-xs font-semibold leading-none text-neutral-800">
                {brand.name}
              </span>
            </Link>
          )),
        )}
      </div>

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
