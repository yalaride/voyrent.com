import * as React from "react";
import type { SVGProps } from "react";

/** Official WhatsApp Brand Icon */

// @/components/icons.tsx

export function ArrowRightIcon({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M2.5 8H13.5M13.5 8L9 3.5M13.5 8L9 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function PhoneCallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M15 3a6 6 0 0 1 6 6" />
      <path d="M15 7a2 2 0 0 1 2 2" />
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function UsersGroupIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

export function InventoryBoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  );
}

export function ReachRentersIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="23" cy="23" r="14.5" stroke="currentColor" strokeWidth="3" />
      <path
        d="M33.5 33.5L44 44"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FeaturedListingsIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M26 7.5L31.4 18.6L43.6 20.4L34.8 29L36.9 41.2L26 35.4L15.1 41.2L17.2 29L8.4 20.4L20.6 18.6L26 7.5Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ListingsOnTopIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="26" cy="26" r="18" stroke="currentColor" strokeWidth="3" />
      <path
        d="M26 34V18M19 24.5L26 17.5L33 24.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OwnRatesIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <rect
        x="8"
        y="12"
        width="36"
        height="22"
        rx="3"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="26" cy="23" r="4.5" stroke="currentColor" strokeWidth="3" />
      <path
        d="M11 39.5H41"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ManageOnePlaceIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <rect
        x="8"
        y="8"
        width="15"
        height="15"
        rx="4"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect
        x="29"
        y="8"
        width="15"
        height="15"
        rx="4"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect
        x="8"
        y="29"
        width="15"
        height="15"
        rx="4"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect
        x="29"
        y="29"
        width="15"
        height="15"
        rx="4"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}

export function GrowCitiesIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M26 44.5C26 44.5 40 31.8 40 21.5C40 13.768 33.732 7.5 26 7.5C18.268 7.5 12 13.768 12 21.5C12 31.8 26 44.5 26 44.5Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="26" cy="21.5" r="5" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export function PhoneIcon({
  className = "size-5",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z" />
    </svg>
  );
}

export function WhatsAppIcon({
  className = "size-5",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9c0 1.66.45 3.22 1.24 4.56L3 21l4.6-1.2A8.96 8.96 0 0 0 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.6 8.9c-.2-.44-.4-.45-.6-.46h-.51c-.18 0-.47.07-.71.33-.24.27-.93.91-.93 2.21 0 1.31.95 2.57 1.08 2.75.13.17 1.84 2.94 4.54 4 2.24.88 2.7.71 3.19.66.49-.05 1.57-.64 1.79-1.26.22-.62.22-1.15.15-1.26-.06-.11-.24-.18-.5-.31-.27-.13-1.57-.77-1.81-.86-.24-.09-.42-.13-.6.13-.18.27-.69.86-.84 1.04-.15.18-.31.2-.58.07-.27-.13-1.12-.41-2.14-1.32-.79-.7-1.32-1.57-1.48-1.84-.15-.26-.02-.41.12-.54.12-.12.27-.31.4-.46.13-.16.18-.27.27-.44.09-.18.04-.34-.02-.47-.07-.13-.59-1.45-.82-1.97Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Road/Kilometer Limit Trapezoid Icon */
export function RoadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path d="M4 13.5L5.8 2.5H10.2L12 13.5H4Z" strokeLinejoin="round" />
      <path d="M8 5V7" strokeLinecap="round" />
      <path d="M8 9.5V11.5" strokeLinecap="round" />
    </svg>
  );
}

/** Crown Icon for Premium Badge */
export function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
    </svg>
  );
}

/** Heart Favorite Icon */
export function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

/** Left Chevron for Carousel */
export function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/** Right Chevron for Carousel */
export function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/** Checkmark for Features */
export function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="13 4.5 6.5 11.5 3 8" />
    </svg>
  );
}
export function GooglePlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3.61 1.814A1.5 1.5 0 0 0 3 3.04v17.92a1.5 1.5 0 0 0 .61 1.226l.09.06 10.04-10.04v-.412L3.7 1.754l-.09.06Z"
        fill="#00D2FF"
      />
      <path
        d="m17.08 15.55-3.34-3.344v-.412l3.34-3.344.075.043 3.96 2.25c1.13.642 1.13 1.692 0 2.334l-3.96 2.25-.075.043Z"
        fill="#FFBD00"
      />
      <path
        d="M17.155 15.507 13.74 12.09 3.61 22.186c.374.396.993.445 1.692.048l11.853-6.727Z"
        fill="#FF3A44"
      />
      <path
        d="M17.155 8.493 5.302 1.766C4.603 1.37 3.984 1.418 3.61 1.814L13.74 11.91l3.415-3.417Z"
        fill="#00E676"
      />
    </svg>
  );
}

export function AppleLogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.365 12.7c-.026-2.55 2.08-3.78 2.176-3.838-1.186-1.734-3.03-1.97-3.683-1.996-1.55-.16-3.053.93-3.843.93-.804 0-2.02-.912-3.332-.886-1.7.026-3.28 1.008-4.152 2.53-1.786 3.095-.455 7.66 1.264 10.165.854 1.228 1.856 2.6 3.17 2.55 1.28-.052 1.76-.82 3.306-.82 1.534 0 1.978.82 3.314.79 1.378-.022 2.244-1.236 3.074-2.474.988-1.422 1.384-2.82 1.404-2.894-.032-.012-2.668-1.018-2.698-4.057ZM13.84 5.26c.696-.856 1.17-2.028 1.04-3.214-1.006.044-2.256.682-2.978 1.522-.636.736-1.202 1.94-1.054 3.078 1.13.086 2.288-.566 2.992-1.386Z" />
    </svg>
  );
}
export function ShareIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M15 7l5 5-5 5" />
      <path d="M4 18v-2a4 4 0 0 1 4-4h12" />
    </svg>
  );
}

