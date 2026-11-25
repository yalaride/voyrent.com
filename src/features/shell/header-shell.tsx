"use client";

import { useSyncExternalStore } from "react";
import { useParams, usePathname } from "next/navigation";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

interface HeaderShellProps {
  children: React.ReactNode;
  sticky?: boolean;
}

const emptySubscribe = () => () => {};

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getScrollSnapshot() {
  return window.scrollY > 20;
}

function getServerSnapshot() {
  return false;
}

export function HeaderShell({ children }: HeaderShellProps) {
  const pathname = usePathname() ?? "/";
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "";

  // Strip locale if present via [locale] route param (e.g. /ar/rent-a-car-riyadh -> /rent-a-car-riyadh)
  const normalizedPath =
    locale && (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
      ? pathname.slice(locale.length + 1) || "/"
      : pathname;

  const isLandingPage =
    normalizedPath === "/" ||
    /^\/[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,4})?\/?$/.test(normalizedPath);

  // Matches /rent-a-car-riyadh, /en/rent-a-car-riyadh, /ar/rent-a-car-jeddah, etc.
  const isRegionLandingPage =
    /^(\/[a-zA-Z]{2,3}(-[a-zA-Z0-9]{2,4})?)?\/rent-a-car-[^/]+\/?$/.test(
      normalizedPath,
    );

  const isDealerPlansPage = normalizedPath.includes("/dealer-plans");

  const isTransparentPage =
    isLandingPage || isRegionLandingPage || isDealerPlansPage;

  const isScrolled = useSyncExternalStore(
    isTransparentPage ? subscribeToScroll : emptySubscribe,
    isTransparentPage ? getScrollSnapshot : getServerSnapshot,
    getServerSnapshot,
  );

  const isTransparent = isTransparentPage && !isScrolled;

  return (
    <header
      data-transparent={isTransparent ? "true" : "false"}
      className={`group inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
        isTransparentPage ? "absolute" : "relative"
      } ${
        isTransparent
          ? "border-b border-transparent bg-transparent text-white"
          : "border-b border-border-default bg-background-primary/95 text-text-primary shadow-xs backdrop-blur"
      }`}
    >
      <LayoutWrapper>{children}</LayoutWrapper>
    </header>
  );
}
