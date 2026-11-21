import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale } from "@/domain/geo/locales";
import { AuthScreen, type AuthScreenName } from "@/features/auth/auth-screen";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ reset?: string }>;
};

type AuthTitleKey =
  | "signInTitle"
  | "registerTitle"
  | "forgotTitle"
  | "verifyTitle"
  | "resetSentTitle"
  | "newPasswordTitle";

export function authPage(screen: AuthScreenName, titleKey: AuthTitleKey) {
  async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslations({ locale, namespace: "Auth" });
    return { title: { absolute: `${t(titleKey)} · GleeCars` } };
  }

  function Page({ params, searchParams }: PageProps) {
    return (
      <Suspense fallback={<div className="min-h-[50vh] bg-background-secondary" />}>
        <AuthContent params={params} searchParams={searchParams} />
      </Suspense>
    );
  }

  async function AuthContent({ params, searchParams }: PageProps) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    setRequestLocale(locale);
    const query = searchParams ? await searchParams : {};

    return (
      <AuthScreen screen={screen} passwordUpdated={screen === "signin" && query.reset === "1"} />
    );
  }

  return { generateMetadata, Page };
}
