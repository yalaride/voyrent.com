import { Link } from "@/i18n/navigation";

type CompanyEmptyStateProps = {
  title: string;
  body: string;
  actionLabel: string;
  actionHref: string;
};

export function CompanyEmptyState({
  title,
  body,
  actionLabel,
  actionHref,
}: CompanyEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-24)] border border-border-default bg-background-primary px-6 py-14 text-center">
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="max-w-md text-sm text-text-secondary">{body}</p>
      <Link
        href={actionHref}
        className="mt-2 inline-flex h-10 items-center justify-center rounded-full border border-primary px-5 text-sm font-medium text-primary no-underline transition-colors hover:bg-primary/5"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
