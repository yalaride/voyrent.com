import { getTranslations } from "next-intl/server";

import { FAMOUS_SEARCHES } from "@/domain/catalog/famous-searches";
import { catalogPath } from "@/domain/routing/rent-paths";
import { Link } from "@/i18n/navigation";

export async function FamousSearches({ city }: { city: string }) {
  const t = await getTranslations("Search");

  return (
    <div className="mt-4">
      <p className="text-sm text-text-secondary">{t("popular")}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {FAMOUS_SEARCHES.map((item) => (
          <li key={item.slug}>
            <Link
              href={catalogPath(city, item.query)}
              className="inline-flex rounded-full border border-border-default bg-background-primary px-3 py-1.5 text-sm text-text-primary hover:border-text-primary"
            >
              {t(`famous.${item.messageKey}`)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
