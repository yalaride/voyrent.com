import { getTranslations } from "next-intl/server";

const TRUST_ITEMS = [
  { titleKey: "rangeTitle", bodyKey: "rangeBody" },
  { titleKey: "priceTitle", bodyKey: "priceBody" },
  { titleKey: "marketTitle", bodyKey: "marketBody" },
] as const;

interface TrustSectionProps {
  className?: string;
}

export async function TrustSection({ className }: TrustSectionProps) {
  const t = await getTranslations("Trust");

  return (
    <section className={className}>
      <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-text-primary">
        {t("title")}
      </h2>
      <ul className="mt-4 grid gap-4 md:grid-cols-3">
        {TRUST_ITEMS.map((item) => (
          <li
            key={item.titleKey}
            className="rounded-2xl border border-border-default bg-background-primary p-5"
          >
            <h3 className="font-semibold text-text-primary">
              {t(item.titleKey)}
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              {t(item.bodyKey)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
