import { Link } from "@/i18n/navigation";
import { LikeButton } from "@/components/ui/like-button";

export type ListingCardModel = {
  href: string;
  make: string;
  model: string;
  bodyType: string;
  transmission: string;
  seats: string;
  supplier: string;
  dailyPrice: string;
  monthlyPrice: string | null;
  supplierPrice: string | null;
  noDeposit: boolean;
  airport: boolean;
  perDay: string;
  perMonth: string;
  noDepositLabel: string;
  airportLabel: string;
  supplierLabel: string;
  viewLabel: string;
  likeLabel: string;
  likedLabel: string;
};

export function ListingCard({ listing }: { listing: ListingCardModel }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="relative flex h-28 items-end bg-foreground px-4 py-4 text-background">
        <LikeButton
          label={listing.likeLabel}
          likedLabel={listing.likedLabel}
          className="absolute top-3 right-3"
        />
        <p className="text-2xl font-semibold tracking-tight">{listing.make}</p>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            {listing.make} {listing.model}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {listing.bodyType} · {listing.transmission} · {listing.seats}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {listing.supplierLabel}: {listing.supplier}
        </p>
        <div className="mt-auto">
          <p className="text-xl font-semibold tracking-tight">
            {listing.dailyPrice}{" "}
            <span className="text-sm font-normal text-muted-foreground">{listing.perDay}</span>
          </p>
          {listing.monthlyPrice ? (
            <p className="text-sm text-muted-foreground">
              {listing.monthlyPrice} {listing.perMonth}
            </p>
          ) : null}
          {listing.supplierPrice ? (
            <p className="text-xs text-muted-foreground">{listing.supplierPrice}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {listing.noDeposit ? (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs">{listing.noDepositLabel}</span>
            ) : null}
            {listing.airport ? (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{listing.airportLabel}</span>
            ) : null}
          </div>
        </div>
        <Link
          href={listing.href}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
        >
          {listing.viewLabel}
        </Link>
      </div>
    </article>
  );
}
