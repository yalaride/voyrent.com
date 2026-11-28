import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import LayoutWrapper from "@/components/layout/LayoutWrapper";

const SOCIALS = [
  {
    src: "/footer/facebook.svg",
    labelKey: "socialFacebook" as const,
    iconClassName: "size-8",
  },
  {
    src: "/footer/linkedin.svg",
    labelKey: "socialLinkedin" as const,
    iconClassName: "size-[26.67px]",
  },
  {
    src: "/footer/instagram.svg",
    labelKey: "socialInstagram" as const,
    iconClassName: "size-8",
  },
] as const;

type FooterItem = {
  label: string;
  href?: string;
};

type FooterColumn = {
  key: string;
  title: string;
  items: FooterItem[];
};

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  const columns: FooterColumn[] = [
    {
      key: "resources",
      title: t("resourcesTitle"),
      items: [
        { label: t("usedCarsDubai") },
        { label: t("newCarsDubai") },
        { label: t("sellMyCar") },
        { label: t("dealerDirectory") },
        { label: t("carBuyingGuide") },
      ],
    },
    {
      key: "company",
      title: t("companyTitle"),
      items: [
        { label: t("aboutUs") },
        { label: t("contactUs"), href: "/contact" },
        { label: t("joinAsDealer"), href: "/dealer-plans" },
        { label: t("dealerLogin") },
      ],
    },
    {
      key: "legal",
      title: t("legalTitle"),
      items: [
        { label: t("privacyPolicy"), href: "/privacy-policy" },
        { label: t("termsConditions") },
        { label: t("cookiePolicy") },
      ],
    },
  ];

  const payments = [
    { src: "/footer/payment-visa.webp", alt: t("paymentVisa") },
    { src: "/footer/payment-mastercard.webp", alt: t("paymentMastercard") },
    { src: "/footer/payment-unionpay.webp", alt: t("paymentUnionPay") },
  ] as const;

  return (
    <footer className="mt-16 overflow-x-clip bg-background-section pt-[var(--spacing-space-40)] lg:pt-[60px]">
      <LayoutWrapper>
        {/* Main footer content — aligned directly to LayoutWrapper */}
        <div className="flex w-full flex-col gap-[60px] lg:gap-[var(--spacing-space-40)]">
          <div className="grid grid-cols-1 gap-[var(--spacing-space-40)] sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
            {columns.map((column) => (
              <div
                key={column.key}
                className="flex min-w-0 flex-col gap-[var(--spacing-space-10)]"
              >
                <h2 className="wrap-break-word text-[length:var(--text-h4)] font-semibold leading-[1.26] text-text-inverse ltr:tracking-[-0.02em]">
                  {column.title}
                </h2>
                <ul className="flex flex-col gap-[var(--spacing-space-6)] text-[length:var(--text-body)] font-medium leading-[1.5] text-text-secondary">
                  {column.items.map((item) => (
                    <li key={item.label} className="wrap-break-word">
                      {item.href ? (
                        <Link
                          href={item.href}
                          prefetch={false}
                          className="transition-colors hover:text-text-inverse"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        item.label
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex min-w-0 flex-col gap-[var(--spacing-space-10)]">
              <h2 className="wrap-break-word text-[length:var(--text-h4)] font-semibold leading-[1.26] text-text-inverse ltr:tracking-[-0.02em]">
                {t("supportTitle")}
              </h2>
              <ul className="flex flex-col gap-[var(--spacing-space-6)] text-[length:var(--text-body)] font-medium leading-[1.5] text-text-secondary">
                <li>
                  <span dir="ltr" className="inline-block break-all">
                    {t("contactEmail")}
                  </span>
                </li>
                <li>
                  <span dir="ltr" className="inline-block whitespace-nowrap">
                    {t("contactPhone")}
                  </span>
                </li>
              </ul>
              <ul
                className="flex gap-[var(--spacing-space-12)]"
                aria-label={t("socialLabel")}
              >
                {SOCIALS.map((social) => (
                  <li key={social.src}>
                    <span
                      className="inline-flex size-8 items-center justify-center"
                      role="img"
                      aria-label={t(social.labelKey)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG icons */}
                      <img
                        src={social.src}
                        alt=""
                        width={32}
                        height={32}
                        loading="lazy"
                        decoding="async"
                        className={social.iconClassName}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-col gap-[var(--spacing-space-20)]">
              <div className="flex flex-col-reverse gap-[var(--spacing-space-20)] sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[length:var(--text-body)] font-medium leading-[1.5] text-text-secondary">
                  {t("copyright")}
                </p>
                <ul
                  className="flex items-center gap-[var(--spacing-space-8)]"
                  aria-label={t("paymentsLabel")}
                >
                  {payments.map((payment) => (
                    <li
                      key={payment.src}
                      className="h-9 w-[70px] shrink-0 overflow-hidden rounded-[6px] border border-text-secondary"
                    >
                      <Image
                        src={payment.src}
                        alt={payment.alt}
                        width={70}
                        height={36}
                        sizes="70px"
                        className="h-full w-full object-cover"
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="h-px w-full bg-text-secondary/40" aria-hidden />
            </div>

            <div
              aria-hidden
              dir="ltr"
              className="@container flex w-full select-none justify-center overflow-y-clip pt-5 md:pt-7 lg:pt-9"
            >
              <p className="-mb-[0.009em] translate-y-[5%] whitespace-nowrap bg-linear-to-b from-text-inverse/20 to-transparent bg-clip-text text-center font-sans text-[27cqw] font-medium leading-[0.82] tracking-[-0.02em] text-transparent">
                Vo<span className="text-[0.70em]">Y</span>Rent
              </p>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    </footer>
  );
}
