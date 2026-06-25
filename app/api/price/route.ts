import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const debug = new URL(request.url).searchParams.get("debug") === "1";

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd&include_24hr_change=true",
      {
        cache: "no-store",
        headers: { accept: "application/json", "user-agent": "300spo-live/1.0" },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          fetchedAt: new Date().toISOString(),
          adaUsd: null,
          change24h: null,
          ...(debug
            ? { status: response.status, statusText: response.statusText }
            : {}),
        },
        { status: 200 },
      );
    }

    const data = (await response.json()) as {
      cardano?: { usd?: number; usd_24h_change?: number };
    };

    return NextResponse.json(
      {
        fetchedAt: new Date().toISOString(),
        adaUsd: data.cardano?.usd ?? null,
        change24h: data.cardano?.usd_24h_change ?? null,
      },
      {
        headers: {
          "cache-control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  } catch {
    return NextResponse.json({
      fetchedAt: new Date().toISOString(),
      adaUsd: null,
      change24h: null,
      ...(debug ? { error: "fetch_failed" } : {}),
    });
  }
}
