import { ArrowDown, ArrowUpRight, Shield, Snowflake } from "lucide-react";
import type { CSSProperties } from "react";
import {
  DrepProfileCard,
  LiveTicker,
  MetricsGrid,
} from "./components/LiveMetrics";
import { NewsFeed } from "./components/NewsFeed";
import { TradePanel } from "./components/TradePanel";
import { blogPosts } from "./data/blog";
import { getSitePayload, type MediaItem } from "./lib/content";
import {
  DREP_ID,
  LEGACY_DREP_ID,
  NFT_COLLECTION_URL,
  POOL_PM_URL,
  TOKEN_ID,
} from "./lib/constants";

export const runtime = "edge";

function mediaByPlacement(media: MediaItem[], placement: string) {
  return media.filter((item) => item.isVisible && item.placement === placement);
}

function MediaTile({ item }: { item: MediaItem }) {
  return (
    <figure className="media-tile">
      {item.contentType.startsWith("video/") ? (
        <video controls muted playsInline src={item.url} />
      ) : (
        <img alt={item.alt || item.filename} src={item.url} />
      )}
      {item.alt ? <figcaption>{item.alt}</figcaption> : null}
    </figure>
  );
}

export default async function Home() {
  const { content, media } = await getSitePayload();
  const pages = [...content.pages]
    .filter((page) => page.visible)
    .sort((a, b) => a.order - b.order);
  const sections = [...content.sections]
    .filter((section) => section.visible)
    .sort((a, b) => a.order - b.order);
  const ecosystemSection = sections.find((section) => section.id === "ecosystem");
  const drepSection = sections.find((section) => section.id === "drep-profile");
  const customSections = sections.filter(
    (section) => section.id !== "ecosystem" && section.id !== "drep-profile",
  );
  const heroMedia = mediaByPlacement(media, "hero")[0];
  const ecosystemMedia = mediaByPlacement(media, "ecosystem");
  const drepMedia = mediaByPlacement(media, "drep");
  const galleryMedia = mediaByPlacement(media, "gallery");

  return (
    <main className="site-shell">
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="#top">
          <span className="brand-mark">300</span>
          <span>{content.siteTitle}</span>
        </a>
        <div className="nav-links">
          <a href="#metrics">Metrics</a>
          <a href="#trade">Trade</a>
          <a href="#news">News</a>
          <a href="#blog">Blog</a>
          {pages.map((page) => (
            <a href={`/content/${page.slug}`} key={page.id}>
              {page.navLabel}
            </a>
          ))}
          <a href="/admin">Admin</a>
        </div>
      </nav>

      <section
        className="hero"
        id="top"
        style={
          heroMedia
            ? ({ "--hero-image": `url("${heroMedia.url}")` } as CSSProperties)
            : undefined
        }
      >
        <div className="hero-noise" />
        <div className="container hero-content">
          <div>
            <span className="eyebrow">
              <span className="status-dot" />
              {content.hero.eyebrow}
            </span>
            <h1>{content.hero.title}</h1>
            <p className="hero-copy">
              {content.hero.body}
            </p>
            <div className="hero-actions">
              <a className="pill-link primary-action" href="#trade">
                {content.hero.primaryLabel}
                <ArrowDown size={16} />
              </a>
              <a
                className="pill-link"
                href={POOL_PM_URL}
                target="_blank"
                rel="noreferrer"
              >
                {content.hero.secondaryLabel}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <LiveTicker />
        </div>
      </section>

      <section className="section" id="metrics">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Live metrics</h2>
              <p className="section-lede">
                On-chain 300, SPO, NFT, and DRep surfaces. If a read fails, the
                site renders a dash.
              </p>
            </div>
            <Snowflake aria-hidden />
          </div>
          <MetricsGrid />
        </div>
      </section>

      <section className="section">
        <div className="container grid two-grid">
          <div className="glass-card token-visual">
            <div className="token-badge">300</div>
            {ecosystemMedia.length > 0 ? (
              <div className="floating-media-strip">
                {ecosystemMedia.slice(0, 3).map((item) => (
                  <MediaTile item={item} key={item.id} />
                ))}
              </div>
            ) : null}
          </div>
          <div className="glass-card panel">
            <div className="accent-bar" />
            <span className="label">Ecosystem</span>
            <h2 className="mt-3">
              {ecosystemSection?.title ?? "300 Token + 300 Degens"}
            </h2>
            <p className="copy-block mt-4">
              {ecosystemSection?.body ??
                "The token and NFT collection are shown together as the public 300 identity, with the SPO and DRep profile connected beside them for live Cardano participation."}
            </p>
            <span className="id-chip">Token ID: {TOKEN_ID}</span>
            <span className="id-chip">DRep: {DREP_ID}</span>
            <span className="id-chip">Legacy DRep: {LEGACY_DREP_ID}</span>
            <a
              className="pill-link mt-4"
              href={NFT_COLLECTION_URL}
              target="_blank"
              rel="noreferrer"
            >
              300 Degens collection
              <ArrowUpRight size={16} />
            </a>
            {ecosystemSection?.ctaHref && ecosystemSection.ctaLabel ? (
              <a
                className="pill-link mt-4"
                href={ecosystemSection.ctaHref}
                target={
                  ecosystemSection.ctaHref.startsWith("http") ? "_blank" : undefined
                }
                rel={
                  ecosystemSection.ctaHref.startsWith("http")
                    ? "noreferrer"
                    : undefined
                }
              >
                {ecosystemSection.ctaLabel}
                <ArrowUpRight size={16} />
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid two-grid">
          <div className="glass-card panel">
            <div className="accent-bar" />
            <span className="label">DRep</span>
            <h2 className="mt-3">{drepSection?.title ?? "DRep profile"}</h2>
            <p className="copy-block mt-4">
              {drepSection?.body ??
                "The profile displays the current ADA delegated to 300 as DRep voting power. It is read from on-chain data and shows a dash if the source cannot be fetched."}
            </p>
            <span className="id-chip">DRep: {DREP_ID}</span>
            <span className="id-chip">Legacy: {LEGACY_DREP_ID}</span>
          </div>
          <div>
            <DrepProfileCard />
            {drepMedia.length > 0 ? (
              <div className="media-strip mt-4">
                {drepMedia.slice(0, 2).map((item) => (
                  <MediaTile item={item} key={item.id} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {customSections.map((section) => (
        <section className="section" key={section.id}>
          <div className="container grid two-grid">
            <div className="glass-card panel">
              <div className="accent-bar" />
              {section.eyebrow ? <span className="label">{section.eyebrow}</span> : null}
              <h2 className="mt-3">{section.title}</h2>
              <p className="copy-block mt-4">{section.body}</p>
              {section.ctaHref && section.ctaLabel ? (
                <a
                  className="pill-link mt-4"
                  href={section.ctaHref}
                  target={section.ctaHref.startsWith("http") ? "_blank" : undefined}
                  rel={section.ctaHref.startsWith("http") ? "noreferrer" : undefined}
                >
                  {section.ctaLabel}
                  <ArrowUpRight size={16} />
                </a>
              ) : null}
            </div>
            <div className="media-strip">
              {mediaByPlacement(media, section.mediaPlacement).slice(0, 3).map((item) => (
                <MediaTile item={item} key={item.id} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {galleryMedia.length > 0 ? (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2>Gallery</h2>
                <p className="section-lede">
                  Media selected in the admin area and published for visitors.
                </p>
              </div>
            </div>
            <div className="media-gallery">
              {galleryMedia.map((item) => (
                <MediaTile item={item} key={item.id} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" id="trade">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Trade and buy ADA</h2>
              <p className="section-lede">
                Minswap routes the 300 token with partner code 300spolive, and
                the wallet panel exposes CIP-30 connection.
              </p>
            </div>
            <Shield aria-hidden />
          </div>
          <TradePanel />
        </div>
      </section>

      <section className="section" id="news">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Cardano news</h2>
              <p className="section-lede">
                Pulled from the official Cardano RSS feed, refreshed daily by
                the site.
              </p>
            </div>
          </div>
          <NewsFeed />
        </div>
      </section>

      <section className="section" id="blog">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>300 blog</h2>
              <p className="section-lede">
                A clean publishing lane for pool notes, governance updates,
                token releases, NFT drops, and Cardano guides.
              </p>
            </div>
          </div>
          <div className="grid three-grid">
            {blogPosts.map((post) => (
              <article className="blog-card" key={post.slug}>
                <time>{post.date}</time>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <a href={`/blog/${post.slug}`}>Read</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>
            300spo.live - Cardano data, swaps, stake pool, DRep, news, and
            community writing.
          </p>
        </div>
      </footer>
    </main>
  );
}
