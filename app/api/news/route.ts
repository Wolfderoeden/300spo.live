import { NextResponse } from "next/server";

export const runtime = "edge";

type NewsItem = {
  title: string | null;
  link: string | null;
  date: string | null;
  description: string | null;
};

function textBetween(source: string, tag: string) {
  const match = source.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  if (!match) {
    return null;
  }

  return decodeXml(match[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim());
}

function decodeXml(value: string) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRss(xml: string): NewsItem[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  return items.slice(0, 6).map((item) => ({
    title: textBetween(item, "title"),
    link: textBetween(item, "link"),
    date: textBetween(item, "pubDate"),
    description: textBetween(item, "description"),
  }));
}

export async function GET() {
  try {
    const response = await fetch("https://cardano.org/news/rss.xml", {
      headers: { accept: "application/rss+xml, application/xml, text/xml" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ fetchedAt: new Date().toISOString(), items: null });
    }

    const xml = await response.text();

    return NextResponse.json(
      { fetchedAt: new Date().toISOString(), items: parseRss(xml) },
      {
        headers: {
          "cache-control": "public, s-maxage=86400, stale-while-revalidate=3600",
        },
      },
    );
  } catch {
    return NextResponse.json({ fetchedAt: new Date().toISOString(), items: null });
  }
}

