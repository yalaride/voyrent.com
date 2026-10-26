import "server-only";

import { serverEnv } from "@/lib/config/env";

export function siteOrigin(): string {
  return serverEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin()}${normalized}`;
}
