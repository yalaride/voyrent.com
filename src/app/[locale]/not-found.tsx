import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("Errors");

  return (
    <div className="mx-auto max-w-lg px-4 py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary">{t("notFoundTitle")}</h1>
      <p className="mt-3 text-text-secondary">{t("notFoundBody")}</p>
      <Link
        href="/"
        className="mt-6 inline-flex text-sm font-medium text-link underline"
      >
        {t("home")}
      </Link>
    </div>
  );
}
