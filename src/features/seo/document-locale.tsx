"use client";

import { useLayoutEffect } from "react";

export function DocumentLocale({ locale, direction }: { locale: string; direction: "ltr" | "rtl" }) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  return null;
}
