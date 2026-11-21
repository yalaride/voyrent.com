"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";

export type AuthScreenName =
  | "signin"
  | "register"
  | "forgot"
  | "verify"
  | "reset-sent"
  | "new-password";

export function AuthScreen({
  screen,
  passwordUpdated = false,
}: {
  screen: AuthScreenName;
  passwordUpdated?: boolean;
}) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const code = String(data.get("code") ?? "");

    if (screen === "signin" || screen === "register" || screen === "forgot") {
      if (!email.includes("@") || !email.includes(".")) {
        setError(t("emailInvalid"));
        return;
      }
    }
    if (screen === "register" && name.trim().length < 2) {
      setError(t("nameShort"));
      return;
    }
    if (screen === "register" && phone.trim().length < 6) {
      setError(t("phoneShort"));
      return;
    }
    if (screen === "signin" || screen === "register" || screen === "new-password") {
      if (password.length < 8) {
        setError(t("passwordShort"));
        return;
      }
    }
    if ((screen === "register" || screen === "new-password") && password !== confirm) {
      setError(t("passwordMismatch"));
      return;
    }
    if (screen === "verify" && !/^\d{6}$/.test(code.trim())) {
      setError(t("codeInvalid"));
      return;
    }

    setError("");
    if (screen === "signin" || screen === "register") {
      router.push("/auth/verify");
      return;
    }
    if (screen === "forgot") {
      router.push("/auth/reset-sent");
      return;
    }
    if (screen === "new-password") {
      router.push("/auth/signin?reset=1");
      return;
    }
    setVerified(true);
  }

  const title =
    screen === "signin"
      ? t("signInTitle")
      : screen === "register"
        ? t("registerTitle")
        : screen === "forgot"
          ? t("forgotTitle")
          : screen === "verify"
            ? verified
              ? t("verifiedTitle")
              : t("verifyTitle")
            : screen === "reset-sent"
              ? t("resetSentTitle")
              : t("newPasswordTitle");

  const body =
    screen === "signin"
      ? t("signInBody")
      : screen === "register"
        ? t("registerBody")
        : screen === "forgot"
          ? t("forgotBody")
          : screen === "verify"
            ? verified
              ? t("verifiedBody")
              : t("verifyBody")
            : screen === "reset-sent"
              ? t("resetSentBody")
              : t("newPasswordBody");

  return (
    <section className="bg-background-secondary px-4 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-border-subtle bg-background-primary p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{body}</p>

        {passwordUpdated ? (
          <p className="mt-4 rounded-xl bg-primary/10 px-3 py-2 text-sm text-primary">
            {t("passwordUpdated")}
          </p>
        ) : null}

        {screen === "reset-sent" ? (
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild className="h-11 w-full">
              <Link href="/auth/new-password">{t("choosePassword")}</Link>
            </Button>
            <TextLink href="/auth/signin">{t("backToSignIn")}</TextLink>
          </div>
        ) : verified ? (
          <Button asChild className="mt-6 h-11 w-full">
            <Link href="/">{t("continue")}</Link>
          </Button>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-col gap-4" noValidate>
            {screen === "register" ? (
              <Field label={t("name")} name="name" autoComplete="name" />
            ) : null}
            {screen === "signin" || screen === "register" || screen === "forgot" ? (
              <Field label={t("email")} name="email" type="email" autoComplete="email" />
            ) : null}
            {screen === "register" ? (
              <Field label={t("phone")} name="phone" type="tel" autoComplete="tel" />
            ) : null}
            {screen === "verify" ? (
              <Field
                label={t("code")}
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
              />
            ) : null}
            {screen === "signin" || screen === "register" || screen === "new-password" ? (
              <Field
                label={t("password")}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={screen === "signin" ? "current-password" : "new-password"}
                trailing={
                  <button
                    type="button"
                    className="text-text-secondary"
                    aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                    onClick={() => setShowPassword((open) => !open)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                }
              />
            ) : null}
            {screen === "register" || screen === "new-password" ? (
              <Field
                label={t("confirmPassword")}
                name="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
              />
            ) : null}

            {screen === "signin" ? (
              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-text-secondary">
                  <input type="checkbox" name="remember" className="size-4 accent-primary" />
                  {t("remember")}
                </label>
                <Link href="/auth/forgot-password" className="font-medium text-link">
                  {t("forgot")}
                </Link>
              </div>
            ) : null}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" className="h-11 w-full">
              {screen === "signin"
                ? t("signIn")
                : screen === "register"
                  ? t("createAccount")
                  : screen === "forgot"
                    ? t("sendLink")
                    : screen === "verify"
                      ? t("verify")
                      : t("savePassword")}
            </Button>

            {screen === "signin" ? (
              <p className="text-center text-sm text-text-secondary">
                {t("noAccount")}{" "}
                <Link href="/auth/register" className="font-medium text-link">
                  {t("createAccount")}
                </Link>
              </p>
            ) : (
              <TextLink href="/auth/signin">
                {screen === "register" ? t("hasAccount") : t("backToSignIn")}
              </TextLink>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  trailing,
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  trailing?: ReactNode;
} & Omit<ComponentProps<typeof Input>, "name" | "type">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-text-primary">{label}</span>
      <span className="flex items-center gap-2 rounded-xl border border-border-default bg-background-primary px-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
        <Input
          name={name}
          type={type}
          required
          className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          {...props}
        />
        {trailing}
      </span>
    </label>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <p className="text-center text-sm">
      <Link href={href} className="font-medium text-link">
        {children}
      </Link>
    </p>
  );
}
