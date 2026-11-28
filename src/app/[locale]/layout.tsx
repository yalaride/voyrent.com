import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Google_Sans_Flex, Noto_Sans_Arabic } from "next/font/google";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

import { isLocale, textDirection } from "@/domain/geo/locales";
import { DocumentLocale } from "@/features/seo/document-locale";
import { GoogleTagManager } from "@/features/seo/google-tag-manager";
import { routing } from "@/i18n/routing";
import { serverEnv } from "@/lib/config/env";
import { organizationJsonLd, rootVerification } from "@/server/seo/metadata";
import { siteOrigin } from "@/server/seo/origins";
import "../globals.css";

const sans = Google_Sans_Flex({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans-latin",
  display: "swap",
  adjustFontFallback: false,
});

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: {
    default: "GleeCars",
    template: "%s · GleeCars",
  },
  description:
    "Compare rental cars from local suppliers across cities, languages, and currencies.",
  applicationName: "GleeCars",
  verification: rootVerification(),
  robots: { index: true, follow: true },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${arabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <Suspense fallback={<div className="min-h-dvh bg-background" />}>
          <LocaleDocument params={params}>{children}</LocaleDocument>
        </Suspense>
      </body>
    </html>
  );
}

async function LocaleDocument({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  // Unknown segments still render the page, which calls notFound() inside its own Suspense.
  // Throwing here sits outside that boundary and fails instant validation.
  const locale =
    hasLocale(routing.locales, requested) && isLocale(requested)
      ? requested
      : routing.defaultLocale;

  setRequestLocale(locale);
  const messages = await getMessages();
  const direction = textDirection(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DocumentLocale locale={locale} direction={direction} />
      <GoogleTagManager id={serverEnv.NEXT_PUBLIC_GTM_ID} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />
      {children}
    </NextIntlClientProvider>
  );
}
