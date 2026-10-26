import { listLanguageReference } from "@/server/reference/repository";
import { jsonOk, runRoute } from "@/server/http/envelope";

export async function GET() {
  return runRoute(async () => jsonOk(await listLanguageReference()));
}
