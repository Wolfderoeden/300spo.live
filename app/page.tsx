import { ArrowDown, ArrowUpRight, Shield, Snowflake } from "lucide-react";
import { LiveTicker, MetricsGrid } from "./components/LiveMetrics";
import { NewsFeed } from "./components/NewsFeed";
import { TradePanel } from "./components/TradePanel";
import { blogPosts } from "./data/blog";
import {
  DREP_ID,
  LEGACY_DREP_ID,
  NFT_COLLECTION_URL,
  POOL_PM_URL,
  TOKEN_ID,
} from "./lib/constants";

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="#top">
          <span className="brand-mark">300</span>
          <span>300spo.live</span>
        </a>
        <div className="nav-links">
          <a href="#metrics">Metrics</a>
          <a href="#trade">Trade</a>
          <a href="#news">News</a>
          <a href="#blog">Blog</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-noise" />
        <div className="container hero-content">
          <div>
            <span className="eyebrow">
              <span className="status-dot" />
              Cardano hub for 300
            </span>
            <h1>300spo.live</h1>
            <p className="hero-copy">
              Token, 300 Degens, stake pool, DRep identity, Minswap trading,
              ADA access, and daily Cardano news in one arctic command center.
            </p>
            <div className="hero-actions">
              <a className="pill-link primary-action" href="#trade">
                Trade 300
                <ArrowDown size={16} />
              </a>
              <a
                className="pill-link"
                href={POOL_PM_URL}
                target="_blank"
                rel="noreferrer"
              >
                View pool
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
                On-chain 300, SPO, NFT, and DRep surfaces. Missing reads stay
                empty and render as a dash.
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
          </div>
          <div className="glass-card panel">
            <div className="accent-bar" />
            <span className="label">Ecosystem</span>
            <h2 className="mt-3">Token, NFTs, SPO, DRep</h2>
            <p className="copy-block mt-4">
              The 300 token and 300 Degens collection sit next to the 300 stake
              pool and the registered DRep identity, so visitors can inspect,
              stake, trade, buy ADA, and read updates from one place.
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
          </div>
        </div>
      </section>

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
