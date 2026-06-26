import { isAdminRequest, updateMediaItem } from "@/app/lib/content";

export const runtime = "edge";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

async function getId(context: RouteContext) {
  const params = await context.params;
  return params.id;
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    alt?: string;
    placement?: string;
    isVisible?: boolean;
  } | null;
  const media = await updateMediaItem(await getId(context), {
    alt: payload?.alt,
    placement: payload?.placement,
    isVisible: payload?.isVisible,
  });

  if (!media) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ media });
}
