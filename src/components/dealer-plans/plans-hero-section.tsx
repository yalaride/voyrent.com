"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const JOB_TITLE_KEYS = [
  "ownerFounder",
  "fleetManager",
  "operationsManager",
  "salesManager",
  "marketingManager",
] as const;

const FLEET_SIZE_KEYS = [
  "1to5",
  "6to20",
  "21to50",
  "51to100",
  "100plus",
] as const;

const DIAL_CODES = [
  { code: "+971", countryKey: "uae" },
  { code: "+966", countryKey: "saudiArabia" },
  { code: "+92", countryKey: "pakistan" },
  { code: "+44", countryKey: "uk" },
  { code: "+1", countryKey: "us" },
] as const;

const COUNTRY_CITIES = {
  uae: ["dubai", "abuDhabi", "sharjah", "ajman"],
  saudiArabia: ["riyadh", "jeddah", "dammam"],
  pakistan: ["karachi", "lahore", "islamabad"],
  uk: ["london", "manchester", "birmingham"],
} as const;

type CountryKey = keyof typeof COUNTRY_CITIES;

export function PlansHeroSection() {
  const t = useTranslations("DealerPlans");

  const [yourName, setYourName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState<string>(JOB_TITLE_KEYS[0]);
  const [fleetSize, setFleetSize] = useState<string>(FLEET_SIZE_KEYS[0]);
  const [dialCode, setDialCode] = useState<string>("+92");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<CountryKey>("uae");
  const [city, setCity] = useState<string>(COUNTRY_CITIES.uae[0]);
  const [submitted, setSubmitted] = useState(false);

  const availableCities = COUNTRY_CITIES[country];

  const handleCountryChange = (nextCountry: CountryKey) => {
    setCountry(nextCountry);
    setCity(COUNTRY_CITIES[nextCountry][0]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    // Replace with your API / server action call
  };

  return (
    <section className="relative w-full bg-background-primary">
      {/* Full-width Hero Background (520px on desktop) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[440px] overflow-hidden md:h-[490px] lg:h-[520px]">
        <Image
          src="/dealer-plans/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#00000080]" />
      </div>

      {/* Inner Content Constrained by LayoutWrapper */}
      <LayoutWrapper>
        <div className="relative z-10 flex w-full flex-col justify-between gap-8 pt-24 pb-10 md:pt-28 lg:flex-row lg:items-start lg:gap-12 lg:pt-[131px] lg:pb-12">
          {/* Left Hero Copy (589px max width) */}
          <div className="w-full text-start lg:max-w-[589px] lg:pt-[88px]">
            <h1 className="text-[36px] leading-[1.1] font-semibold tracking-[-0.02em] text-text-inverse md:text-[48px] lg:text-[60px]">
              {t("hero.title")}
            </h1>
            <p className="mt-4 max-w-[589px] text-[16px] leading-[1.5] font-normal text-text-inverse/90">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Right Form Card (571px width, overlaps bottom of 520px hero) */}
          <div className="w-full shrink-0 rounded-[var(--radius-16)] bg-background-primary px-[var(--spacing-space-24)] py-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)] lg:w-[571px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <h2 className="text-start text-[24px] leading-[1.25] font-semibold tracking-[-0.02em] text-text-primary">
                {t("form.heading")}
              </h2>

              <div className="grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2">
                {/* Your Name */}
                <FloatingField
                  label={t("form.fields.yourName.label")}
                  htmlFor="yourName"
                >
                  <Input
                    id="yourName"
                    type="text"
                    required
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    placeholder={t("form.fields.yourName.placeholder")}
                    className="h-full border-0 bg-transparent p-0 text-[16px] leading-[1.5] text-text-primary shadow-none placeholder:text-text-secondary/70 focus-visible:ring-0 md:text-[16px]"
                  />
                </FloatingField>

                {/* Company Name */}
                <FloatingField
                  label={t("form.fields.companyName.label")}
                  htmlFor="companyName"
                >
                  <Input
                    id="companyName"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={t("form.fields.companyName.placeholder")}
                    className="h-full border-0 bg-transparent p-0 text-[16px] leading-[1.5] text-text-primary shadow-none placeholder:text-text-secondary/70 focus-visible:ring-0 md:text-[16px]"
                  />
                </FloatingField>

                {/* Job Title (DropdownMenu Portal) */}
                <FloatingDropdown
                  label={t("form.fields.jobTitle.label")}
                  value={t(`form.options.jobTitles.${jobTitle}`)}
                >
                  {JOB_TITLE_KEYS.map((key) => (
                    <DropdownMenuItem
                      key={key}
                      onSelect={() => setJobTitle(key)}
                      className="cursor-pointer py-2 text-start text-sm"
                    >
                      {t(`form.options.jobTitles.${key}`)}
                    </DropdownMenuItem>
                  ))}
                </FloatingDropdown>

                {/* Fleet Size (DropdownMenu Portal) */}
                <FloatingDropdown
                  label={t("form.fields.fleetSize.label")}
                  value={t(`form.options.fleetSizes.${fleetSize}`)}
                >
                  {FLEET_SIZE_KEYS.map((key) => (
                    <DropdownMenuItem
                      key={key}
                      onSelect={() => setFleetSize(key)}
                      className="cursor-pointer py-2 text-start text-sm"
                    >
                      {t(`form.options.fleetSizes.${key}`)}
                    </DropdownMenuItem>
                  ))}
                </FloatingDropdown>

                {/* Contact No (Dial Code Portal + Input) */}
                <FloatingField
                  label={t("form.fields.contactNo.label")}
                  htmlFor="contactNo"
                >
                  <div className="flex h-full w-full items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-[16px] leading-[1.5] text-text-secondary outline-none hover:text-text-primary"
                        >
                          <span dir="ltr">{dialCode}</span>
                          <ChevronDown className="size-4 text-text-secondary" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-44 bg-background-primary"
                      >
                        {DIAL_CODES.map((item) => (
                          <DropdownMenuItem
                            key={item.code}
                            onSelect={() => setDialCode(item.code)}
                            className="flex cursor-pointer items-center justify-between py-2 text-sm"
                          >
                            <span>
                              {t(`form.options.countries.${item.countryKey}`)}
                            </span>
                            <span dir="ltr" className="text-text-secondary">
                              {item.code}
                            </span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Input
                      id="contactNo"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("form.fields.contactNo.placeholder")}
                      className="h-full border-0 bg-transparent p-0 text-[16px] leading-[1.5] text-text-primary shadow-none placeholder:text-text-secondary/70 focus-visible:ring-0 md:text-[16px]"
                    />
                  </div>
                </FloatingField>

                {/* Email Address */}
                <FloatingField
                  label={t("form.fields.email.label")}
                  htmlFor="emailAddress"
                >
                  <Input
                    id="emailAddress"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("form.fields.email.placeholder")}
                    className="h-full border-0 bg-transparent p-0 text-[16px] leading-[1.5] text-text-primary shadow-none placeholder:text-text-secondary/70 focus-visible:ring-0 md:text-[16px]"
                  />
                </FloatingField>

                {/* Country (DropdownMenu Portal) */}
                <FloatingDropdown
                  label={t("form.fields.country.label")}
                  value={t(`form.options.countries.${country}`)}
                >
                  {(Object.keys(COUNTRY_CITIES) as CountryKey[]).map((key) => (
                    <DropdownMenuItem
                      key={key}
                      onSelect={() => handleCountryChange(key)}
                      className="cursor-pointer py-2 text-start text-sm"
                    >
                      {t(`form.options.countries.${key}`)}
                    </DropdownMenuItem>
                  ))}
                </FloatingDropdown>

                {/* City (DropdownMenu Portal - dependent on Country) */}
                <FloatingDropdown
                  label={t("form.fields.city.label")}
                  value={t(`form.options.cities.${city}`)}
                >
                  {availableCities.map((cityKey) => (
                    <DropdownMenuItem
                      key={cityKey}
                      onSelect={() => setCity(cityKey)}
                      className="cursor-pointer py-2 text-start text-sm"
                    >
                      {t(`form.options.cities.${cityKey}`)}
                    </DropdownMenuItem>
                  ))}
                </FloatingDropdown>
              </div>

              {submitted && (
                <p className="text-start text-sm font-medium text-success">
                  {t("form.successMessage")}
                </p>
              )}

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
              >
                {t("form.submit")}
              </Button>
            </form>
          </div>
        </div>
      </LayoutWrapper>
    </section>
  );
}

function FloatingField({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[52px] w-full items-center rounded-[var(--radius-8)] border border-border-default bg-background-primary px-[var(--spacing-space-20)] py-[var(--spacing-space-10)] transition-colors focus-within:border-primary",
        className,
      )}
    >
      <Label
        htmlFor={htmlFor}
        className="absolute -top-2 start-4 bg-background-primary px-1 text-[12px] leading-[1.1] font-normal text-text-primary"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

function FloatingDropdown({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <FloatingField label={label}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-full w-full cursor-pointer items-center justify-between gap-2 text-start text-[16px] leading-[1.5] text-text-secondary outline-none hover:text-text-primary"
          >
            <span className="truncate">{value}</span>
            <ChevronDown className="size-4 shrink-0 text-text-secondary" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-background-primary">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </FloatingField>
  );
}
