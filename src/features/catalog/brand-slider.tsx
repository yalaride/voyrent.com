"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { catalogPath } from "@/domain/routing/rent-paths";

const BRAND_LOGOS: Record<string, string> = {
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

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const step = 280;
    const multiplier = isRtl
      ? direction === "left"
        ? 1
        : -1
      : direction === "left"
        ? -1
        : 1;

    scrollRef.current.scrollBy({
      left: step * multiplier,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[1440px] items-center gap-[10px] px-4 py-3">
      {/* Scroll Left Button */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label={prevLabel}
        className="hidden h-[40px] w-[30px] shrink-0 items-center justify-center rounded-[999px] border border-[var(--Border-Default,#CCD0D8)] bg-white text-neutral-700 transition hover:bg-neutral-50 active:scale-95 md:flex"
      >
        <ChevronLeft className="h-[14px] w-[14px] transition-transform rtl:rotate-180" />
      </button>

      {/* Scroll Track */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex flex-1 items-center gap-[10px] overflow-x-auto scroll-smooth py-1 [-webkit-overflow-scrolling:touch]"
      >
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={catalogPath(city, { make: brand.slug })}
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
        ))}
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
