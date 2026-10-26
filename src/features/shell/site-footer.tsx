import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-foreground">GleeCars</p>
        <p>{t("summary")}</p>
      </div>
    </footer>
  );
}
