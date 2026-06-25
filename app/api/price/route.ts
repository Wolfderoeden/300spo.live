import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const debug = new URL(request.url).searchParams.get("debug") === "1";

  try {
    const response = await fetch(
      "https://api.kraken.com/0/public/Ticker?pair=ADAUSD",
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
      error?: string[];
      result?: {
        ADAUSD?: {
          c?: [string, string];
          o?: string;
        };
      };
    };
    const ticker = data.result?.ADAUSD;
    const last = Number(ticker?.c?.[0]);
    const open = Number(ticker?.o);
    const change24h =
      Number.isFinite(last) && Number.isFinite(open) && open > 0
        ? ((last - open) / open) * 100
        : null;

    return NextResponse.json(
      {
        fetchedAt: new Date().toISOString(),
        adaUsd: Number.isFinite(last) ? last : null,
        change24h,
        ...(debug ? { errors: data.error ?? [] } : {}),
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
