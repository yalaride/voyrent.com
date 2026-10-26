import { isRemoteCatalog } from "@/lib/config/env";
import { jsonOk, runRoute } from "@/server/http/envelope";

export async function GET() {
  return runRoute(async () =>
    jsonOk({
      status: "ok",
      service: "gleecars-web",
      catalog: isRemoteCatalog ? "remote" : "fixture",
    }),
  );
}
