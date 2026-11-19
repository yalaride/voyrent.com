"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

function useIsClient() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ListingGalleryModal({
  open,
  onClose,
  images,
  activeIndex,
  onSelectIndex,
  title,
  prevLabel,
  nextLabel,
}: {
  open: boolean;
  onClose: () => void;
  images: string[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  title: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const isClient = useIsClient();

  const handlePrev = React.useCallback(() => {
    onSelectIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  }, [activeIndex, images.length, onSelectIndex]);

  const handleNext = React.useCallback(() => {
    onSelectIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, images.length, onSelectIndex]);

  React.useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, handlePrev, handleNext]);

  if (!open || !isClient || images.length === 0) return null;

  const safeIndex = Math.min(activeIndex, images.length - 1);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[80] flex flex-col bg-black/90 p-4 animate-in fade-in-0 duration-200 sm:p-6"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white">
        <span className="text-sm font-medium">
          {safeIndex + 1} / {images.length}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onClose}
          aria-label="Close"
          className="border-white/20 bg-black/40 text-white hover:bg-white/15 hover:text-white"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Main Image */}
      <div className="relative my-4 flex min-h-0 flex-1 items-center justify-center">
        {images.length > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handlePrev}
            aria-label={prevLabel}
            className="absolute start-2 z-10 border-white/20 bg-black/50 text-white hover:bg-white/20 hover:text-white sm:start-4"
          >
            <ChevronLeftIcon className="size-5 rtl:rotate-180" />
          </Button>
        ) : null}

        <div className="relative h-full w-full max-w-5xl">
          <Image
            src={images[safeIndex]}
            alt={`${title} - ${safeIndex + 1}`}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>

        {images.length > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleNext}
            aria-label={nextLabel}
            className="absolute end-2 z-10 border-white/20 bg-black/50 text-white hover:bg-white/20 hover:text-white sm:end-4"
          >
            <ChevronRightIcon className="size-5 rtl:rotate-180" />
          </Button>
        ) : null}
      </div>

      {/* Thumbnails */}
      {images.length > 1 ? (
        <div className="mx-auto flex max-w-4xl items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => onSelectIndex(idx)}
              aria-label={`${title} - ${idx + 1}`}
              className={`relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-[var(--radius-8)] transition-opacity ${
                idx === safeIndex
                  ? "ring-2 ring-white"
                  : "opacity-55 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
