import {
  ArrowDown,
  ArrowUpRight,
  Compass,
  Landmark,
  Shield,
  Snowflake,
} from "lucide-react";
import type { CSSProperties } from "react";
import {
  DrepProfileCard,
  LiveTicker,
  MetricsGrid,
} from "./components/LiveMetrics";
import { NewsFeed } from "./components/NewsFeed";
import { TradePanel } from "./components/TradePanel";
import { WalletConnectButton } from "./components/WalletConnectButton";
import {
  getSitePayload,
  type DiscoverItem,
  type MediaItem,
} from "./lib/content";
import {
  DREP_ID,
  LEGACY_DREP_ID,
  NFT_COLLECTION_URL,
  POOL_PM_URL,
  TOKEN_ID,
} from "./lib/constants";

export const runtime = "edge";

const discoverTypeLabels: Record<DiscoverItem["type"], string> = {
  project: "Project",
  blog: "Blog",
  news: "News",
};

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

function ProfileVisual({
  media,
  label,
  title,
}: {
  media: MediaItem[];
  label: string;
  title: string;
}) {
  const item = media[0];

  if (item) {
    return <MediaTile item={item} />;
  }

  return (
    <div className="profile-visual" aria-label={title}>
      <span>{label}</span>
      <strong>{title}</strong>
    </div>
  );
}

