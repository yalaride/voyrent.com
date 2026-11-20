"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";

import { CURRENCY_CODES, type CurrencyCode } from "@/domain/currency/currencies";
import { setDisplayCurrency } from "@/features/preferences/set-currency";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CurrencySwitcher({ value, label }: { value: CurrencyCode; label: string }) {
  const t = useTranslations("Currencies");
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={label} disabled={pending}>
          {value}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            startTransition(() => {
              void setDisplayCurrency(next);
            });
          }}
        >
          {CURRENCY_CODES.map((code) => (
            <DropdownMenuRadioItem key={code} value={code}>
              <span className="font-medium">{code}</span>
              <span className="text-text-secondary">{t(code)}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
