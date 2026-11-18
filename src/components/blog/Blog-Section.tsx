import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/icons";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export interface BlogPostItem {
  slug: string;
  title: string;
  readMinutes: number;
  publishedLabel: string;
  href: string;
  image: string;
}

interface BlogSectionProps {
  posts?: BlogPostItem[];
  viewAllHref?: string;
}

export async function BlogSection({
  posts,
  viewAllHref = "/blog",
}: BlogSectionProps) {
  const t = await getTranslations("Blog");

  const items: BlogPostItem[] =
    posts && posts.length > 0
      ? posts.slice(0, 3)
      : [
          {
            slug: "how-to-buy-a-used-car-without-overpaying",
            title: t("fallbackPosts.post1Title"),
            readMinutes: 1,
            publishedLabel: t("fallbackPosts.post1Date"),
            href: "/blog/how-to-buy-a-used-car-without-overpaying",
            image: "/blog/blog1.jpg",
          },
          {
            slug: "understanding-auto-loans",
            title: t("fallbackPosts.post2Title"),
            readMinutes: 1,
            publishedLabel: t("fallbackPosts.post2Date"),
            href: "/blog/understanding-auto-loans",
            image: "/blog/blog2.jpg",
          },
          {
            slug: "used-car-buying-checklist",
            title: t("fallbackPosts.post3Title"),
            readMinutes: 1,
            publishedLabel: t("fallbackPosts.post3Date"),
            href: "/blog/used-car-buying-checklist",
            image: "/blog/blog3.jpg",
          },
        ];

  return (
    <LayoutWrapper>
      <section className="flex w-full flex-col gap-8 pt-[var(--spacing-space-20)] pb-12 sm:gap-10 lg:min-h-[519px] lg:pb-[var(--spacing-space-80)]">
        {/* Heading Section: stacked on mobile, side-by-side on tablet & desktop */}
        <div className="flex w-full flex-col justify-between gap-4 sm:min-h-[101px] sm:flex-row sm:items-end sm:gap-2.5">
          {/* Title & Subtitle Container */}
          <div className="flex max-w-[1165px] flex-1 flex-col gap-2.5">
            <h2 className="text-[24px] font-semibold leading-[1.2] text-text-primary ltr:tracking-[-0.02em] sm:text-[36px]">
              {t("title")}
            </h2>
            <p className="max-w-[530px] text-base font-normal leading-[1.5] text-text-secondary">
              {t("subtitle")}
            </p>
          </div>

          {/* View All Button */}
          <Button
            variant="outline-brand"
            size="sm"
            className="w-fit shrink-0 rounded-full"
            asChild
          >
            <Link href={viewAllHref}>
              <span>{t("viewAll")}</span>
              <ArrowRightIcon className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>

        {/* Cards: horizontal touch slider on mobile & tablet (< lg), 3-col grid on desktop (lg+) */}
        <ul className="flex w-full touch-pan-x snap-x snap-mandatory gap-[var(--spacing-space-16)] overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:overflow-visible">
          {items.map((post) => (
            <li
              key={post.slug}
              className="h-[278px] w-full shrink-0 snap-start sm:w-[416px] lg:w-auto"
            >
              <Link
                href={post.href}
                className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[var(--radius-24)] bg-background-section px-6 pt-6 pb-[var(--spacing-space-20)] sm:px-8 sm:pt-8"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) 416px, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Top & Bottom Scrim for White Text Contrast */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.12)_48%,rgba(0,0,0,0.72)_100%)]"
                />

                {/* Card Title: max-w 352, min-h 60 */}
                <h3 className="relative z-10 line-clamp-2 min-h-[60px] max-w-[352px] text-[22px] font-semibold leading-[1.25] text-text-inverse ltr:tracking-[-0.02em] sm:text-[24px]">
                  {post.title}
                </h3>

                {/* Bottom Meta Row: h-32, justify-between */}
                <div className="relative z-10 flex h-8 w-full items-center justify-between gap-2">
                  <span className="truncate text-base font-normal leading-[1.5] text-text-inverse">
                    {t("readTime", { minutes: post.readMinutes })} •{" "}
                    {post.publishedLabel}
                  </span>
                  <ArrowRightIcon className="size-5 shrink-0 text-text-inverse transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </LayoutWrapper>
  );
}
