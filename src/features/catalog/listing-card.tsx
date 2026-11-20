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
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-default bg-background-primary">
      <div className="relative flex h-28 items-end bg-background-section px-4 py-4 text-text-inverse">
        <LikeButton
          label={listing.likeLabel}
          likedLabel={listing.likedLabel}
          className="absolute top-3 right-3"
        />
        <p className="text-2xl font-semibold tracking-tight text-text-inverse">{listing.make}</p>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-text-primary">
            {listing.make} {listing.model}
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            {listing.bodyType} · {listing.transmission} · {listing.seats}
          </p>
        </div>
        <p className="text-sm text-text-secondary">
          {listing.supplierLabel}: {listing.supplier}
        </p>
        <div className="mt-auto">
          <p className="text-xl font-semibold tracking-tight text-text-primary">
            {listing.dailyPrice}{" "}
            <span className="text-sm font-normal text-text-secondary">{listing.perDay}</span>
          </p>
          {listing.monthlyPrice ? (
            <p className="text-sm text-text-secondary">
              {listing.monthlyPrice} {listing.perMonth}
            </p>
          ) : null}
          {listing.supplierPrice ? (
            <p className="text-xs text-text-secondary">{listing.supplierPrice}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {listing.noDeposit ? (
              <span className="rounded-full bg-background-secondary px-2 py-0.5 text-xs text-text-primary">
                {listing.noDepositLabel}
              </span>
            ) : null}
            {listing.airport ? (
              <span className="rounded-full bg-background-secondary px-2 py-0.5 text-xs text-text-primary">
                {listing.airportLabel}
              </span>
            ) : null}
          </div>
        </div>
        <Link
          href={listing.href}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-text-inverse"
        >
          {listing.viewLabel}
        </Link>
      </div>
    </article>
  );
}
