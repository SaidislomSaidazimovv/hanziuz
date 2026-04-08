import BlogArticleClient from "./BlogArticleClient";

export const metadata = {
  title: "Maqola — HanziUz Blog",
};

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogArticleClient slug={slug} />;
}
