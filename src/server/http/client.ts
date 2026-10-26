import "server-only";

import { ApiClientError } from "@/server/http/envelope";
import { serverEnv } from "@/lib/config/env";

const TIMEOUT_MS = 8_000;

type Envelope = {
  success?: boolean;
  data?: unknown;
  error?: string;
  message?: string;
};

/**
 * Server-side client for the NestJS API.
 * The browser talks to `/api/v1` on this origin; this module is the only
 * place that knows the upstream base URL.
 */
export async function apiRequest(path: string, init?: RequestInit): Promise<unknown> {
  const baseUrl = serverEnv.API_BASE_URL;

  if (!baseUrl) {
    throw new ApiClientError("API base URL is not configured.", "API_NOT_CONFIGURED", {
      status: 501,
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(new URL(path, baseUrl), {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
      cache: "no-store",
    });

    const body = (await response.json().catch(() => null)) as Envelope | null;

    if (!response.ok || body?.success === false) {
      throw new ApiClientError(body?.message || "The NestJS API request failed.", body?.error || "UPSTREAM_ERROR", {
        status: response.status || 502,
      });
    }

    return body?.data;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiClientError("The NestJS API timed out.", "UPSTREAM_TIMEOUT", { status: 504 });
    }

    throw new ApiClientError("The NestJS API is unreachable.", "UPSTREAM_UNAVAILABLE", { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
