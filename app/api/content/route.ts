import { getSitePayload } from "@/app/lib/content";

export const runtime = "edge";

export async function GET() {
  const payload = await getSitePayload();

  return Response.json(payload, {
    headers: {
      "cache-control": "public, s-maxage=60, stale-while-revalidate=180",
    },
  });
}
