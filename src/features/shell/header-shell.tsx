"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

interface HeaderShellProps {
  children: React.ReactNode;
  sticky?: boolean;
}

export function HeaderShell({ children, sticky = true }: HeaderShellProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Matches "/" or locale roots like "/en", "/ar", "/en-US", "/ar-AE"
  const isLandingPage =
    pathname === "/" || /^\/[a-zA-Z]{2}(-[a-zA-Z]{2})?(\/)?$/.test(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isLandingPage && !isScrolled;

  return (
    // <header> spans 100% full width for background blur & border
    <header
      data-transparent={isTransparent ? "true" : "false"}
      className={`group inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
        isLandingPage ? "fixed" : sticky ? "sticky" : "relative"
      } ${
        isTransparent
          ? "border-b border-transparent bg-transparent text-white"
          : "border-b border-border-default bg-background-primary/95 text-text-primary shadow-xs backdrop-blur"
      }`}
    >
      {/* LayoutWrapper constrains the inner nav content to your max width */}
      <LayoutWrapper>{children}</LayoutWrapper>
    </header>
  );
}
