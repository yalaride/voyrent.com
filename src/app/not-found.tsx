import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary">This page is not available</h1>
      <p className="mt-3 text-text-secondary">That address is not part of GleeCars.</p>
      <Link href="/" className="mt-6 inline-flex text-sm font-medium text-link underline">
        Browse cars in Dubai
      </Link>
    </div>
  );
}
