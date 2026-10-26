"use client";

import { useState } from "react";
import { MapPinIcon } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { cityRentPath } from "@/domain/routing/rent-paths";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export type MarketGroup = {
  code: string;
  name: string;
  cities: { slug: string; name: string }[];
};

export function MarketSwitcher({
  label,
  groups,
  active,
}: {
  label: string;
  groups: MarketGroup[];
  active?: { country: string; city: string; cityName: string };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function selectCity(city: string) {
    router.push(cityRentPath(city));
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="max-w-48">
          <MapPinIcon />
          <span className="truncate">{active?.cityName ?? label}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{label}</SheetTitle>
          <SheetDescription className="sr-only">{label}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 px-4 pb-6">
          {groups.map((country) => (
            <section key={country.code} className="grid gap-2">
              <h2 className="text-sm font-medium text-muted-foreground">{country.name}</h2>
              <ul className="grid gap-1">
                {country.cities.map((city) => {
                  const selected = active?.country === country.code && active.city === city.slug;
                  return (
                    <li key={city.slug}>
                      <button
                        type="button"
                        aria-current={selected ? "true" : undefined}
                        className="flex w-full rounded-lg px-2 py-2 text-start text-sm hover:bg-muted aria-[current=true]:bg-muted aria-[current=true]:font-medium"
                        onClick={() => selectCity(city.slug)}
                      >
                        {city.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
