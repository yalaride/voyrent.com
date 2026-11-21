"use client";

import { Check, Mail, Phone } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactScreen() {
  const t = useTranslations("Contact");
  const footer = useTranslations("Footer");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const name = String(data.get("name") ?? "");
    const message = String(data.get("message") ?? "");
    if (name.trim().length < 2) {
      setError(t("nameShort"));
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError(t("emailInvalid"));
      return;
    }
    if (message.trim().length < 8) {
      setError(t("messageShort"));
      return;
    }
    setError("");
    setSent(true);
  }

  const email = footer("contactEmail");
  const phone = footer("contactPhone");

  return (
    <section className="bg-background-primary px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid w-full max-w-5xl items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-text-secondary">{t("body")}</p>
          <div className="mt-10 max-w-md border-y border-border-subtle">
            <ContactRow label={t("emailLabel")} href={`mailto:${email}`} icon={<Mail />}>
              {email}
            </ContactRow>
            <ContactRow
              label={t("phoneLabel")}
              href={`tel:${phone.replace(/\s/g, "")}`}
              icon={<Phone />}
            >
              {phone}
            </ContactRow>
          </div>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-background-primary p-6 sm:p-8">
          {sent ? (
            <div className="flex items-start gap-3">
              <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <p className="text-base leading-7 text-text-primary">{t("success")}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t("name")}>
                  <Input name="name" required autoComplete="name" className={fieldClass} />
                </Field>
                <Field label={t("email")}>
                  <Input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={fieldClass}
                  />
                </Field>
              </div>
              <Field label={t("phone")}>
                <Input name="phone" type="tel" autoComplete="tel" className={fieldClass} />
              </Field>
              <Field label={t("message")}>
                <Textarea name="message" required rows={6} className={messageClass} />
              </Field>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" className="h-11 w-full sm:w-auto sm:px-8">
                {t("submit")}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const fieldClass =
  "mt-1.5 h-11 rounded-xl border-border-default bg-background-primary px-3 text-sm shadow-none";
const messageClass =
  "mt-1.5 min-h-36 rounded-xl border-border-default bg-background-primary px-3 py-3 text-sm shadow-none";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-text-primary">
      {label}
      {children}
    </label>
  );
}

function ContactRow({
  label,
  href,
  icon,
  children,
}: {
  label: string;
  href: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border-subtle py-4 last:border-b-0">
      <span className="text-primary [&_svg]:size-4" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-secondary">{label}</p>
        <a className="block truncate text-sm font-medium text-text-primary hover:text-primary" href={href}>
          {children}
        </a>
      </div>
    </div>
  );
}
