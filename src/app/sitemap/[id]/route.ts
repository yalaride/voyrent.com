import { sitemapUrlsetXml } from "@/server/seo/sitemaps";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const sitemapId = id.endsWith(".xml") ? id.slice(0, -4) : id;
  const xml = sitemapUrlsetXml(sitemapId);

  if (!xml) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
