import { connection, NextResponse } from "next/server";
import type { ZodError } from "zod";

export type ApiFieldError = {
  field: string;
  constraints: string[];
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
  };
};

export type ApiFailure = {
  success: false;
  error: string;
  message: string;
  meta: {
    requestId: string;
    timestamp: string;
  };
  errors?: ApiFieldError[];
};

export class ApiClientError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly fieldErrors?: ApiFieldError[];

  constructor(
    message: string,
    code: string,
    options?: { status?: number; fieldErrors?: ApiFieldError[] },
  ) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = options?.status;
    this.fieldErrors = options?.fieldErrors;
  }
}

function meta() {
  return {
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
}

export function jsonOk<T>(data: T, status = 200) {
  const body: ApiSuccess<T> = { success: true, data, meta: meta() };
  return NextResponse.json(body, { status });
}

export function jsonError(
  status: number,
  code: string,
  message: string,
  errors?: ApiFieldError[],
) {
  const body: ApiFailure = {
    success: false,
    error: code,
    message,
    meta: meta(),
    errors,
  };

  return NextResponse.json(body, { status });
}

export function zodFieldErrors(error: ZodError): ApiFieldError[] {
  const grouped = new Map<string, string[]>();

  for (const issue of error.issues) {
    const field = issue.path.join(".") || "body";
    const constraints = grouped.get(field) ?? [];
    constraints.push(issue.message);
    grouped.set(field, constraints);
  }

  return [...grouped].map(([field, constraints]) => ({ field, constraints }));
}

export async function runRoute(handler: () => Promise<NextResponse>) {
  await connection();

  try {
    return await handler();
  } catch (error) {
    if (error instanceof ApiClientError) {
      return jsonError(error.status ?? 502, error.code, error.message, error.fieldErrors);
    }

    throw error;
  }
}
