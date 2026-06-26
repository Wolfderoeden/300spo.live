import {
  adminConfigured,
  adminCookie,
  clearAdminCookie,
  expectedAdminToken,
  isAdminRequest,
} from "@/app/lib/content";

export const runtime = "edge";

export async function GET(request: Request) {
  return Response.json({
    authenticated: await isAdminRequest(request),
    configured: adminConfigured(),
  });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    password?: string;
  } | null;
  const expected = await expectedAdminToken();

  if (!expected || !payload?.password) {
    return Response.json(
      { error: "Admin password is not configured." },
      { status: 401 },
    );
  }

  const submitted = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`300:${payload.password}`),
  );
  const submittedToken = btoa(String.fromCharCode(...new Uint8Array(submitted)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  if (submittedToken !== expected) {
    return Response.json({ error: "Invalid password." }, { status: 401 });
  }

  return Response.json(
    { authenticated: true },
    { headers: { "set-cookie": adminCookie(expected, request) } },
  );
}

export async function DELETE() {
  return Response.json(
    { authenticated: false },
    { headers: { "set-cookie": clearAdminCookie() } },
  );
}
