import Image from "next/image";
import { Star } from "lucide-react";
import ReviewForm from "@/components/ReviewForm";

export default function ProductReviews({ slug, reviews, averageRating, reviewCount }) {
  return (
    <section className="mt-16 border-t border-white/10 pt-10">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-2xl text-cream">Customer Reviews</h2>
        {reviewCount > 0 && (
          <div className="flex items-center gap-1 text-sm text-cream/60">
            <Star size={14} className="fill-gold text-gold" />
            {averageRating} · {reviewCount} review{reviewCount === 1 ? "" : "s"}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5">
          {reviews.length === 0 ? (
            <p className="text-sm text-cream/50">
              No reviews yet — be the first to share what you think.
            </p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-cream">{r.name}</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={13}
                        className={n <= r.rating ? "fill-gold text-gold" : "text-cream/20"}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">{r.comment}</p>
                {r.photoUrl && (
                  <div className="relative mt-3 h-32 w-32 overflow-hidden rounded-lg">
                    <Image src={r.photoUrl} alt={`Photo from ${r.name}`} fill className="object-cover" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <ReviewForm slug={slug} />
      </div>
    </section>
  );
}
