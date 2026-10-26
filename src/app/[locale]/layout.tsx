import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: {
    default: "GleeCars",
    template: "%s · GleeCars",
  },
  description: "Compare rental cars from local suppliers across cities, languages, and currencies.",
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
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" />}>
      <LocaleDocument params={params}>{children}</LocaleDocument>
    </Suspense>
  );
}

async function LocaleDocument({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale) || !isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const direction = textDirection(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DocumentLocale locale={locale} direction={direction} />
      <GoogleTagManager id={serverEnv.NEXT_PUBLIC_GTM_ID} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      {children}
    </NextIntlClientProvider>
  );
}
