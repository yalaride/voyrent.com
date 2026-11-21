import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale } from "@/domain/geo/locales";
import { ContactScreen } from "@/features/contact/contact-screen";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: { absolute: `${t("title")} · GleeCars` } };
}

export default function ContactPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-background-primary" />}>
      <ContactContent params={params} />
    </Suspense>
  );
}

async function ContactContent({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return <ContactScreen />;
}
