import Link from "next/link";

import LayoutWrapper from "@/components/layout/LayoutWrapper";

interface SectionBannerCtaProps {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}

export function SectionBannerCta({
  title,
  description,
  buttonLabel,
  href,
}: SectionBannerCtaProps) {
  return (
    <section className="w-full bg-background-primary py-[var(--spacing-space-20)]">
      <LayoutWrapper>
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start justify-between gap-[var(--spacing-space-24)] rounded-[var(--radius-16)] border border-border-default bg-background-section p-[var(--spacing-space-24)] md:flex-row md:items-center md:p-[var(--spacing-space-40)] lg:min-h-[142px] lg:gap-[60px]">
          <div className="flex w-full max-w-[558px] flex-col gap-[var(--spacing-space-8)] text-start">
            <h2 className="text-[length:var(--text-h3)] leading-[1.26] font-semibold tracking-[-0.02em] text-text-inverse">
              {title}
            </h2>
            <p className="text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-normal tracking-normal text-text-inverse">
              {description}
            </p>
          </div>

          <Link
            href={href}
            className="inline-flex h-[var(--spacing-dim-48)] w-fit shrink-0 items-center justify-center gap-[var(--spacing-space-10)] rounded-[var(--radius-999)] bg-primary px-[var(--spacing-space-24)] py-[var(--spacing-space-10)] text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-medium whitespace-nowrap text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {buttonLabel}
          </Link>
        </div>
      </LayoutWrapper>
    </section>
  );
}
