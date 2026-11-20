"use client";

import { ChevronDownIcon } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { LOCALE_NAMES, LOCALES, type AppLocale } from "@/domain/geo/locales";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LocaleSwitcher({
  locale,
  label,
  onChange,
}: {
  locale: AppLocale;
  label: string;
  onChange?: (locale: AppLocale) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="group relative flex w-full cursor-pointer items-center justify-between rounded-xl border border-border-default bg-background-primary p-3 text-start text-sm font-medium text-text-primary outline-none transition-colors hover:border-primary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary data-[state=open]:border-primary"
        >
          <span className="pointer-events-none absolute -top-2.5 start-3 bg-background-primary px-1.5 text-xs font-medium text-text-secondary">
            {label}
          </span>
          <span className="truncate">{LOCALE_NAMES[locale]}</span>
          <ChevronDownIcon className="size-4 shrink-0 text-text-secondary transition-transform duration-200 group-hover:text-primary group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="z-50 max-h-56 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto rounded-xl border border-border-default bg-background-primary p-1.5 shadow-xl"
      >
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(next) => {
            const chosen = next as AppLocale;
            if (onChange) {
              onChange(chosen);
            } else {
              router.replace(pathname, { locale: chosen });
            }
          }}
        >
          {LOCALES.map((code) => {
            const selected = code === locale;

            return (
            <DropdownMenuRadioItem
              key={code}
              value={code}
              className={`cursor-pointer rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary [&_[data-slot=dropdown-menu-radio-item-indicator]]:hidden ${
                selected
                  ? "bg-primary/15 font-semibold text-primary"
                  : "text-text-primary"
              }`}
            >
              {LOCALE_NAMES[code]}
            </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
