"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const isLandingPage =
    pathname === "/" || /^\/[a-zA-Z]{2}(-[a-zA-Z]{2})?\/?$/.test(pathname);

  const isDealerPlansPage = pathname.includes("/dealer-plans");

  const isTransparentPage = isLandingPage || isDealerPlansPage;

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
