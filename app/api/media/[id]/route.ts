import { getMediaObject, isAdminRequest } from "@/app/lib/content";

export const runtime = "edge";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

export async function GET(request: Request, context: RouteContext) {
  const params = await context.params;
  const media = await getMediaObject(params.id, await isAdminRequest(request));

  if (!media) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  media.object.writeHttpMetadata?.(headers);
  headers.set(
    "content-type",
    headers.get("content-type") ||
      media.object.httpMetadata?.contentType ||
      media.item.contentType,
  );
  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("content-disposition", `inline; filename="${media.item.filename}"`);

  return new Response(media.object.body, { headers });
}
