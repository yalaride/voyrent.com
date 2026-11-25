"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { catalogPath } from "@/domain/routing/rent-paths";

export const BRAND_LOGOS: Record<string, string> = {
  "alfa-romeo": "/brands/v1_alfa_romeo.png",
  audi: "/brands/v1_audi.png",
  bentley: "/brands/v1_bentley.png",
  bestune: "/brands/v1_bestune.png",
  bmw: "/brands/v1_bmw.png",
  byd: "/brands/v1_byd.png",
  cadillac: "/brands/v1_cadillac.png",
  changan: "/brands/v1_changan.png",
  chevrolet: "/brands/v1_chevrolet.png",
  citroen: "/brands/v1_citroen.png",
  dodge: "/brands/v1_dodge.png",
  dongfeng: "/brands/v1_dongfeng.png",
  exeed: "/brands/v1_exeed.png",
  ferrari: "/brands/v1_ferrari.png",
  fiat: "/brands/v1_fiat.png",
  ford: "/brands/v1_ford.png",
  gac: "/brands/v1_gac.png",
  geely: "/brands/v1_geely.png",
  genesis: "/brands/v1_genesis.png",
  gmc: "/brands/v1_gmc.png",
  haval: "/brands/v1_haval.png",
  honda: "/brands/v1_honda.png",
  hyundai: "/brands/v1_hyundai.png",
  infiniti: "/brands/v1_infiniti.png",
  jac: "/brands/v1_jac.png",
  jaecoo: "/brands/v1_jaecoo.png",
  jaguar: "/brands/v1_jaguar.png",
  jeep: "/brands/v1_jeep.png",
  jetour: "/brands/v1_jetour.png",
  kia: "/brands/v1_kia.png",
  "king-long": "/brands/v1_king_long.png",
  lamborghini: "/brands/v1_lamborghini.png",
  "land-rover": "/brands/v1_land_rover.png",
  lexus: "/brands/v1_lexus.png",
  lincoln: "/brands/v1_lincoln.png",
  mazda: "/brands/v1_mazda.png",
  mclaren: "/brands/v1_mclaren.png",
  "mercedes-benz": "/brands/v1_mercedes_benz.png",
  "mercedes-maybach": "/brands/v1_mercedes_maybach.png",
  mg: "/brands/v1_mg.png",
  mini: "/brands/v1_mini.png",
  mitsubishi: "/brands/v1_mitsubishi.png",
  nissan: "/brands/v1_nissan.png",
  omoda: "/brands/v1_omoda.png",
  opel: "/brands/v1_opel.png",
  peugeot: "/brands/v1_peugeot.png",
  porsche: "/brands/v1_porsche.png",
  renault: "/brands/v1_renault.png",
  "rolls-royce": "/brands/v1_rolls_royce.png",
  rox: "/brands/v1_rox.png",
  suzuki: "/brands/v1_suzuki.png",
  tesla: "/brands/v1_tesla.png",
  toyota: "/brands/v1_toyota.png",
  volkswagen: "/brands/v1_volkswagen.png",
  zeekr: "/brands/v1_zeekr.png",
};

const BRAND_DISPLAY_NAMES: Record<string, string> = {
  bmw: "BMW",
  byd: "BYD",
  gac: "GAC",
  gmc: "GMC",
  jac: "JAC",
  mclaren: "McLaren",
  "mercedes-benz": "Mercedes-Benz",
  "mercedes-maybach": "Mercedes-Maybach",
  mg: "MG",
  mini: "MINI",
  "rolls-royce": "Rolls-Royce",
  rox: "ROX",
};

function formatBrandName(slug: string): string {
  const lower = slug.toLowerCase();
  if (BRAND_DISPLAY_NAMES[lower]) return BRAND_DISPLAY_NAMES[lower];
  return lower
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

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
  const locale = useLocale();

  const items = useMemo(() => {
    const seen = new Set<string>();
    const result: { slug: string; logo?: string; name: string }[] = [];

    // 1. Keep any brands passed via props first (preserving their localized names/slugs)
    for (const brand of brands) {
      const normalized = brand.slug.toLowerCase();
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      result.push({
        slug: brand.slug,
        logo: BRAND_LOGOS[brand.slug] ?? BRAND_LOGOS[normalized],
        name: brand.name,
      });
    }

    // 2. Append all remaining brands from BRAND_LOGOS so all brands are always shown
    for (const [slug, logo] of Object.entries(BRAND_LOGOS)) {
      const normalized = slug.toLowerCase();
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      result.push({
        slug: normalized,
        logo,
        name: formatBrandName(normalized),
      });
    }

    return result;
  }, [brands]);

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

  const jumpSilently = useCallback((el: HTMLDivElement, targetLeft: number) => {
    isAdjustingRef.current = true;
    el.scrollLeft = targetLeft;
    requestAnimationFrame(() => {
      isAdjustingRef.current = false;
    });
  }, []);

  // Start positioned at the beginning of the middle copy so both directions loop seamlessly
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

    // Immediate wrap near outer edges so continuous trackpad/touch scrolling never hits a wall
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

    // Re-center silently into the middle copy after scrolling settles
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
      {/* Scroll Left Button (30x40px capsule, 14x14px centered icon) */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label={prevLabel}
        className="hidden h-[40px] w-[30px] shrink-0 items-center justify-center rounded-[999px] border border-[var(--Border-Default,#CCD0D8)] bg-white text-neutral-700 transition hover:bg-neutral-50 active:scale-95 md:flex"
      >
        <ChevronLeft className="h-[14px] w-[14px] transition-transform rtl:rotate-180" />
      </button>

      {/* Scroll Track (no `scroll-smooth` class so instant loop resets don't animate) */}
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
                    width={20}
                    height={20}
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

      {/* Scroll Right Button (30x40px capsule, 14x14px centered icon) */}
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
