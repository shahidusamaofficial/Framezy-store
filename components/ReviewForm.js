"use client";

import { useState } from "react";
import { Star, Loader2, ImagePlus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ReviewForm({ slug }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // null | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  if (!supabase) {
    return (
      <p className="text-sm text-cream/50">
        Reviews aren't connected yet — add your Supabase env vars to enable this form.
      </p>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setSubmitting(true);
    setStatus(null);
    setErrorMsg("");

    try {
      let photoUrl = null;

      if (photo) {
        const path = `${slug}-${Date.now()}-${photo.name}`;
        const { error: uploadError } = await supabase.storage
          .from("review-photos")
          .upload(path, photo);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage
          .from("review-photos")
          .getPublicUrl(path);
        photoUrl = publicUrlData?.publicUrl || null;
      }

      const { error: insertError } = await supabase.from("reviews").insert({
        product_slug: slug,
        customer_name: name.trim(),
        rating,
        comment: comment.trim(),
        photo_url: photoUrl,
      });
      if (insertError) throw insertError;

      setStatus("success");
      setName("");
      setRating(5);
      setComment("");
      setPhoto(null);
    } catch (err) {
      setStatus("error");
      setErrorMsg("Something went wrong submitting your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "success") {
    return (
      <div className="glass rounded-xl p-4 text-sm text-cream/80">
        Thanks for your review! It'll appear here once we approve it.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass space-y-3 rounded-xl p-4">
      <p className="text-sm font-semibold text-cream">Leave a review</p>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${n} out of 5`}
          >
            <Star
              size={20}
              className={
                n <= (hoverRating || rating)
                  ? "fill-gold text-gold"
                  : "text-cream/25"
              }
            />
          </button>
        ))}
      </div>

      <input
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream outline-none focus:border-gold"
      />

      <textarea
        required
        rows={3}
        placeholder="What did you think?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream outline-none focus:border-gold"
      />

      <label className="flex w-fit cursor-pointer items-center gap-2 text-xs text-cream/50 hover:text-cream/80">
        <ImagePlus size={14} />
        {photo ? photo.name : "Add a photo (optional)"}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          className="hidden"
        />
      </label>

      {status === "error" && <p className="text-sm text-clay">{errorMsg}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center justify-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-rust disabled:opacity-60"
      >
        {submitting && <Loader2 size={14} className="animate-spin" />}
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
