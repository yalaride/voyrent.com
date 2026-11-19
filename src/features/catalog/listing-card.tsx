"use client";

import * as React from "react";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  CrownIcon,
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  RoadIcon,
} from "@/components/icons";

export type ListingBadgeType = "premium" | "featured" | "none";

export type ListingCardModel = {
  id: string;
  href: string;
  title: string;
  specsLine?: string;
  locationLabel?: string;
  images: string[];

  // Badge: "premium" | "featured" | "none"
  badge?: ListingBadgeType;
  isPremium?: boolean;
  premiumLabel?: string;
  featuredLabel?: string;

  // Daily pricing
  dailyDiscount?: string | null;
  dailyOriginalPrice?: string | null;
  dailyPrice: string;
  dailyKm: string;
  perDayLabel: string;

  // Monthly pricing
  monthlyDiscount?: string | null;
  monthlyOriginalPrice?: string | null;
  monthlyPrice: string | null;
  monthlyKm: string;
  perMonthLabel: string;

  // Checklist
  features: string[];

  // Actions
  phoneHref?: string | null;
  whatsappHref?: string | null;
  dealerName: string;
  dealerLogoUrl?: string | null;
  dealerHref?: string | null;
  callLabel: string;
  whatsappLabel: string;
  likeLabel: string;
  likedLabel: string;
  prevImageLabel?: string;
  nextImageLabel?: string;
};

function formatUnit(label: string, fallback: "day" | "mon"): string {
  const trimmed = label.trim();
  const clean = trimmed.replace(/^\/?\s*(per\s*)?/i, "").trim();
  const lower = clean.toLowerCase();
  if (lower.startsWith("mon")) return "/ mon";
  if (lower.startsWith("day")) return "/ day";
  if (trimmed.startsWith("/")) return trimmed;
  return `/ ${clean || fallback}`;
}

