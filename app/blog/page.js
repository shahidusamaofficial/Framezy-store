import Link from "next/link";
import Image from "next/image";
import { getBlogPosts, BLOG_CATEGORIES } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_NAME } from "@/lib/site-config";

export const revalidate = 60;

export const metadata = {
  title: "Blog — Wall Art Ideas & Guides",
  description:
    "Wall art inspiration, buying guides, and room ideas from The Wall Edit — Pakistan's home for gallery-grade frames and canvas art.",
  alternates: { canonical: "/blog" },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog" }]} />

      <div className="mb-10">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">The Wall Edit Journal</p>
        <h1 className="font-display text-4xl text-cream md:text-5xl">Ideas &amp; Guides</h1>
        <p className="mt-3 max-w-xl text-cream/60">
          Room inspiration, buying guides, and everything else we've learned about putting art on walls in Pakistan.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="py-20 text-center text-cream/50">No posts yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl retro-border bg-[#241811] transition hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#2c1e14]">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                {post.category && (
                  <p className="text-[11px] uppercase tracking-wider text-gold/80">
                    {BLOG_CATEGORIES.find((c) => c.slug === post.category)?.name || post.category}
                  </p>
                )}
                <h2 className="font-display text-lg leading-snug text-cream group-hover:text-gold">
                  {post.title}
                </h2>
                <p className="line-clamp-2 text-sm text-cream/60">{post.excerpt}</p>
                <p className="mt-auto pt-2 text-xs text-cream/40">{formatDate(post.publishedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
