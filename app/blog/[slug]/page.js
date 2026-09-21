import { notFound } from "next/navigation";
import Image from "next/image";
import { marked } from "marked";
import { getBlogPostBySlug, getBlogPosts, BLOG_CATEGORIES } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found", robots: { index: false } };
  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPostPage({ params }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = await getBlogPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);

  // Content is authored only by the site owner via a private tool — not
  // public user input — so rendering it as HTML here is safe.
  const contentHtml = marked.parse(post.content || "");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title },
        ]}
      />

      <div className="mt-4">
        {post.category && (
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-gold">
            {BLOG_CATEGORIES.find((c) => c.slug === post.category)?.name || post.category}
          </p>
        )}
        <h1 className="font-display text-3xl leading-tight text-cream md:text-5xl">{post.title}</h1>
        <p className="mt-3 text-sm text-cream/50">{formatDate(post.publishedAt)}</p>
      </div>

      {post.coverImage && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image src={post.coverImage} alt={post.title} fill sizes="100vw" className="object-cover" priority />
        </div>
      )}

      <div
        className="prose-blog mt-10 text-cream/80"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {post.tags?.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-white/10 pt-6">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-xs text-cream/60">
              {tag}
            </span>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16 border-t border-white/10 pt-10">
          <h2 className="font-display text-xl text-cream">More from the journal</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <a key={p.slug} href={`/blog/${p.slug}`} className="text-sm text-gold hover:underline">
                {p.title}
              </a>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .prose-blog h2 { font-family: var(--font-display, serif); font-size: 1.5rem; color: #f3ecdf; margin: 2rem 0 0.75rem; }
        .prose-blog h3 { font-family: var(--font-display, serif); font-size: 1.25rem; color: #f3ecdf; margin: 1.5rem 0 0.5rem; }
        .prose-blog p { margin: 0 0 1rem; line-height: 1.75; }
        .prose-blog ul, .prose-blog ol { margin: 0 0 1rem; padding-left: 1.5rem; }
        .prose-blog li { margin-bottom: 0.4rem; }
        .prose-blog a { color: #c9a35a; text-decoration: underline; }
        .prose-blog img { border-radius: 12px; margin: 1.5rem 0; }
        .prose-blog strong { color: #f3ecdf; }
        .prose-blog blockquote { border-left: 2px solid #c9a35a; padding-left: 1rem; color: rgba(243,236,223,0.7); font-style: italic; margin: 1.5rem 0; }
      `}</style>
    </main>
  );
}
