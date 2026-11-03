import Image from "next/image";
import { getTranslations } from "next-intl/server";

const PAYMENTS = [
  { src: "/footer/payment-visa.webp", alt: "Visa" },
  { src: "/footer/payment-mastercard.webp", alt: "Mastercard" },
  { src: "/footer/payment-unionpay.webp", alt: "UnionPay" },
] as const;

const SOCIALS = [
  { src: "/footer/facebook.svg", labelKey: "socialFacebook" as const },
  { src: "/footer/linkedin.svg", labelKey: "socialLinkedin" as const },
  { src: "/footer/instagram.svg", labelKey: "socialInstagram" as const },
] as const;

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  const columns = [
    {
      title: t("resourcesTitle"),
      items: [
        t("usedCarsDubai"),
        t("newCarsDubai"),
        t("sellMyCar"),
        t("dealerDirectory"),
        t("carBuyingGuide"),
      ],
    },
    {
      title: t("companyTitle"),
      items: [t("aboutUs"), t("contactUs"), t("joinAsDealer"), t("dealerLogin")],
    },
    {
      title: t("legalTitle"),
      items: [t("privacyPolicy"), t("termsConditions"), t("cookiePolicy")],
    },
  ] as const;

  return (
    <footer className="mt-16 overflow-x-clip bg-[#172746] pt-15">
      {/* Main footer content — columns, copyright, payments, stroke */}
      <div className="mx-auto flex w-full max-w-360 flex-col gap-10 px-5 sm:px-10 lg:px-20">
        <div className="flex flex-col gap-10 sm:flex-row sm:flex-wrap sm:justify-between lg:flex-nowrap lg:items-start">
          {columns.map((column) => (
            <div key={column.title} className="flex min-w-38 flex-col gap-2.5">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white">{column.title}</h2>
              <ul className="flex flex-col gap-1.5 text-base font-medium leading-normal text-[#667085]">
               
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-2.5">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white">{t("supportTitle")}</h2>
            <ul className="flex flex-col gap-1.5 text-base font-medium leading-normal text-[#667085]">
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

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base font-medium leading-normal text-[#667085]">{t("copyright")}</p>
            <ul className="flex items-center gap-2" aria-label={t("paymentsLabel")}>
              {PAYMENTS.map((payment) => (
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
          <div className="h-px w-full bg-[#667085]/40" aria-hidden />
        </div>
      </div>

      {/* Brand wordmark — always below the stroke, never behind other content */}
      <div
        aria-hidden
        className="flex w-full select-none justify-center overflow-hidden"
      >
        <p className="whitespace-nowrap bg-linear-to-b from-white/20 to-transparent bg-clip-text text-center text-[clamp(3.75rem,21.8vw,19.625rem)] font-medium leading-none tracking-[-0.02em] text-transparent">
          GleeCars
        </p>
      </div>
    </footer>
  );
}
