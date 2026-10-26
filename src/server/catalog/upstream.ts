import "server-only";

import type { z } from "zod";

import type { VehicleSearchQuery } from "@/domain/catalog/types";
import { apiRequest } from "@/server/http/client";
import { ApiClientError } from "@/server/http/envelope";

export function rejectContract(error: z.ZodError): never {
  throw new ApiClientError("Upstream payload did not match the contract.", "INVALID_UPSTREAM", {
    status: 502,
    fieldErrors: error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      constraints: [issue.message],
    })),
  });
}

export function catalogQuery(path: string, query: VehicleSearchQuery): string {
  const params = new URLSearchParams({
    country: query.country,
    city: query.city,
    locale: query.locale,
    sort: query.sort,
    page: String(query.page),
    limit: String(query.limit),
  });

  if (query.make) params.set("make", query.make);
  if (query.model) params.set("model", query.model);
  if (query.bodyType) params.set("bodyType", query.bodyType);
  if (query.q) params.set("q", query.q);
  if (query.deposit) params.set("deposit", query.deposit);
  if (query.term) params.set("term", query.term);
  if (query.pickup) params.set("pickup", query.pickup);
  if (query.seats) params.set("seats", String(query.seats));

  return `${path}?${params.toString()}`;
}

export async function fetchUpstream(path: string, init?: RequestInit): Promise<unknown> {
  return apiRequest(path, init);
}
