import Link from "next/link";
import Image from "next/image";

const displayImages = {
  islamic: "https://homezdecorz.com/cdn/shop/collections/HD-610-BASMALA-CALLIGRAPHY-WALL-HANGING-_-ISLAMIC-WALL-ART.png?width=600",
  abstract: "https://homezdecorz.com/cdn/shop/files/ChatGPT_Image_Aug_12_2026_04_54_31_PM.png?width=600",
  typography: "https://homezdecorz.com/cdn/shop/collections/il_1588xN.7289646611_olmk.jpg?width=600",
  floral: "https://homezdecorz.com/cdn/shop/collections/HD-549-Luxury-Golden-Leaves-Art-_-3-Panel-Set_512868cf-5fde-47c9-a2d8-6f42a113c6b7.png?width=600",
  animal: "https://homezdecorz.com/cdn/shop/files/g1.webp?width=600",
  girlish: "https://homezdecorz.com/cdn/shop/collections/ABSTRACT-MOON-GIRL-ART-HD-723_c7a45e39-335c-4fd8-ac1e-c166d4191a7d.jpg?width=600",
  kids: "https://homezdecorz.com/cdn/shop/files/FOUR_QUKS_1800x1800_616aea7f-d338-4a0f-8ae7-fabd145a7bca.jpg?width=600",
  "panel-sets": "https://homezdecorz.com/cdn/shop/files/4003A7A0-0F74-491D-9D6B-E202BAF4A906.jpg?width=600",
  custom: "https://homezdecorz.com/cdn/shop/files/Gemini_Generated_Image_cy15r6cy15r6cy15_1.png?width=600",
};

export default function CategoryGrid({ categories }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">Browse by mood</p>
          <h2 className="font-display text-3xl text-cream md:text-4xl">Frames by Category</h2>
        </div>
        <Link href="/shop" className="hidden text-sm text-cream/60 underline-offset-4 hover:underline md:block">
          View all categories
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop?category=${c.slug}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl retro-border"
          >
            <Image
              src={displayImages[c.slug]}
              alt={c.name}
              fill
              sizes="(max-width: 768px) 45vw, 22vw"
              className="object-cover transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
            <div className="glass absolute inset-x-2 bottom-2 rounded-xl p-3">
              <p className="font-display text-lg text-cream">{c.name}</p>
              <p className="mt-0.5 line-clamp-1 text-[11px] text-cream/60">{c.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
