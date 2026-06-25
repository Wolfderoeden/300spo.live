import Link from "next/link";
import { blogPosts } from "../data/blog";

export default function BlogPage() {
  return (
    <main className="site-shell">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h1 className="text-5xl font-black text-white">300 blog</h1>
              <p className="section-lede">
                Updates from the 300 Cardano ecosystem.
              </p>
            </div>
          </div>
          <div className="grid three-grid">
            {blogPosts.map((post) => (
              <article className="blog-card" key={post.slug}>
                <time>{post.date}</time>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`}>Read</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
