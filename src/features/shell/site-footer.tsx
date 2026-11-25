import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import LayoutWrapper from "@/components/layout/LayoutWrapper";

const SOCIALS = [
  { src: "/footer/facebook.svg", labelKey: "socialFacebook" as const },
  { src: "/footer/linkedin.svg", labelKey: "socialLinkedin" as const },
  { src: "/footer/instagram.svg", labelKey: "socialInstagram" as const },
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
    <footer className="mt-16 overflow-x-clip bg-background-section pt-20">
      <LayoutWrapper>
        {/* Main footer content — aligned directly to LayoutWrapper */}
        <div className="flex w-full flex-col gap-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:gap-10">
            {columns.map((column) => (
              <div key={column.key} className="flex min-w-0 flex-col gap-2.5">
                <h2 className="wrap-break-word text-2xl font-semibold text-text-inverse ltr:tracking-[-0.02em]">
                  {column.title}
                </h2>
                <ul className="flex flex-col gap-1.5 text-base font-medium leading-normal text-text-secondary">
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

            <div className="flex min-w-0 flex-col gap-2.5">
              <h2 className="wrap-break-word text-2xl font-semibold text-text-inverse ltr:tracking-[-0.02em]">
                {t("supportTitle")}
              </h2>
              <ul className="flex flex-col gap-1.5 text-base font-medium leading-normal text-text-secondary">
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
              <ul className="mt-1 flex gap-3" aria-label={t("socialLabel")}>
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
                        className="size-8"
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-base font-medium leading-normal text-text-secondary">
                {t("copyright")}
              </p>
              <ul
                className="flex items-center gap-2"
                aria-label={t("paymentsLabel")}
              >
                {payments.map((payment) => (
                  <li key={payment.src} className="shrink-0">
                    <Image
                      src={payment.src}
                      alt={payment.alt}
                      width={70}
                      height={36}
                      sizes="70px"
                      className="h-9 w-17.5"
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-px w-full bg-text-secondary/40" aria-hidden />
          </div>
        </div>
      </LayoutWrapper>

      {/* Tight vertical spacing so the border line sits close above VoyRent */}
      <LayoutWrapper>
        <div
          aria-hidden
          dir="ltr"
          className="@container flex w-full select-none justify-center overflow-hidden"
        >
          <p className="translate-y-[5%] whitespace-nowrap bg-linear-to-b from-text-inverse/20 to-transparent bg-clip-text text-center text-[21.5cqw] font-medium leading-[0.82] tracking-[-0.02em] text-transparent">
            VoyRent
          </p>
        </div>
      </LayoutWrapper>
    </footer>
  );
}
