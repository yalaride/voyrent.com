"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { LOCALE_NAMES, LOCALES, type AppLocale } from "@/domain/geo/locales";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LocaleSwitcher({ locale, label }: { locale: AppLocale; label: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={label}>
          {LOCALE_NAMES[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(next) => {
            router.replace(pathname, { locale: next });
          }}
        >
          {LOCALES.map((code) => (
            <DropdownMenuRadioItem key={code} value={code}>
              {LOCALE_NAMES[code]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