function DiscoverCard({
  item,
  media,
}: {
  item: DiscoverItem;
  media: MediaItem[];
}) {
  const preview = mediaByPlacement(media, item.mediaPlacement)[0];
  const href = item.link || `/discover/${item.slug}`;
  const isExternal = href.startsWith("http");

  return (
    <article className={`discover-card ${item.featured ? "is-featured" : ""}`}>
      {preview ? (
        <MediaTile item={preview} />
      ) : (
        <div className="discover-visual">
          <Compass size={24} aria-hidden />
          <span>{discoverTypeLabels[item.type]}</span>
        </div>
      )}
      <div className="discover-card-body">
        <div className="card-meta">
          <span>{discoverTypeLabels[item.type]}</span>
          {item.date ? <time>{item.date}</time> : null}
        </div>
        <h3>{item.title}</h3>
        <p>{item.excerpt || item.body || "-"}</p>
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
        >
          Open
          <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
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
  const spoSection = sections.find((section) => section.id === "spo-profile");
  const drepSection = sections.find((section) => section.id === "drep-profile");
  const customSections = sections.filter(
    (section) =>
      section.id !== "ecosystem" &&
      section.id !== "spo-profile" &&
      section.id !== "drep-profile",
  );
  const discoverItems = [...content.discoverItems]
    .filter((item) => item.visible)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
  const heroMedia = mediaByPlacement(media, "hero")[0];
  const ecosystemMedia = mediaByPlacement(media, "ecosystem");
  const spoMedia = mediaByPlacement(media, "spo");
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
          <a href="#ecosystem">Ecosystem</a>
          <a href="#governance">SPO + DRep</a>
          <a href="#trade">Trade</a>
          <a href="#discover">Discover</a>
          {pages.map((page) => (
            <a href={`/content/${page.slug}`} key={page.id}>
              {page.navLabel}
            </a>
          ))}
        </div>
        <WalletConnectButton />
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
            <p className="hero-copy">{content.hero.body}</p>
            <div className="hero-actions">
              <a className="pill-link primary-action" href="#discover">
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

      <section className="section compact-section" id="metrics">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-kicker">Live on-chain surface</span>
              <h2>Signals visitors can verify.</h2>
              <p className="section-lede">
                Pool, token, NFT, chain, and DRep values are read from Cardano
                data sources. If a value cannot be fetched, the site shows a
                dash.
              </p>
            </div>
            <Snowflake aria-hidden />
          </div>
          <MetricsGrid />
        </div>
      </section>

      <section className="section" id="ecosystem">
        <div className="container grid two-grid ecosystem-grid">
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
          <div className="glass-card panel feature-panel">
            <div className="accent-bar" />
            <span className="label">Ecosystem</span>
            <h2 className="mt-3">
              {ecosystemSection?.title ?? "300 Token + 300 Degens"}
            </h2>
            <p className="copy-block mt-4">
              {ecosystemSection?.body ??
                "The token and NFT collection are shown together as the public 300 identity, with SPO and DRep data connected beside them."}
            </p>
            <div className="id-stack">
              <span className="id-chip">Token ID: {TOKEN_ID}</span>
              <span className="id-chip">DRep: {DREP_ID}</span>
              <span className="id-chip">Legacy DRep: {LEGACY_DREP_ID}</span>
            </div>
            <div className="inline-actions">
              <a
                className="pill-link"
                href={NFT_COLLECTION_URL}
                target="_blank"
                rel="noreferrer"
              >
                300 Degens
                <ArrowUpRight size={16} />
              </a>
              {ecosystemSection?.ctaHref && ecosystemSection.ctaLabel ? (
                <a
                  className="pill-link"
                  href={ecosystemSection.ctaHref}
                  target={
                    ecosystemSection.ctaHref.startsWith("http")
                      ? "_blank"
                      : undefined
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
        </div>
      </section>

      <section className="section" id="governance">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-kicker">Operate + govern</span>
              <h2>SPO and DRep in one view.</h2>
              <p className="section-lede">
                The operational and governance profiles are separated enough to
                scan quickly, but close enough that visitors understand the
                full 300 Cardano footprint.
              </p>
            </div>
            <Landmark aria-hidden />
          </div>
          <div className="grid two-grid profile-grid">
            <article className="glass-card panel profile-card">
              <ProfileVisual media={spoMedia} label="SPO" title="300 Stake Pool" />
              <div>
                <div className="accent-bar" />
                <span className="label">{spoSection?.eyebrow ?? "Stake pool"}</span>
                <h3>{spoSection?.title ?? "300 SPO"}</h3>
                <p className="copy-block">
                  {spoSection?.body ??
                    "Pool activity, live stake, delegation, blocks, and Cardano network participation in one readable profile."}
                </p>
                {spoSection?.ctaHref && spoSection.ctaLabel ? (
                  <a
                    className="pill-link"
                    href={spoSection.ctaHref}
                    target={
                      spoSection.ctaHref.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      spoSection.ctaHref.startsWith("http")
                        ? "noreferrer"
                        : undefined
                    }
                  >
                    {spoSection.ctaLabel}
                    <ArrowUpRight size={16} />
                  </a>
                ) : null}
              </div>
            </article>

            <article className="glass-card panel profile-card">
              <ProfileVisual media={drepMedia} label="DRep" title="300 Governance" />
              <div>
                <div className="accent-bar" />
                <span className="label">{drepSection?.eyebrow ?? "Governance"}</span>
                <h3>{drepSection?.title ?? "300 DRep"}</h3>
                <p className="copy-block">
                  {drepSection?.body ??
                    "Current delegated ADA and DRep status are shown from on-chain data."}
                </p>
                <DrepProfileCard />
              </div>
            </article>
          </div>
        </div>
      </section>

      {customSections.map((section) => (
        <section className="section" key={section.id}>
          <div className="container grid two-grid">
            <div className="glass-card panel feature-panel">
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
              {mediaByPlacement(media, section.mediaPlacement)
                .slice(0, 3)
                .map((item) => (
                  <MediaTile item={item} key={item.id} />
                ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section" id="trade">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-kicker">Action layer</span>
              <h2>Get ADA, then explore 300.</h2>
              <p className="section-lede">
                CardanoMix is the entry route for ADA. Minswap handles swaps
                with partner code 300spolive, while wallet connection stays
                available from the top bar.
              </p>
            </div>
            <Shield aria-hidden />
          </div>
          <TradePanel />
        </div>
      </section>

      <section className="section" id="discover">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-kicker">Discover</span>
              <h2>News, writing, and projects.</h2>
              <p className="section-lede">
                One place for automatic Cardano news and 300-owned updates:
                projects, blog posts, release notes, governance context, and
                community stories managed from the admin area.
              </p>
            </div>
            <Compass aria-hidden />
          </div>

          {discoverItems.length > 0 ? (
            <div className="grid discover-grid">
              {discoverItems.slice(0, 6).map((item) => (
                <DiscoverCard item={item} media={media} key={item.id} />
              ))}
            </div>
          ) : (
            <div className="glass-card panel">
              <span className="fallback-mark">-</span>
            </div>
          )}

          <div className="discover-news">
            <div className="mini-section-header">
              <span className="section-kicker">Daily Cardano feed</span>
              <h3>Latest Cardano news</h3>
            </div>
            <NewsFeed limit={3} />
          </div>
        </div>
      </section>

      {galleryMedia.length > 0 ? (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-kicker">Media</span>
                <h2>Published gallery.</h2>
                <p className="section-lede">
                  Images and videos selected in the admin area and made visible
                  for visitors.
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

      <footer className="footer">
        <div className="container">
          <p>
            300 - Cardano metrics, swaps, stake pool operation, DRep governance,
            Discover updates, and community media.
          </p>
        </div>
      </footer>
    </main>
  );
}
