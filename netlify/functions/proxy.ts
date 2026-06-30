const UPSTREAM_ORIGIN =
  "https://threehundred-spo-live.workspace-vo-4842.chatgpt-team.site";

function envValue(key: string) {
  return (
    globalThis.Netlify?.env?.get(key) ??
    (typeof process !== "undefined" ? process.env[key] : undefined)
  );
}

function upstreamUrl(request: Request) {
  const requestUrl = new URL(request.url);
  return new URL(`${requestUrl.pathname}${requestUrl.search}`, UPSTREAM_ORIGIN);
}

function requestHeaders(request: Request) {
  const headers = new Headers(request.headers);
  headers.set("host", new URL(UPSTREAM_ORIGIN).host);
  headers.delete("x-forwarded-host");
  headers.delete("x-forwarded-proto");

  const bypassToken = envValue("SITES_BYPASS_TOKEN");
  if (bypassToken) {
    headers.set("OAI-Sites-Authorization", `Bearer ${bypassToken}`);
  }

  return headers;
}

function responseHeaders(response: Response, request: Request) {
  const headers = new Headers(response.headers);
  const requestUrl = new URL(request.url);

  const location = headers.get("location");
  if (location?.startsWith(UPSTREAM_ORIGIN)) {
    headers.set("location", location.replace(UPSTREAM_ORIGIN, requestUrl.origin));
  }

  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("content-security-policy");
  headers.set("x-300spo-proxy", "netlify");
  return headers;
}

export default async (request: Request) => {
  const token = envValue("SITES_BYPASS_TOKEN");
  if (!token) {
    return new Response("SITES_BYPASS_TOKEN is not configured.", { status: 500 });
  }

  const method = request.method.toUpperCase();
  const upstreamResponse = await fetch(upstreamUrl(request), {
    method,
    headers: requestHeaders(request),
    body: method === "GET" || method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders(upstreamResponse, request),
  });
};

export const config = {
  path: "/*",
};
