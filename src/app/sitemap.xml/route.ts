import { sitemapIndexXml } from "@/server/seo/sitemaps";

export function GET() {
  return new Response(sitemapIndexXml(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
