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
    <div
      data-slot="listing-card"
      className="group relative flex min-h-[454px] w-full flex-col gap-[10px] overflow-hidden rounded-[16px] border border-border-default bg-background-primary p-0 pb-[20px] shadow-small transition-shadow duration-200 hover:shadow-medium"
    >
      {/* 1. IMAGE CONTAINER (fluid width, 200px height) */}
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-background-secondary">
        <Image
          src={images[currentImageIndex]}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 85vw, 308px"
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

      {/* 2. CONTENT CONTAINER (fluid width) */}
      <div className="flex flex-1 flex-col justify-between gap-2.5 px-4 py-0">
        <Link href={listing.href} className="group/title block w-full">
          <h3 className="truncate font-sans text-[18px] font-medium leading-[140%] tracking-normal text-text-primary transition-colors group-hover/title:text-primary">
            {listing.title}
          </h3>
        </Link>

        {/* Price Section: fluid columns, original price beside discount badge */}
        <div className="flex w-full items-stretch justify-between gap-3">
          {/* Daily Price Column */}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {listing.dailyDiscount ? (
                <span className="inline-flex h-5 items-center justify-center rounded-[4px] bg-text-primary px-2 text-[10px] font-bold text-text-inverse">
                  {listing.dailyDiscount}
                </span>
              ) : null}
              {listing.dailyOriginalPrice ? (
                <span className="truncate text-[12px] font-normal text-text-disabled line-through">
                  {listing.dailyOriginalPrice}
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-baseline gap-x-1">
              <span className="text-[17px] font-semibold leading-tight tracking-[-0.02em] text-text-primary">
                {listing.dailyPrice}
              </span>
              <span className="text-[11px] leading-none text-text-secondary">
                {dailyUnit}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[12px] text-text-secondary">
              <RoadIcon className="size-3.5 shrink-0" />
              <span className="truncate">{listing.dailyKm}</span>
            </div>
          </div>

          <div className="w-0 shrink-0 border-r-[0.5px] border-border-default" />

          {/* Monthly Price Column */}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {listing.monthlyDiscount ? (
                <span className="inline-flex h-5 items-center justify-center rounded-[4px] bg-text-primary px-2 text-[10px] font-bold text-text-inverse">
                  {listing.monthlyDiscount}
                </span>
              ) : null}
              {listing.monthlyOriginalPrice ? (
                <span className="truncate text-[12px] font-normal text-text-disabled line-through">
                  {listing.monthlyOriginalPrice}
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-baseline gap-x-1">
              <span className="text-[17px] font-semibold leading-tight tracking-[-0.02em] text-text-primary">
                {listing.monthlyPrice ?? listing.dailyPrice}
              </span>
              <span className="text-[11px] leading-none text-text-secondary">
                {monthlyUnit}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[12px] text-text-secondary">
              <RoadIcon className="size-3.5 shrink-0" />
              <span className="truncate">{listing.monthlyKm}</span>
            </div>
          </div>
        </div>

        <div className="h-0 w-full shrink-0 border-t-[0.5px] border-border-subtle" />

        {/* Features Checklist */}
        <div className="grid w-full grid-cols-2 grid-rows-2 gap-x-2 gap-y-1">
          {(listing.features ?? []).slice(0, 4).map((feature, idx) => (
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
            asChild={Boolean(listing.phoneHref)}
            disabled={!listing.phoneHref}
            variant="outline-brand"
            className="h-10 flex-1 rounded-full p-0"
          >
            {listing.phoneHref ? (
              <a href={listing.phoneHref} aria-label={listing.callLabel}>
                <PhoneIcon className="size-5" />
              </a>
            ) : (
              <span aria-label={listing.callLabel}>
                <PhoneIcon className="size-5" />
              </span>
            )}
          </Button>

          <Button
            asChild={Boolean(listing.whatsappHref)}
            disabled={!listing.whatsappHref}
            variant="whatsapp-outline"
            className="h-10 flex-1 rounded-full p-0"
          >
            {listing.whatsappHref ? (
              <a
                href={listing.whatsappHref}
                aria-label={listing.whatsappLabel}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="size-5" />
              </a>
            ) : (
              <span aria-label={listing.whatsappLabel}>
                <WhatsAppIcon className="size-5" />
              </span>
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
}
