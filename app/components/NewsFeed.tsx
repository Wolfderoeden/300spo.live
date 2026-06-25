"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/app/lib/format";

type NewsItem = {
  title: string | null;
  link: string | null;
  date: string | null;
  description: string | null;
};

async function getNews() {
  try {
    const response = await fetch("/api/news", { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as { items: NewsItem[] | null };
    return data.items;
  } catch {
    return null;
  }
}

export function NewsFeed() {
  const [items, setItems] = useState<NewsItem[] | null>(null);

  useEffect(() => {
    let alive = true;

    getNews().then((news) => {
      if (alive) {
        setItems(news);
      }
    });

    return () => {
      alive = false;
    };
  }, []);

  if (!items) {
    return (
      <div className="glass-card panel">
        <span className="fallback-mark">-</span>
      </div>
    );
  }

  return (
    <div className="grid three-grid">
      {items.slice(0, 3).map((item, index) => (
        <article className="news-card" key={`${item.link ?? item.title}-${index}`}>
          <time>{formatDate(item.date)}</time>
          <h3>{item.title ?? "-"}</h3>
          <p>{item.description ?? "-"}</p>
          {item.link ? (
            <a href={item.link} target="_blank" rel="noreferrer">
              Read
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}

