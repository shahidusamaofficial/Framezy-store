import { supabase } from "./supabaseClient";

export const BLOG_CATEGORIES = [
  { slug: "decor-ideas", name: "Decor Ideas" },
  { slug: "buying-guides", name: "Buying Guides" },
  { slug: "room-inspiration", name: "Room Inspiration" },
  { slug: "islamic-art", name: "Islamic Art" },
  { slug: "gifting", name: "Gifting" },
];

function mapPost(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    coverImage: row.cover_image,
    content: row.content,
    category: row.category,
    tags: row.tags || [],
    seoTitle: row.seo_title || row.title,
    seoDescription: row.seo_description || row.excerpt || "",
    publishedAt: row.published_at,
  };
}

export async function getBlogPosts() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (error || !data) return [];
    return data.map(mapPost);
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) return null;
    return mapPost(data);
  } catch {
    return null;
  }
}

export function filterPostsByCategory(posts, categorySlug) {
  if (!categorySlug || categorySlug === "all") return posts;
  return posts.filter((p) => p.category === categorySlug);
}
