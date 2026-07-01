import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WalletConnectButton } from "@/app/components/WalletConnectButton";
import { getSitePayload } from "@/app/lib/content";

export const runtime = "edge";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const { content } = await getSitePayload();
  const page = content.pages.find((item) => item.visible && item.slug === slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="site-shell content-document">
      <nav className="nav" aria-label="Primary navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">300</span>
          <span>{content.siteTitle}</span>
        </Link>
        <div className="nav-links">
          <Link href="/#metrics">Live</Link>
          <Link href="/#earn">Earn</Link>
          <Link href="/#trade">Trade</Link>
          <Link href="/#discover">Discover</Link>
        </div>
        <WalletConnectButton />
      </nav>
      <article className="container document-panel">
        <Link className="pill-link" href="/">
          <ArrowLeft size={16} />
          Back
        </Link>
        <h1>{page.title}</h1>
        <p>{page.body}</p>
      </article>
    </main>
  );
}
