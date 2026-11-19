"use client";

import * as React from "react";
import Image from "next/image";

import { ListingGalleryModal } from "@/components/car-detail/ListingGalleryModal";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CrownIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";

const normalizeImageSrc = (src: string) => {
  const trimmed = src.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
    ? trimmed
    : `/${trimmed}`;
};

export function ListingMobileGallery({
  images,
  title,
  isFeatured,
  premiumLabel,
  prevLabel,
  nextLabel,
}: {
  images: string[];
  title: string;
  isFeatured: boolean;
  premiumLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const thumbRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const normalizedImages = images.map(normalizeImageSrc).filter(Boolean);
  const safeImages =
    normalizedImages.length > 0 ? normalizedImages : ["/blog/blog1.jpg"];
  const currentIndex = Math.min(activeIndex, safeImages.length - 1);

  const selectIndex = (nextIdx: number) => {
    setActiveIndex(nextIdx);
    thumbRefs.current[nextIdx]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const handlePrev = () => {
    selectIndex(currentIndex === 0 ? safeImages.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    selectIndex(currentIndex === safeImages.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <>
      <div className="pt-4 lg:hidden">
        {/* Main Hero Image */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          aria-label={`${title} - ${currentIndex + 1}`}
          className="relative block h-[220px] w-full cursor-pointer overflow-hidden rounded-[var(--radius-16)] bg-background-secondary sm:h-[340px] md:h-[400px]"
        >
          <Image
            src={safeImages[currentIndex]}
            alt={`${title} - ${currentIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 1px"
            className="object-cover"
          />

          {isFeatured ? (
            <span className="pointer-events-none absolute start-3 top-3 z-10 inline-flex h-[26px] items-center gap-1.5 rounded-full bg-warning px-2.5 text-xs font-semibold text-text-inverse shadow-small">
              <CrownIcon className="size-3.5 shrink-0 fill-current" />
              <span>{premiumLabel}</span>
            </span>
          ) : null}

          <span className="pointer-events-none absolute bottom-3 end-3 z-10 inline-flex h-7 items-center rounded-full bg-background-primary px-3 text-xs font-semibold text-text-primary shadow-small">
            {currentIndex + 1} / {safeImages.length}
          </span>
        </button>

        {/* Thumbnail Carousel */}
        {safeImages.length > 1 ? (
          <div className="mt-3 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handlePrev}
              aria-label={prevLabel}
              className="h-[54px] w-9 shrink-0 rounded-[var(--radius-12)] sm:h-[68px] sm:w-10"
            >
              <ChevronLeftIcon className="size-4 rtl:rotate-180" />
            </Button>

            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {safeImages.map((src, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={`${src}-${idx}`}
                    ref={(el) => {
                      thumbRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => selectIndex(idx)}
                    aria-label={`${title} - ${idx + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative h-[54px] w-[calc((100%-16px)/3)] shrink-0 cursor-pointer overflow-hidden rounded-[var(--radius-10)] bg-background-secondary transition-opacity sm:h-[68px] sm:w-[calc((100%-40px)/6)] sm:rounded-[var(--radius-12)] ${
                      isActive
                        ? "ring-2 ring-primary ring-inset"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${title} thumbnail ${idx + 1}`}
                      fill
                      sizes="(max-width: 639px) 30vw, 15vw"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleNext}
              aria-label={nextLabel}
              className="h-[54px] w-9 shrink-0 rounded-[var(--radius-12)] sm:h-[68px] sm:w-10"
            >
              <ChevronRightIcon className="size-4 rtl:rotate-180" />
            </Button>
          </div>
        ) : null}
      </div>

      <ListingGalleryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        images={safeImages}
        activeIndex={currentIndex}
        onSelectIndex={selectIndex}
        title={title}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
      />
    </>
  );
}
