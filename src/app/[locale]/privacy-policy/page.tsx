import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ShieldIcon } from "@/components/icons/index";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export default async function PrivacyPage() {
  const t = await getTranslations("PrivacyPolicy");

  // 1. Replace bulletPoints & cookieRows with stable keys:
  const bulletPoints = [
    { id: "contactDetails", content: t("roadRules.bullets.contactDetails") },
    {
      id: "noCardStorage",
      content: t.rich("roadRules.bullets.noCardStorage", {
        strong: (chunks) => (
          <strong className="font-semibold text-text-primary">{chunks}</strong>
        ),
      }),
    },
    {
      id: "noCardThirdParty",
      content: t.rich("roadRules.bullets.noCardThirdParty", {
        strong: (chunks) => (
          <strong className="font-semibold text-text-primary">{chunks}</strong>
        ),
      }),
    },
    {
      id: "securityMeasures",
      content: t("roadRules.bullets.securityMeasures"),
    },
    { id: "correspondence", content: t("roadRules.bullets.correspondence") },
    { id: "surveys", content: t("roadRules.bullets.surveys") },
    { id: "ipAddress", content: t("roadRules.bullets.ipAddress") },
  ];

  const cookieRows = [
    {
      id: "essential",
      type: t("cookies.table.rows.essential.type"),
      purpose: t("cookies.table.rows.essential.purpose"),
    },
    {
      id: "analytics",
      type: t("cookies.table.rows.analytics.type"),
      purpose: t("cookies.table.rows.analytics.purpose"),
    },
    {
      id: "preferences",
      type: t("cookies.table.rows.preferences.type"),
      purpose: t("cookies.table.rows.preferences.purpose"),
    },
    {
      id: "marketing",
      type: t("cookies.table.rows.marketing.type"),
      purpose: t("cookies.table.rows.marketing.purpose"),
    },
  ];

  return (
    <div className="w-full flex-1 bg-background-primary font-sans text-text-primary">
      {/* Header / Hero Section */}
      <section className="w-full border-b border-border-default bg-background-secondary py-[var(--spacing-space-40)]">
        <LayoutWrapper>
          <div className="flex w-full flex-col items-start gap-[var(--spacing-space-16)]">
            <nav
              aria-label="Breadcrumb"
              className="text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-medium"
            >
              <Link
                href="/"
                className="text-text-secondary transition-colors hover:text-text-primary"
              >
                {t("breadcrumb.home")}
              </Link>
              <span className="text-text-secondary"> / </span>
              <span className="font-medium text-text-primary">
                {t("breadcrumb.current")}
              </span>
            </nav>

            <div className="flex w-full flex-col items-start gap-[var(--spacing-space-8)]">
              <h1 className="w-full text-[length:var(--text-h1)] leading-[var(--text-h1--line-height)] font-bold text-text-primary">
                {t("hero.title")}
              </h1>

              <p className="w-full text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal text-text-secondary">
                {t("hero.subtitle")}
              </p>
            </div>

            <p className="w-full text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-medium text-text-secondary">
              {t("hero.lastUpdated")}
            </p>
          </div>
        </LayoutWrapper>
      </section>

      {/* Main Content Area */}
      <LayoutWrapper>
        <main className="w-full bg-background-primary py-16">
          <div className="flex w-full flex-col items-start gap-[var(--spacing-space-40)]">
            {/* Introduction */}
            <section className="flex w-full flex-col items-start gap-[var(--spacing-space-8)]">
              <h2 className="w-full text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)] font-semibold text-text-primary">
                {t("introduction.title")}
              </h2>
              <div className="w-full space-y-[var(--spacing-space-16)] text-justify text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal text-text-secondary">
                <p>
                  {t.rich("introduction.p1", {
                    siteLink: (chunks) => (
                      <a
                        href="https://yalaride.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-link hover:underline"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
                <p>{t("introduction.p2")}</p>
                <p>{t("introduction.p3")}</p>
              </div>
            </section>

            {/* What to look for in your rental */}
            <section className="flex w-full flex-col items-start gap-[var(--spacing-space-8)]">
              <h2 className="w-full text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)] font-semibold text-text-primary">
                {t("rentalGuide.title")}
              </h2>
              <p className="w-full text-justify text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal text-text-secondary">
                {t("rentalGuide.description")}
              </p>
            </section>

            {/* Road rules worth memorizing */}
            <section className="flex w-full flex-col items-start gap-[var(--spacing-space-8)]">
              <h2 className="w-full text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)] font-semibold text-text-primary">
                {t("roadRules.title")}
              </h2>
              <div className="w-full space-y-[var(--spacing-space-16)] text-justify text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal text-text-secondary">
                <p>
                  {t.rich("roadRules.description", {
                    strong: (chunks) => (
                      <strong className="font-semibold text-text-primary">
                        {chunks}
                      </strong>
                    ),
                  })}
                </p>
                <ul className="list-disc space-y-[var(--spacing-space-8)] ps-[var(--spacing-space-20)] text-justify">
                  {bulletPoints.map((item) => (
                    <li key={item.id}>{item.content}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Cookies and Tracking Technologies */}
            <section className="flex w-full flex-col items-start gap-[var(--spacing-space-24)]">
              <div className="flex w-full flex-col items-start gap-[var(--spacing-space-8)]">
                <h2 className="w-full text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)] font-semibold text-text-primary">
                  {t("cookies.title")}
                </h2>
                <p className="w-full text-justify text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal text-text-secondary">
                  {t("cookies.description")}
                </p>
              </div>

              <div className="w-full overflow-x-auto rounded-[var(--radius-8)] border border-border-default">
                <table className="w-full border-collapse text-start">
                  <thead>
                    <tr className="border-b border-border-default bg-background-secondary text-[length:var(--text-body-small)] leading-[var(--text-body-small--line-height)] text-text-primary">
                      <th className="w-1/4 px-[var(--spacing-space-16)] py-[var(--spacing-space-12)] font-medium">
                        {t("cookies.table.headers.type")}
                      </th>
                      <th className="w-3/4 px-[var(--spacing-space-16)] py-[var(--spacing-space-12)] font-medium">
                        {t("cookies.table.headers.purpose")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default text-[length:var(--text-body-small)] leading-[var(--text-body-small--line-height)]">
                    {cookieRows.map((row, index) => (
                      <tr
                        key={row.type}
                        className={
                          index % 2 === 0
                            ? "bg-background-primary"
                            : "bg-background-secondary"
                        }
                      >
                        <td className="whitespace-nowrap px-[var(--spacing-space-16)] py-[var(--spacing-space-12)] font-medium text-text-primary">
                          {row.type}
                        </td>
                        <td className="px-[var(--spacing-space-16)] py-[var(--spacing-space-12)] text-text-secondary">
                          {row.purpose}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Payments */}
            <section className="flex w-full flex-col items-start gap-[var(--spacing-space-8)]">
              <h2 className="w-full text-[length:var(--text-h2)] leading-[var(--text-h2--line-height)] font-semibold text-text-primary">
                {t("payments.title")}
              </h2>
              <p className="w-full text-justify text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal text-text-secondary">
                {t("payments.description")}
              </p>

              <div className="mt-[var(--spacing-space-8)] flex w-full items-start gap-[var(--spacing-space-12)] rounded-[var(--radius-12)] border border-border-default bg-background-secondary p-[var(--spacing-space-16)] sm:items-center sm:p-[var(--spacing-space-20)]">
                <ShieldIcon
                  size={20}
                  strokeWidth={1.75}
                  className="mt-0.5 h-5 w-5 shrink-0 text-text-secondary sm:mt-0"
                />
                <p className="text-[length:var(--text-body-small)] leading-[var(--text-body-small--line-height)] text-text-secondary">
                  {t("payments.securityNote")}
                </p>
              </div>
            </section>
          </div>
        </main>
      </LayoutWrapper>
    </div>
  );
}
