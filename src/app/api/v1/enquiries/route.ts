import { enquirySchema } from "@/domain/enquiries/schema";
import { isRemoteCatalog } from "@/lib/config/env";
import { apiRequest } from "@/server/http/client";
import { jsonError, jsonOk, runRoute, zodFieldErrors } from "@/server/http/envelope";

export async function POST(request: Request) {
  return runRoute(async () => {
    const payload = await request.json().catch(() => null);
    const parsed = enquirySchema.safeParse(payload);

    if (!parsed.success) {
      return jsonError(400, "VALIDATION_ERROR", "Enquiry payload is invalid.", zodFieldErrors(parsed.error));
    }

    if (!isRemoteCatalog) {
      return jsonError(
        501,
        "NOT_IMPLEMENTED",
        "Enquiries are accepted once the NestJS API is connected.",
      );
    }

    const created = await apiRequest("/v1/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    return jsonOk(created, 202);
  });
}