export function ListingCard({
  listing,
  variant = "vertical",
}: {
  listing: ListingCardModel;
  /**
   * "vertical": always vertical card (sliders)
   * "responsive": vertical on mobile (1 col) & tablet (2 cols), exact horizontal card on laptop/desktop (lg+)
   */
  variant?: "vertical" | "responsive";
}) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);

  const images =
    listing.images?.length > 0 ? listing.images : ["/landing-page/hero.png"];

  const badgeType: ListingBadgeType =
    listing.badge ?? (listing.isPremium ? "premium" : "none");

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  const dailyUnit = formatUnit(listing.perDayLabel, "day");
  const monthlyUnit = formatUnit(listing.perMonthLabel, "mon");
  const visibleHorizontalDots = Math.min(images.length, 4);

  const featuresList = React.useMemo(
    () =>
      (listing.features ?? [])
        .filter((f) => f && f !== listing.dealerName)
        .slice(0, 4),
    [listing.dealerName, listing.features],
  );

  // Vertical card JSX (Mobile, Tablet 2-col, and Sliders)
  const verticalCard = (
    <div
      data-slot="listing-card"
      className={`group relative flex min-h-[454px] w-full flex-col gap-[10px] overflow-hidden rounded-[16px] border border-border-default bg-background-primary p-0 pb-[20px] shadow-small transition-shadow duration-200 hover:shadow-medium ${
        variant === "responsive" ? "lg:hidden" : ""
      }`}
    >
      {/* 1. IMAGE CONTAINER */}
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-background-secondary">
        <Link href={listing.href} className="block size-full">
          <Image
            src={images[currentImageIndex]}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 85vw, 308px"
            priority={false}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Badge: Premium OR Featured OR None */}
        {badgeType === "premium" && listing.premiumLabel ? (
          <div className="absolute start-2.5 top-2.5 z-10 flex h-[26px] items-center gap-[6px] rounded-full bg-warning px-2.5 py-1 text-text-inverse shadow-xs">
            <CrownIcon className="size-3.5 shrink-0 fill-current" />
            <span className="truncate text-[11px] font-semibold leading-none">
              {listing.premiumLabel}
            </span>
          </div>
        ) : badgeType === "featured" && listing.featuredLabel ? (
          <div className="absolute start-2.5 top-2.5 z-10 flex h-[26px] max-w-[calc(100%-64px)] items-center gap-[6px] rounded-full bg-primary px-2.5 py-1 text-text-inverse shadow-xs">
            <Star className="size-3.5 shrink-0" />
            <span className="truncate text-[11px] font-semibold leading-none">
              {listing.featuredLabel}
            </span>
          </div>
        ) : null}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleLike}
          aria-label={isLiked ? listing.likedLabel : listing.likeLabel}
          className="absolute end-2.5 top-2.5 z-10 flex size-8 items-center justify-center rounded-full border border-border-subtle bg-background-primary/80 backdrop-blur-xs transition hover:scale-105 hover:bg-background-primary"
        >
          <HeartIcon
            className={`size-4 transition-colors ${
              isLiked
                ? "fill-danger text-danger"
                : "text-text-primary hover:text-danger"
            }`}
          />
        </button>

        {/* Carousel Controls */}
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label={listing.prevImageLabel ?? "Previous"}
              className="absolute start-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background-primary/80 text-text-primary opacity-0 shadow-xs backdrop-blur-xs transition group-hover:opacity-100 hover:bg-background-primary rtl:rotate-180"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label={listing.nextImageLabel ?? "Next"}
              className="absolute end-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-background-primary/80 text-text-primary opacity-0 shadow-xs backdrop-blur-xs transition group-hover:opacity-100 hover:bg-background-primary rtl:rotate-180"
            >
              <ChevronRightIcon className="size-4" />
            </button>

            <div className="absolute bottom-2 left-1/2 z-10 flex h-[12px] -translate-x-1/2 items-center justify-center gap-[3px] rounded-full bg-black/45 px-2 py-1 backdrop-blur-xs">
              {images.slice(0, 5).map((_, idx) => (
                <span
                  key={idx}
                  className={`size-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? "w-2.5 bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* 2. CONTENT CONTAINER */}
      <div className="flex flex-1 flex-col justify-between gap-2.5 px-4 py-0">
        <Link href={listing.href} className="group/title block w-full">
          <h3 className="truncate font-sans text-[18px] font-medium leading-[140%] tracking-normal text-text-primary transition-colors group-hover/title:text-primary">
            {listing.title}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="flex w-full items-stretch justify-between gap-2.5">
          {/* Daily Price Column */}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {listing.dailyDiscount ? (
                <span className="inline-flex h-5 items-center justify-center rounded-[4px] bg-text-primary px-2 text-[10px] font-bold text-text-inverse">
                  {listing.dailyDiscount}
                </span>
              ) : null}
              {listing.dailyOriginalPrice ? (
                <span className="whitespace-nowrap text-[11px] font-normal text-text-disabled line-through sm:text-[12px]">
                  {listing.dailyOriginalPrice}
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-baseline gap-x-1">
              <span className="whitespace-nowrap text-[15px] font-semibold leading-tight tracking-[-0.02em] text-text-primary sm:text-[17px]">
                {listing.dailyPrice}
              </span>
              <span className="whitespace-nowrap text-[11px] leading-none text-text-secondary">
                {dailyUnit}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[12px] text-text-secondary">
              <RoadIcon className="size-3.5 shrink-0" />
              <span className="whitespace-nowrap">{listing.dailyKm}</span>
            </div>
          </div>

          {listing.monthlyPrice ? (
            <>
              <div className="w-0 shrink-0 border-e-[0.5px] border-border-default" />

              {/* Monthly Price Column */}
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {listing.monthlyDiscount ? (
                    <span className="inline-flex h-5 items-center justify-center rounded-[4px] bg-text-primary px-2 text-[10px] font-bold text-text-inverse">
                      {listing.monthlyDiscount}
                    </span>
                  ) : null}
                  {listing.monthlyOriginalPrice ? (
                    <span className="whitespace-nowrap text-[11px] font-normal text-text-disabled line-through sm:text-[12px]">
                      {listing.monthlyOriginalPrice}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-baseline gap-x-1">
                  <span className="whitespace-nowrap text-[15px] font-semibold leading-tight tracking-[-0.02em] text-text-primary sm:text-[17px]">
                    {listing.monthlyPrice}
                  </span>
                  <span className="whitespace-nowrap text-[11px] leading-none text-text-secondary">
                    {monthlyUnit}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[12px] text-text-secondary">
                  <RoadIcon className="size-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{listing.monthlyKm}</span>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="h-0 w-full shrink-0 border-t-[0.5px] border-border-subtle" />

        {/* Features Checklist */}
        <div className="grid w-full grid-cols-2 grid-rows-2 gap-x-2 gap-y-1">
          {featuresList.map((feature, idx) => (
            <div
              key={idx}
              className="flex min-w-0 items-center gap-1.5 text-[13px] font-normal leading-tight text-text-secondary"
            >
              <CheckIcon className="size-3.5 shrink-0 text-text-secondary" />
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex h-10 w-full items-center gap-2">
          <Button
            asChild
            variant="outline-brand"
            size="sm"
            className="flex-1 px-0"
          >
            {listing.phoneHref ? (
              <a href={listing.phoneHref} aria-label={listing.callLabel}>
                <Image
                  unoptimized
                  src="/icons/phone.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="size-5 shrink-0"
                />
              </a>
            ) : (
              <Link href={listing.href} aria-label={listing.callLabel}>
                <Image
                  unoptimized
                  src="/icons/phone.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="size-5 shrink-0"
                />
              </Link>
            )}
          </Button>

          <Button
            asChild
            variant="whatsapp-outline"
            size="sm"
            className="flex-1 px-0"
          >
            {listing.whatsappHref ? (
              <a
                href={listing.whatsappHref}
                aria-label={listing.whatsappLabel}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  unoptimized
                  src="/icons/whatsapp.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="size-5 shrink-0"
                />
              </a>
            ) : (
              <Link href={listing.href} aria-label={listing.whatsappLabel}>
                <Image
                  unoptimized
                  src="/icons/whatsapp.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="size-5 shrink-0"
                />
              </Link>
            )}
          </Button>

          {listing.dealerHref ? (
            <Link
              href={listing.dealerHref}
              aria-label={listing.dealerName}
              className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-default bg-background-primary p-1 transition hover:bg-background-secondary"
            >
              {listing.dealerLogoUrl ? (
                <Image
                  src={listing.dealerLogoUrl}
                  alt={listing.dealerName}
                  width={36}
                  height={36}
                  className="size-full object-contain"
                />
              ) : (
                <span className="text-[10px] font-semibold text-text-secondary">
                  {listing.dealerName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </Link>
          ) : (
            <div
              title={listing.dealerName}
              className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-default bg-background-primary p-1"
            >
              {listing.dealerLogoUrl ? (
                <Image
                  src={listing.dealerLogoUrl}
                  alt={listing.dealerName}
                  width={36}
                  height={36}
                  className="size-full object-contain"
                />
              ) : (
                <span className="text-[10px] font-semibold text-text-secondary">
                  {listing.dealerName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (variant === "vertical") {
    return verticalCard;
  }

  // Horizontal Card JSX for Laptop & Desktop (lg+)
  return (
    <>
      {verticalCard}

      <article className="group hidden min-h-[242px] flex-row items-stretch gap-4 rounded-[var(--radius-24)] border border-border-default bg-background-primary p-[var(--spacing-space-16)] shadow-[var(--shadow-small)] transition-shadow duration-200 hover:shadow-[var(--shadow-medium)] lg:flex xl:gap-[var(--spacing-space-20)]">
        {/* Left Image Carousel (responsive width so price & checklist never clip below 2xl) */}
        <div className="relative min-h-[208px] w-[228px] shrink-0 overflow-hidden rounded-[var(--radius-16)] bg-background-secondary xl:w-[268px] 2xl:w-[324px]">
          <Link href={listing.href} className="block size-full">
            <Image
              src={images[currentImageIndex]}
              alt={listing.title}
              fill
              sizes="(max-width: 1279px) 228px, (max-width: 1535px) 268px, 324px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Wishlist Heart */}
          <button
            type="button"
            onClick={handleLike}
            aria-label={isLiked ? listing.likedLabel : listing.likeLabel}
            aria-pressed={isLiked}
            className="absolute end-3 top-3 z-10 flex size-8 cursor-pointer items-center justify-center gap-[var(--spacing-space-6)] rounded-[var(--radius-999)] bg-background-primary shadow-[var(--shadow-small)] transition hover:scale-105"
          >
            <HeartIcon
              className={`size-4 stroke-[1.5] transition-colors ${
                isLiked
                  ? "fill-danger text-danger"
                  : "text-text-primary hover:text-danger"
              }`}
            />
          </button>

          {/* Image Prev/Next + Pill Scroller */}
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label={listing.prevImageLabel ?? "Previous image"}
                className="absolute start-2.5 top-1/2 z-10 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[var(--radius-999)] bg-black/55 text-text-inverse transition-colors hover:bg-black/75 rtl:rotate-180"
              >
                <ChevronLeftIcon className="size-3.5 stroke-[1.5]" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label={listing.nextImageLabel ?? "Next image"}
                className="absolute end-2.5 top-1/2 z-10 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[var(--radius-999)] bg-black/55 text-text-inverse transition-colors hover:bg-black/75 rtl:rotate-180"
              >
                <ChevronRightIcon className="size-3.5 stroke-[1.5]" />
              </button>

              <div className="absolute bottom-2.5 left-1/2 z-10 flex h-3 -translate-x-1/2 items-center gap-[3px] rounded-[var(--radius-999)] bg-black/50 px-[5px] py-[3px] backdrop-blur-xs">
                {Array.from({ length: visibleHorizontalDots }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    aria-label={`Image ${idx + 1}`}
                    className={`h-1.5 cursor-pointer rounded-[var(--radius-999)] transition-all ${
                      currentImageIndex % visibleHorizontalDots === idx
                        ? "w-5 bg-background-primary"
                        : "w-1.5 bg-background-primary/60"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>

        {/* Right Detailed Section */}
        <div className="flex min-h-[208px] min-w-0 flex-1 flex-col justify-between gap-4 2xl:gap-[var(--spacing-space-20)]">
          {/* Row 1: Name + Specs + Badge (Premium / Featured / None) */}
          <div className="flex min-h-12 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Link
                href={listing.href}
                className="block truncate text-xl font-semibold leading-[1.26] tracking-[-0.02em] text-text-primary transition-colors hover:text-primary 2xl:text-2xl"
              >
                {listing.title}
              </Link>
              {listing.specsLine ? (
                <p className="mt-1 truncate text-[13px] font-medium leading-[1.2] text-text-secondary">
                  {listing.specsLine}
                </p>
              ) : null}
            </div>

            {badgeType === "premium" && listing.premiumLabel ? (
              <span className="inline-flex h-[26px] shrink-0 items-center gap-[var(--spacing-space-6)] rounded-[var(--radius-999)] bg-warning py-[var(--spacing-space-6)] pe-[var(--spacing-space-10)] ps-[var(--spacing-space-6)] text-xs font-medium leading-none text-text-inverse">
                <CrownIcon className="size-3.5 shrink-0 fill-current" />
                <span>{listing.premiumLabel}</span>
              </span>
            ) : badgeType === "featured" && listing.featuredLabel ? (
              <span className="inline-flex h-[26px] max-w-[180px] shrink-0 items-center gap-[var(--spacing-space-6)] rounded-[var(--radius-999)] bg-primary py-[var(--spacing-space-6)] pe-[var(--spacing-space-10)] ps-[var(--spacing-space-6)] text-xs font-medium leading-none text-text-inverse">
                <Star className="size-3.5 shrink-0" />
                <span className="truncate">{listing.featuredLabel}</span>
              </span>
            ) : null}
          </div>

          {/* Row 2: Price Section + Checklist (stacked cleanly on lg, side-by-side on xl+ without truncating prices) */}
          <div className="flex flex-col items-start gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-4">
            {/* Pricing Columns */}
            <div className="flex min-w-0 flex-nowrap items-center gap-3 xl:gap-5 2xl:gap-7">
              {/* Daily Price */}
              <div className="flex shrink-0 flex-col justify-center gap-1">
                {listing.dailyDiscount || listing.dailyOriginalPrice ? (
                  <div className="flex items-center gap-1.5 2xl:gap-[var(--spacing-space-8)]">
                    {listing.dailyDiscount ? (
                      <span className="inline-flex h-5 shrink-0 items-center rounded-[var(--radius-4)] bg-text-primary px-1.5 text-[11px] font-semibold text-text-inverse 2xl:h-6 2xl:px-[var(--spacing-space-10)] 2xl:text-xs">
                        {listing.dailyDiscount}
                      </span>
                    ) : null}
                    {listing.dailyOriginalPrice ? (
                      <span className="whitespace-nowrap text-xs font-normal leading-[1.4] text-text-secondary line-through xl:text-sm 2xl:text-base">
                        {listing.dailyOriginalPrice}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <div className="flex items-baseline gap-1 whitespace-nowrap">
                  <span className="whitespace-nowrap text-lg font-bold leading-tight tracking-[-0.02em] text-text-primary xl:text-[20px] 2xl:text-2xl 2xl:leading-[30px]">
                    {listing.dailyPrice}
                  </span>
                  <span className="shrink-0 text-xs text-text-secondary 2xl:text-sm">
                    {dailyUnit}
                  </span>
                </div>
                <p className="whitespace-nowrap text-xs font-medium leading-[1.2] text-text-secondary 2xl:text-[13px]">
                  {listing.dailyKm}
                </p>
              </div>

              {/* Vertical Divider */}
              {listing.monthlyPrice ? (
                <div
                  aria-hidden="true"
                  className="h-[60px] w-[0.5px] shrink-0 bg-border-default 2xl:h-[73px]"
                />
              ) : null}

              {/* Monthly Price */}
              {listing.monthlyPrice ? (
                <div className="flex shrink-0 flex-col justify-center gap-1">
                  {listing.monthlyDiscount || listing.monthlyOriginalPrice ? (
                    <div className="flex items-center gap-1.5 2xl:gap-[var(--spacing-space-8)]">
                      {listing.monthlyDiscount ? (
                        <span className="inline-flex h-5 shrink-0 items-center rounded-[var(--radius-4)] bg-text-primary px-1.5 text-[11px] font-semibold text-text-inverse 2xl:h-6 2xl:px-[var(--spacing-space-10)] 2xl:text-xs">
                          {listing.monthlyDiscount}
                        </span>
                      ) : null}
                      {listing.monthlyOriginalPrice ? (
                        <span className="whitespace-nowrap text-xs font-normal leading-[1.4] text-text-secondary line-through xl:text-sm 2xl:text-base">
                          {listing.monthlyOriginalPrice}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="flex items-baseline gap-1 whitespace-nowrap">
                    <span className="whitespace-nowrap text-lg font-bold leading-tight tracking-[-0.02em] text-text-primary xl:text-[20px] 2xl:text-2xl 2xl:leading-[30px]">
                      {listing.monthlyPrice}
                    </span>
                    <span className="shrink-0 text-xs text-text-secondary 2xl:text-sm">
                      {monthlyUnit}
                    </span>
                  </div>
                  <p className="whitespace-nowrap text-xs font-medium leading-[1.2] text-text-secondary 2xl:text-[13px]">
                    {listing.monthlyKm}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Right End Column: Features Checklist */}
            {featuresList.length > 0 ? (
              <ul className="grid w-full grid-cols-2 gap-x-3 gap-y-1 xl:w-[156px] xl:shrink-0 xl:grid-cols-1 xl:gap-y-0.5 2xl:w-[178px]">
                {featuresList.map((feature, index) => (
                  <li
                    key={index}
                    className="flex h-5 min-w-0 items-center gap-1.5 text-[12px] font-medium leading-[1.1] text-text-secondary 2xl:text-[13px]"
                  >
                    <CheckIcon className="size-3.5 shrink-0 text-text-secondary 2xl:size-4" />
                    <span className="min-w-0 truncate">{feature}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Row 3: Call + WhatsApp + Dealer Avatar + Location */}
          <div className="flex items-center gap-[var(--spacing-space-6)]">
            <Button
              asChild
              variant="outline-brand"
              size="icon-text-sm"
              className="h-10 min-w-0 flex-1 gap-[var(--spacing-space-8)] rounded-[var(--radius-999)] border px-3 py-[var(--spacing-space-10)] 2xl:pe-[var(--spacing-space-24)] 2xl:ps-[var(--spacing-space-20)]"
            >
              {listing.phoneHref ? (
                <a href={listing.phoneHref} className="min-w-0">
                  <Image
                    unoptimized
                    src="/icons/phone.svg"
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden="true"
                    className="size-5 shrink-0"
                  />
                  <span className="min-w-0 truncate">{listing.callLabel}</span>
                </a>
              ) : (
                <Link href={listing.href} className="min-w-0">
                  <Image
                    unoptimized
                    src="/icons/phone.svg"
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden="true"
                    className="size-5 shrink-0"
                  />
                  <span className="min-w-0 truncate">{listing.callLabel}</span>
                </Link>
              )}
            </Button>

            <Button
              asChild
              variant="whatsapp-outline"
              size="icon-text-sm"
              className="h-10 min-w-0 flex-1 gap-[var(--spacing-space-8)] rounded-[var(--radius-999)] border px-3 py-[var(--spacing-space-10)] 2xl:pe-[var(--spacing-space-24)] 2xl:ps-[var(--spacing-space-20)]"
            >
              {listing.whatsappHref ? (
                <a
                  href={listing.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0"
                >
                  <Image
                    unoptimized
                    src="/icons/whatsapp.svg"
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden="true"
                    className="size-5 shrink-0"
                  />
                  <span className="min-w-0 truncate">
                    {listing.whatsappLabel}
                  </span>
                </a>
              ) : (
                <Link href={listing.href} className="min-w-0">
                  <Image
                    unoptimized
                    src="/icons/whatsapp.svg"
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden="true"
                    className="size-5 shrink-0"
                  />
                  <span className="min-w-0 truncate">
                    {listing.whatsappLabel}
                  </span>
                </Link>
              )}
            </Button>

            {/* Dealer Avatar (40 x 40) + Location */}
            <div className="flex shrink-0 items-center gap-[var(--spacing-space-6)]">
              {listing.dealerLogoUrl ? (
                <Image
                  src={listing.dealerLogoUrl}
                  alt={listing.dealerName}
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded-[var(--radius-999)] border border-border-default bg-background-primary object-contain p-1"
                />
              ) : (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-999)] border border-border-default bg-background-secondary text-xs font-semibold text-text-primary">
                  {listing.dealerName.slice(0, 2).toUpperCase()}
                </span>
              )}

              {listing.locationLabel ? (
                <span className="inline-flex h-5 max-w-[96px] min-w-0 items-center gap-1 text-[13px] font-medium leading-[1.1] text-text-secondary 2xl:max-w-[116px]">
                  <MapPin className="size-4 shrink-0 text-text-secondary" />
                  <span className="min-w-0 truncate">
                    {listing.locationLabel}
                  </span>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
