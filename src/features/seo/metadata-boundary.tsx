import { Suspense } from "react";
import { connection } from "next/server";

async function Connected() {
  await connection();
  return null;
}

/** Marks metadata that reads the URL as intentionally deferred, so prefetch can continue. */
export function MetadataBoundary() {
  return (
    <Suspense fallback={null}>
      <Connected />
    </Suspense>
  );
}
