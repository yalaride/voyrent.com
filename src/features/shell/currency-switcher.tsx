"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "lucide-react";

import {
  CURRENCY_CODES,
  type CurrencyCode,
} from "@/domain/currency/currencies";
import { setDisplayCurrency } from "@/features/preferences/set-currency";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CurrencySwitcher({
  value,
  label,
  onChange,
}: {
  value: CurrencyCode;
  label: string;
  onChange?: (currency: CurrencyCode) => void;
}) {
  const t = useTranslations("Currencies");
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={label}
          disabled={pending}
          className="group relative flex w-full cursor-pointer items-center justify-between rounded-xl border border-border-default bg-background-primary p-3 text-start text-sm font-medium text-text-primary outline-none transition-colors hover:border-primary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:border-primary"
        >
          <span className="pointer-events-none absolute -top-2.5 start-3 bg-background-primary px-1.5 text-xs font-medium text-text-secondary">
            {label}
          </span>
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold">{value}</span>
            <span className="truncate text-xs text-text-secondary">
              {t(value)}
            </span>
          </div>
          <ChevronDownIcon className="size-4 shrink-0 text-text-secondary transition-transform duration-200 group-hover:text-primary group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="z-50 max-h-56 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto rounded-xl border border-border-default bg-background-primary p-1.5 shadow-xl"
      >
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            const chosen = next as CurrencyCode;
            if (onChange) {
              onChange(chosen);
            } else {
              startTransition(() => {
                void setDisplayCurrency(chosen);
              });
            }
          }}
        >
          {CURRENCY_CODES.map((code) => (
            <DropdownMenuRadioItem
              key={code}
              value={code}
              className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-text-primary outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:font-semibold data-[state=checked]:text-primary"
            >
              <span className="font-medium">{code}</span>
              <span className="text-xs text-text-secondary">{t(code)}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
