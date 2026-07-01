import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/discover/${slug}`);
}
