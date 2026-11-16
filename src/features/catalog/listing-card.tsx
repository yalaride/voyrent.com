"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  CrownIcon,
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  PhoneIcon,
  WhatsAppIcon,
  RoadIcon,
} from "@/components/icons";

export type ListingCardModel = {
  id: string;
  href: string;
  title: string;
  images: string[];
  isPremium?: boolean;
  premiumLabel?: string;

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

// Ensures unit strictly outputs "/ day" and "/ mon" without duplicate "per"
function formatUnit(label: string, fallback: "day" | "mon"): string {
  const clean = label
    .replace(/^\/?\s*(per\s*)?/i, "")
    .trim()
    .toLowerCase();
  if (clean.startsWith("mon")) return "/ mon";
  if (clean.startsWith("day")) return "/ day";
  return `/ ${clean || fallback}`;
}

export function ListingCard({ listing }: { listing: ListingCardModel }) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);

  const images =
    listing.images?.length > 0 ? listing.images : ["/landing-page/hero.png"];

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

  return (
    /* Card: width: 308; height: 454; p-0; pb: space/20 (20px); gap: 10px; radius: 16px; border: 1px */
    <div
      data-slot="listing-card"
      className="group relative flex h-[454px] w-[308px] shrink-0 flex-col gap-[10px] overflow-hidden rounded-[16px] border border-border-default bg-background-primary p-0 pb-[20px] shadow-small transition-shadow duration-200 hover:shadow-medium"
    >
      {/* ================= 1. IMAGE CONTAINER (308px × 200px) ================= */}
      <div className="relative h-[200px] w-[308px] shrink-0 overflow-hidden bg-background-secondary">
        <Image
          src={images[currentImageIndex]}
          alt={listing.title}
          fill
          sizes="308px"
          priority={false}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Premium Badge */}
        {listing.isPremium && listing.premiumLabel ? (
          <div className="absolute start-2.5 top-2.5 z-10 flex h-[26px] items-center gap-[6px] rounded-full bg-warning px-2.5 py-1 text-text-inverse shadow-xs">
            <CrownIcon className="size-3.5 shrink-0 fill-current" />
            <span className="truncate text-[11px] font-semibold leading-none">
              {listing.premiumLabel}
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

            {/* Pagination Dots */}
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

      {/* ================= 2. CONTENT CONTAINER (276px width) ================= */}
      <div className="flex flex-1 flex-col justify-between px-4 py-0">
        {/* Name: width: 276; height: 25; font-size: 18px; font-weight: 500; line-height: 140% */}
        <Link
          href={listing.href}
          className="group/title block h-[25px] w-[276px]"
        >
          <h3 className="truncate font-sans text-[18px] font-medium leading-[140%] tracking-normal text-text-primary transition-colors group-hover/title:text-primary">
            {listing.title}
          </h3>
        </Link>

        {/* Price Section: width: 276; height: 71; gap: 12; */}
        <div className="flex h-[71px] w-[276px] items-start justify-between gap-[12px]">
          {/* Daily Price Column */}
          <div className="flex h-[71px] flex-1 min-w-0 flex-col justify-between">
            {/* -26% Badge */}
            <div className="flex h-5 items-center">
              {listing.dailyDiscount ? (
                <span className="flex h-5 items-center justify-center rounded-[4px] bg-text-primary px-[10px] text-[10px] font-bold text-text-inverse">
                  {listing.dailyDiscount}
                </span>
              ) : null}
            </div>

            {/* Price Line: $540  $439 / day */}
            <div className="flex h-[22px] items-baseline gap-1 overflow-hidden whitespace-nowrap">
              {listing.dailyOriginalPrice ? (
                <span className="shrink-0 text-[13px] font-normal leading-[150%] text-text-disabled line-through">
                  {listing.dailyOriginalPrice}
                </span>
              ) : null}
              <span className="shrink-0 text-[20px] font-semibold leading-[126%] tracking-[-0.02em] text-text-primary">
                {listing.dailyPrice}
              </span>
              <span className="shrink-0 text-[12px] leading-none text-text-secondary">
                {dailyUnit}
              </span>
            </div>

            {/* Km Limit */}
            <div className="flex items-center gap-1 text-[12px] text-text-secondary">
              <RoadIcon className="size-3.5 shrink-0" />
              <span className="truncate">{listing.dailyKm}</span>
            </div>
          </div>

          {/* Figma Vertical Divider (height: 71px, border-width: 0.5px) */}
          <div className="h-[71px] w-0 shrink-0 border-r-[0.5px] border-border-default" />

          {/* Monthly Price Column */}
          <div className="flex h-[71px] flex-1 min-w-0 flex-col justify-between">
            {/* -26% Badge */}
            <div className="flex h-5 items-center">
              {listing.monthlyDiscount ? (
                <span className="flex h-5 items-center justify-center rounded-[4px] bg-text-primary px-[10px] text-[10px] font-bold text-text-inverse">
                  {listing.monthlyDiscount}
                </span>
              ) : null}
            </div>

            {/* Price Line: $540  $439 / mon */}
            <div className="flex h-[22px] items-baseline gap-1 overflow-hidden whitespace-nowrap">
              {listing.monthlyOriginalPrice ? (
                <span className="shrink-0 text-[13px] font-normal leading-[150%] text-text-disabled line-through">
                  {listing.monthlyOriginalPrice}
                </span>
              ) : null}
              <span className="shrink-0 text-[20px] font-semibold leading-[126%] tracking-[-0.02em] text-text-primary">
                {listing.monthlyPrice ?? listing.dailyPrice}
              </span>
              <span className="shrink-0 text-[12px] leading-none text-text-secondary">
                {monthlyUnit}
              </span>
            </div>

            {/* Km Limit */}
            <div className="flex items-center gap-1 text-[12px] text-text-secondary">
              <RoadIcon className="size-3.5 shrink-0" />
              <span className="truncate">{listing.monthlyKm}</span>
            </div>
          </div>
        </div>

        {/* Horizontal Divider: width: 276; height: 0px; border-width: 0.5px; */}
        <div className="h-0 w-[276px] shrink-0 border-t-[0.5px] border-border-subtle" />

        {/* Features Checklist: width: 276; */}
        <div className="grid w-[276px] grid-cols-2 grid-rows-2 gap-x-2 gap-y-1">
          {(listing.features ?? []).slice(0, 4).map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 text-[13px] font-normal leading-tight text-text-secondary"
            >
              <CheckIcon className="size-3.5 shrink-0 text-text-secondary" />
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons: Phone + WhatsApp + Dealer Logo */}
        <div className="flex h-10 w-[276px] items-center gap-2">
          {/* Phone Button */}
          <Button
            asChild
            variant="outline-brand"
            className="h-10 flex-1 rounded-full p-0"
          >
            <a href={listing.phoneHref ?? "#"} aria-label={listing.callLabel}>
              <PhoneIcon className="size-5" />
            </a>
          </Button>

          {/* WhatsApp Button */}
          <Button
            asChild
            variant="whatsapp-outline"
            className="h-10 flex-1 rounded-full p-0"
          >
            <a
              href={listing.whatsappHref ?? "#"}
              aria-label={listing.whatsappLabel}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="size-5" />
            </a>
          </Button>

          {/* Dealer Logo */}
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
}
