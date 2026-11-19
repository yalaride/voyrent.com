"use client";

import * as React from "react";
import Image from "next/image";

import { CrownIcon } from "@/components/icons";
import { ListingGalleryModal } from "@/components/car-detail/ListingGalleryModal";

const normalizeImageSrc = (src: string) => {
  const trimmed = src.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
    ? trimmed
    : `/${trimmed}`;
};

export function ListingDesktopGallery({
  images,
  title,
  isFeatured,
  premiumLabel,
  prevLabel,
  nextLabel,
  showMoreLabel = "Show more",
}: {
  images: string[];
  title: string;
  isFeatured: boolean;
  premiumLabel: string;
  prevLabel: string;
  nextLabel: string;
  showMoreLabel?: string;
}) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const normalizedImages = images.map(normalizeImageSrc).filter(Boolean);
  const safeImages =
    normalizedImages.length > 0 ? normalizedImages : ["/blog/blog1.jpg"];
  const count = safeImages.length;
  const remainingCount = count > 4 ? count - 4 : 0;

  const openAt = (index: number) => {
    setActiveIndex(index);
    setModalOpen(true);
  };

  const premiumBadge = isFeatured ? (
    <span className="pointer-events-none absolute start-3 top-3 z-10 inline-flex h-[26px] items-center gap-1.5 rounded-full bg-warning px-2.5 text-xs font-semibold text-text-inverse shadow-small">
      <CrownIcon className="size-3.5 shrink-0 fill-current" />
      <span>{premiumLabel}</span>
    </span>
  ) : null;

  return (
    <>
      <div className="hidden lg:block">
        {count === 1 ? (
          <button
            type="button"
            onClick={() => openAt(0)}
            className="relative block h-[360px] w-full cursor-pointer overflow-hidden bg-background-secondary"
          >
            <Image
              src={safeImages[0]}
              alt={`${title} - 1`}
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
            {premiumBadge}
          </button>
        ) : count === 2 ? (
          <div className="grid h-[360px] grid-cols-2 gap-2">
            {safeImages.map((src, idx) => (
              <button
                key={`${src}-${idx}`}
                type="button"
                onClick={() => openAt(idx)}
                className="relative size-full cursor-pointer overflow-hidden bg-background-secondary"
              >
                <Image
                  src={src}
                  alt={`${title} - ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  sizes="50vw"
                  className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
                {idx === 0 ? premiumBadge : null}
              </button>
            ))}
          </div>
        ) : count === 3 ? (
          <div className="grid h-[360px] grid-cols-[1.35fr_1fr_1fr] gap-2">
            {safeImages.map((src, idx) => (
              <button
                key={`${src}-${idx}`}
                type="button"
                onClick={() => openAt(idx)}
                className="relative size-full cursor-pointer overflow-hidden bg-background-secondary"
              >
                <Image
                  src={src}
                  alt={`${title} - ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 1280px) 34vw, 450px"
                  className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
                {idx === 0 ? premiumBadge : null}
              </button>
            ))}
          </div>
        ) : (
          <div className="grid h-[360px] grid-cols-[1.2fr_1.1fr_0.75fr] gap-2">
            <button
              type="button"
              onClick={() => openAt(0)}
              className="relative size-full cursor-pointer overflow-hidden bg-background-secondary"
            >
              <Image
                src={safeImages[0]}
                alt={`${title} - 1`}
                fill
                priority
                sizes="(max-width: 1280px) 40vw, 480px"
                className="object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
              {premiumBadge}
            </button>

            <button
              type="button"
              onClick={() => openAt(1)}
              className="relative size-full cursor-pointer overflow-hidden bg-background-secondary"
            >
              <Image
                src={safeImages[1]}
                alt={`${title} - 2`}
                fill
                sizes="(max-width: 1280px) 35vw, 420px"
                className="object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </button>

            <div className="grid grid-rows-2 gap-2">
              <button
                type="button"
                onClick={() => openAt(2)}
                className="relative size-full cursor-pointer overflow-hidden bg-background-secondary"
              >
                <Image
                  src={safeImages[2]}
                  alt={`${title} - 3`}
                  fill
                  sizes="280px"
                  className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </button>

              <button
                type="button"
                onClick={() => openAt(3)}
                className="relative size-full cursor-pointer overflow-hidden bg-background-secondary"
              >
                <Image
                  src={safeImages[3]}
                  alt={`${title} - 4`}
                  fill
                  sizes="280px"
                  className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
                {remainingCount > 0 ? (
                  <span className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/55 px-3 text-center text-white transition-colors hover:bg-black/65">
                    <span className="text-xl font-bold leading-tight">
                      +{remainingCount}
                    </span>
                    <span className="mt-0.5 text-xs font-medium">
                      {showMoreLabel}
                    </span>
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        )}
      </div>

      <ListingGalleryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        images={safeImages}
        activeIndex={activeIndex}
        onSelectIndex={setActiveIndex}
        title={title}
        prevLabel={prevLabel}
        nextLabel={nextLabel}
      />
    </>
  );
}
