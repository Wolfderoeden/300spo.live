import {
  getSitePayload,
  isAdminRequest,
  normalizeContent,
  saveSiteContent,
} from "@/app/lib/content";

export const runtime = "edge";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json(await getSitePayload({ includeHiddenMedia: true }));
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    content?: unknown;
  } | null;

  if (!payload?.content || typeof payload.content !== "object") {
    return Response.json({ error: "Content is required." }, { status: 400 });
  }

  const content = await saveSiteContent(normalizeContent(payload.content));
  return Response.json({ content });
}
