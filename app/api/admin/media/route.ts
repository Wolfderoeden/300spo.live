import {
  getSitePayload,
  insertMediaItem,
  isAdminRequest,
} from "@/app/lib/content";

export const runtime = "edge";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getSitePayload({ includeHiddenMedia: true });
  return Response.json({ media: payload.media, storageReady: payload.storageReady });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "File is required." }, { status: 400 });
  }

  const media = await insertMediaItem({
    file,
    alt: String(formData.get("alt") ?? ""),
    placement: String(formData.get("placement") ?? "library"),
    isVisible: String(formData.get("isVisible") ?? "true") === "true",
  });

  return Response.json({ media }, { status: 201 });
}
