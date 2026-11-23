"use client";

import * as React from "react";
import { Info } from "lucide-react";

export function InfoTooltip({
  content,
  label,
  align = "center",
}: {
  content: string;
  label: string;
  align?: "start" | "center" | "end";
}) {
  const [open, setOpen] = React.useState(false);

  const alignClass =
    align === "start"
      ? "start-0"
      : align === "end"
        ? "end-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <span
      className="relative inline-flex shrink-0 items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Info className="size-4 shrink-0" aria-hidden="true" />
      </button>

      {open ? (
        <span
          role="tooltip"
          className={`pointer-events-none absolute bottom-full z-30 mb-2 w-56 rounded-[var(--radius-12)] border border-border-default bg-text-primary px-3 py-2 text-start text-xs font-normal leading-relaxed text-text-inverse shadow-[var(--shadow-medium)] ${alignClass}`}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
