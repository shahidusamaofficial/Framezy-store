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
  if (!supabase) return staticProducts.map(normalizeProduct);
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return staticProducts.map(normalizeProduct);
    return data.map(mapProduct);
  } catch {
    return staticProducts.map(normalizeProduct);
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
  if (!supabase) {
    const p = getStaticProductBySlug(slug);
    return p ? normalizeProduct(p) : null;
  }
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) {
      const p = getStaticProductBySlug(slug);
      return p ? normalizeProduct(p) : null;
    }
    return mapProduct(data);
  } catch {
    const p = getStaticProductBySlug(slug);
    return p ? normalizeProduct(p) : null;
  }
}

export function filterByCategory(products, categorySlug) {
  if (!categorySlug || categorySlug === "all") return products;
  return products.filter((p) => p.category === categorySlug);
}