type IconProps = SVGProps<SVGSVGElement>;

export function VerifiedSuppliersIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M26 8.13L40.63 13.8V24.6C40.63 34.05 34.39 41.32 26 43.88C17.61 41.32 11.37 34.05 11.37 24.6V13.8L26 8.13Z"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 26.2L24 30.7L33 21.7"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TransparentPricingIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect
        x="8.13"
        y="12.5"
        width="35.75"
        height="27"
        rx="4"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.13 21H43.88"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M16 31H24"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function InstantBookingIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle
        cx="26"
        cy="26"
        r="17.875"
        stroke="currentColor"
        strokeWidth={3}
      />
      <path
        d="M26 15.5V26L33 30"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FreeCancellationIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect
        x="8.13"
        y="11.5"
        width="35.75"
        height="32.38"
        rx="4"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path
        d="M17.5 8.13V14.5M34.5 8.13V14.5M8.13 21H43.88"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M19.5 32L24 36.5L33 27.5"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WideFleetIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M11 29L14.5 18.5C15.1 16.8 16.7 15.7 18.5 15.7H33.5C35.3 15.7 36.9 16.8 37.5 18.5L41 29M9.5 29H42.5C43.26 29 43.88 29.62 43.88 30.38V36.5C43.88 37.33 43.21 38 42.38 38H39.5M12.5 38H9.63C8.8 38 8.13 37.33 8.13 36.5V30.38C8.13 29.62 8.75 29 9.5 29Z"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="37.5" r="3.5" stroke="currentColor" strokeWidth={3} />
      <circle cx="35" cy="37.5" r="3.5" stroke="currentColor" strokeWidth={3} />
    </svg>
  );
}

export function Support247Icon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M10.5 27V24.5C10.5 15.94 17.44 9 26 9C34.56 9 41.5 15.94 41.5 24.5V27"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <rect
        x="8.13"
        y="25.5"
        width="7.5"
        height="13"
        rx="3.75"
        stroke="currentColor"
        strokeWidth={3}
      />
      <rect
        x="36.38"
        y="25.5"
        width="7.5"
        height="13"
        rx="3.75"
        stroke="currentColor"
        strokeWidth={3}
      />
      <path
        d="M36.5 38.5C35.5 41.5 32.5 43.5 28 43.5H25"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShieldIcon({
  size = 20,
  strokeWidth = 1.75,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function HugeSelectionIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect
        x="9.63"
        y="9.63"
        width="13"
        height="13"
        rx="3"
        stroke="currentColor"
        strokeWidth={3}
      />
      <rect
        x="29.38"
        y="9.63"
        width="13"
        height="13"
        rx="3"
        stroke="currentColor"
        strokeWidth={3}
      />
      <rect
        x="9.63"
        y="29.38"
        width="13"
        height="13"
        rx="3"
        stroke="currentColor"
        strokeWidth={3}
      />
      <path
        d="M35.88 29.38V42.38M29.38 35.88H42.38"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FreeOfChargeIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="26" cy="26" r="16.38" stroke="currentColor" strokeWidth={3} />
      <path
        d="M14.42 14.42L37.58 37.58"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BestRatesIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M22.8 9.63H12.63C10.97 9.63 9.63 10.97 9.63 12.63V22.8C9.63 23.6 9.95 24.36 10.51 24.92L26.92 41.33C28.09 42.5 29.99 42.5 31.16 41.33L41.33 31.16C42.5 29.99 42.5 28.09 41.33 26.92L24.92 10.51C24.36 9.95 23.6 9.63 22.8 9.63Z"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17.5" cy="17.5" r="2" fill="currentColor" />
    </svg>
  );
}

export function LocalSuppliersIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M9.63 20.5L13.1 10.63C13.4 9.98 14.04 9.63 14.75 9.63H37.25C37.96 9.63 38.6 9.98 38.9 10.63L42.38 20.5"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.63 20.5C9.63 23.1 11.8 25 15.08 25C18.36 25 20.54 23.1 20.54 20.5C20.54 23.1 22.72 25 26 25C29.28 25 31.46 23.1 31.46 20.5C31.46 23.1 33.64 25 36.92 25C40.2 25 42.38 23.1 42.38 20.5"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.54 20.5L21.5 9.63M31.46 20.5L30.5 9.63"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M12.5 24.5V42.38M39.5 24.5V42.38M9.63 42.38H42.38"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 42.38V30.5H24.5V42.38"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="29.5"
        y="30.5"
        width="5.5"
        height="5.5"
        rx="1"
        stroke="currentColor"
        strokeWidth={3}
      />
    </svg>
  );
}

export function BookDirectlyIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M23.5 16.5H12.63C10.97 16.5 9.63 17.84 9.63 19.5V39.38C9.63 41.04 10.97 42.38 12.63 42.38H32.5C34.16 42.38 35.5 41.04 35.5 39.38V28.5"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.5 28.5L42.38 9.63"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30.5 9.63H42.38V21.5"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShortlistShareIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect
        x="9.63"
        y="9.63"
        width="32.75"
        height="32.75"
        rx="5"
        stroke="currentColor"
        strokeWidth={3}
      />
      <path
        d="M18.5 9.63V31.5L26 26.5L33.5 31.5V9.63"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
