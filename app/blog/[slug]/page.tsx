import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/app/data/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="site-shell">
      <article className="section">
        <div className="container">
          <Link className="pill-link mb-6" href="/#blog">
            Back
          </Link>
          <div className="glass-card panel">
            <time className="label">{post.date}</time>
            <h1 className="mt-4 max-w-3xl text-5xl font-black leading-none text-white">
              {post.title}
            </h1>
            <div className="mt-8 max-w-3xl space-y-5">
              {post.body.map((paragraph) => (
                <p className="copy-block" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
