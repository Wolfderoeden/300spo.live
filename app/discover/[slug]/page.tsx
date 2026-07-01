import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSitePayload, type MediaItem } from "@/app/lib/content";

export const runtime = "edge";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

const typeLabels = {
  project: "Project",
  blog: "Blog",
  news: "News",
};

function mediaByPlacement(media: MediaItem[], placement: string) {
  return media.filter((item) => item.isVisible && item.placement === placement);
}

function MediaPreview({ item }: { item: MediaItem }) {
  return (
    <figure className="media-tile document-media">
      {item.contentType.startsWith("video/") ? (
        <video controls playsInline src={item.url} />
      ) : (
        <img alt={item.alt || item.filename} src={item.url} />
      )}
      {item.alt ? <figcaption>{item.alt}</figcaption> : null}
    </figure>
  );
}

export default async function DiscoverItemPage({ params }: PageProps) {
  const { slug } = await params;
  const { content, media } = await getSitePayload();
  const item = content.discoverItems.find(
    (entry) => entry.visible && entry.slug === slug,
  );

  if (!item) {
    notFound();
  }

  const preview = mediaByPlacement(media, item.mediaPlacement)[0];

  return (
    <main className="site-shell content-document">
      <nav className="nav" aria-label="Primary navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">300</span>
          <span>{content.siteTitle}</span>
        </Link>
        <div className="nav-links">
          <Link href="/#metrics">Metrics</Link>
          <Link href="/#ecosystem">Ecosystem</Link>
          <Link href="/#governance">SPO + DRep</Link>
          <Link href="/#trade">Trade</Link>
          <Link href="/#discover">Discover</Link>
        </div>
      </nav>
      <article className="container document-panel">
        <Link className="pill-link" href="/#discover">
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="document-meta">
          <span>{typeLabels[item.type]}</span>
          {item.date ? <time>{item.date}</time> : null}
        </div>
        <h1>{item.title}</h1>
        {preview ? <MediaPreview item={preview} /> : null}
        <p>{item.body || item.excerpt || "-"}</p>
        {item.link ? (
          <a className="pill-link mt-4" href={item.link} target="_blank" rel="noreferrer">
            Open source
            <ArrowUpRight size={16} />
          </a>
        ) : null}
      </article>
    </main>
  );
}
