"use client";

import { useState } from "react";
import { MapPinIcon } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { getCountry } from "@/domain/geo/markets";
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
  active?: { country: string; city: string; placeName: string; scope: "city" | "country" };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function selectPlace(path: string) {
    router.push(path);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="max-w-56">
          <MapPinIcon />
          <span className="truncate">{active?.placeName ?? label}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{label}</SheetTitle>
          <SheetDescription className="sr-only">{label}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 px-4 pb-6">
          {groups.map((country) => {
            const capitalSlug = getCountry(country.code)?.capital;
            const capital = country.cities.find((city) => city.slug === capitalSlug) ?? country.cities[0];
            const countrySelected =
              active?.scope === "city" &&
              active.country === country.code &&
              active.city === capital?.slug;

            return (
              <section key={country.code} className="grid gap-1">
                <button
                  type="button"
                  aria-current={countrySelected ? "true" : undefined}
                  className="flex w-full rounded-lg px-2 py-2 text-start text-sm font-medium text-text-primary hover:bg-background-secondary aria-[current=true]:bg-background-secondary"
                  onClick={() => {
                    if (capital) {
                      selectPlace(cityRentPath(capital.slug));
                    }
                  }}
                >
                  {country.name}
                </button>
                <ul className="grid gap-1 ps-2">
                  {country.cities.map((city) => {
                    const selected = active?.scope === "city" && active.country === country.code && active.city === city.slug;
                    return (
                      <li key={city.slug}>
                        <button
                          type="button"
                          aria-current={selected ? "true" : undefined}
                          className="flex w-full rounded-lg px-2 py-2 text-start text-sm text-text-secondary hover:bg-background-secondary hover:text-text-primary aria-[current=true]:bg-background-secondary aria-[current=true]:font-medium aria-[current=true]:text-text-primary"
                          onClick={() => selectPlace(cityRentPath(city.slug))}
                        >
                          {city.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
