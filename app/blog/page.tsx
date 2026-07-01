import Link from "next/link";
import { getSitePayload } from "../lib/content";

export const runtime = "edge";

export default async function BlogPage() {
  const { content } = await getSitePayload();
  const posts = content.discoverItems
    .filter((item) => item.visible && item.type === "blog")
    .sort((a, b) => a.order - b.order);

  return (
    <main className="site-shell">
      <section className="section content-document">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-kicker">Discover</span>
              <h1 className="page-title">300 blog</h1>
              <p className="section-lede">
                Long-form updates from the 300 Cardano ecosystem.
              </p>
            </div>
          </div>
          <div className="grid three-grid">
            {posts.map((post) => (
              <article className="blog-card" key={post.slug}>
                <time>{post.date}</time>
                <h3>{post.title}</h3>
                <p>{post.excerpt || post.body || "-"}</p>
                <Link href={`/discover/${post.slug}`}>Read</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
