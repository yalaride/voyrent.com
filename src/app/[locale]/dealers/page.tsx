import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale } from "@/domain/geo/locales";
import { AppShell } from "@/features/shell/app-shell";
import { requestLocale } from "@/server/seo/request-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();

  if (!locale) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: { absolute: `${t("dealersTitle")} · GleeCars` } };
}

export default function DealersPage({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <Suspense fallback={null}>
      <DealersContent params={params} />
    </Suspense>
  );
}

async function DealersContent({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations("Dealers");

  return (
    <AppShell locale={locale}>
      <section className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-4xl font-semibold tracking-tight text-text-primary">{t("title")}</h1>
        <p className="mt-4 text-lg leading-8 text-text-secondary">{t("body")}</p>
      </section>
    </AppShell>
  );
}
