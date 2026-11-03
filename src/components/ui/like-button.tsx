"use client";

import * as React from "react";
import { Heart } from "lucide-react";

import { cn } from "cn";

export function LikeButton({
  label,
  likedLabel,
  initialLiked = false,
  className,
}: {
  label: string;
  likedLabel: string;
  initialLiked?: boolean;
  className?: string;
}) {
  const [liked, setLiked] = React.useState(initialLiked);

  return (
    <button
      type="button"
      aria-label={liked ? likedLabel : label}
      aria-pressed={liked}
      data-liked={liked}
      onClick={() => setLiked((current) => !current)}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-border-default bg-background-primary text-text-secondary shadow-small transition-colors hover:bg-background-secondary hover:text-danger focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ds-primary/40 data-[liked=true]:text-danger",
        className,
      )}
    >
      <Heart
        aria-hidden="true"
        className="size-5"
        fill={liked ? "currentColor" : "none"}
      />
    </button>
  );
}
