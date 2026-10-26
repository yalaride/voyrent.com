import type { ReactNode } from "react";
import { Noto_Sans_Arabic, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-latin",
  display: "swap",
});

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${arabic.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
