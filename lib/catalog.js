import { supabase } from "./supabaseClient";
import {
  categories as staticCategories,
  products as staticProducts,
  bundles as staticBundles,
  getProductBySlug as getStaticProductBySlug,
} from "./products";

const DEFAULT_FEATURES = [
  "Authentic luster print with rich, fade-resistant color",
  "Sturdy wood backing built for Pakistan's heat and humidity",
  "Ready to hang — mounting hooks attached",
  "Wipe-clean surface, easy to maintain",
];

function mapProduct(row) {
  const images = row.images && row.images.length > 0 ? row.images : [row.image].filter(Boolean);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category_slug,
    panels: row.panels ?? 1,
    price: Number(row.price),
    compareAt: row.compare_at != null ? Number(row.compare_at) : null,
    rating: row.rating != null ? Number(row.rating) : 0,
    reviews: row.reviews ?? 0,
    image: row.image,
    images,
    sizes: row.sizes ?? [],
    description: row.description ?? "",
    features: row.features && row.features.length > 0 ? row.features : DEFAULT_FEATURES,
    isCustom: !!row.is_custom,
    room: row.room_slug || null,
    sizePrices: row.size_prices || null,
  };
}

function mapBundle(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    productIds: row.product_ids ?? [], // these are product *slugs*
    price: Number(row.price),
    compareAt: row.compare_at != null ? Number(row.compare_at) : null,
    image: row.image,
  };
}

// Each getter tries Supabase first (if configured) and only falls back to
// the bundled static catalog when Supabase isn't set up yet, the query
// fails, or the table is still empty — so the site never shows a blank
// page while you're getting Supabase populated.

function normalizeProduct(p) {
  const images = p.images && p.images.length > 0 ? p.images : [p.image].filter(Boolean);
  const features = p.features && p.features.length > 0 ? p.features : DEFAULT_FEATURES;
  return { ...p, images, features };
}

// Real review stats, computed from approved reviews only. This always wins
// over any rating/reviews value sitting in the products table or the static
// fallback file — those are legacy placeholder fields and are intentionally
// never shown to customers. A product with zero real approved reviews shows
// rating: 0, which ProductCard/product pages already treat as "hide it."
export async function getReviewStatsMap() {
  if (!supabase) return {};
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("product_slug, rating")
      .eq("is_approved", true);
    if (error || !data) return {};
    const totals = {};
    for (const r of data) {
      if (!totals[r.product_slug]) totals[r.product_slug] = { sum: 0, count: 0 };
      totals[r.product_slug].sum += r.rating;
      totals[r.product_slug].count += 1;
    }
    const stats = {};
    for (const slug in totals) {
      stats[slug] = {
        rating: Math.round((totals[slug].sum / totals[slug].count) * 10) / 10,
        reviews: totals[slug].count,
      };
    }
    return stats;
  } catch {
    return {};
  }
}

function applyRealStats(product, statsMap) {
  if (!product) return product;
  const stats = statsMap[product.slug];
  return {
    ...product,
    rating: stats ? stats.rating : 0,
    reviews: stats ? stats.reviews : 0,
  };
}

export async function getCategories() {
  if (!supabase) return staticCategories;
  try {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error || !data || data.length === 0) return staticCategories;
    return data.map((c) => ({ slug: c.slug, name: c.name, blurb: c.blurb }));
  } catch {
    return staticCategories;
  }
}

export async function getProducts() {
  const statsMap = await getReviewStatsMap();
  if (!supabase) {
    return staticProducts.map(normalizeProduct).map((p) => applyRealStats(p, statsMap));
  }
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      return staticProducts.map(normalizeProduct).map((p) => applyRealStats(p, statsMap));
    }
    return data.map(mapProduct).map((p) => applyRealStats(p, statsMap));
  } catch {
    return staticProducts.map(normalizeProduct).map((p) => applyRealStats(p, statsMap));
  }
}

export async function getBundles() {
  if (!supabase) return staticBundles;
  try {
    const { data, error } = await supabase
      .from("bundles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return staticBundles;
    return data.map(mapBundle);
  } catch {
    return staticBundles;
  }
}

export async function getProductBySlug(slug) {
  const statsMap = await getReviewStatsMap();
  if (!supabase) {
    const p = getStaticProductBySlug(slug);
    return p ? applyRealStats(normalizeProduct(p), statsMap) : null;
  }
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) {
      const p = getStaticProductBySlug(slug);
      return p ? applyRealStats(normalizeProduct(p), statsMap) : null;
    }
    return applyRealStats(mapProduct(data), statsMap);
  } catch {
    const p = getStaticProductBySlug(slug);
    return p ? applyRealStats(normalizeProduct(p), statsMap) : null;
  }
}

// Full list of approved reviews (with comments) for a single product page.
export async function getProductReviews(slug) {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_slug", slug)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((r) => ({
      id: r.id,
      name: r.customer_name,
      rating: r.rating,
      comment: r.comment,
      photoUrl: r.photo_url,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

export function filterByCategory(products, categorySlug) {
  if (!categorySlug || categorySlug === "all") return products;
  return products.filter((p) => p.category === categorySlug);
}

export async function getBundleBySlug(slug) {
  if (!supabase) {
    return staticBundles.find((b) => b.slug === slug) || null;
  }
  try {
    const { data, error } = await supabase
      .from("bundles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) {
      return staticBundles.find((b) => b.slug === slug) || null;
    }
    return mapBundle(data);
  } catch {
    return staticBundles.find((b) => b.slug === slug) || null;
  }
}
