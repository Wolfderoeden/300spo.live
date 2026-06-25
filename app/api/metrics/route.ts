import { NextResponse } from "next/server";
import { getMetrics } from "@/app/lib/koios";

export const runtime = "edge";

export async function GET() {
  const metrics = await getMetrics();

  return NextResponse.json(metrics, {
    headers: {
      "cache-control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}

