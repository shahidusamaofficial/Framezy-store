"use client";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";

export default function HomeCTA() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "email", value: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(true);
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <section className="px-6 py-32 text-center">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cream/5">
            <Check size={24} />
          </div>
          <h2 className="text-huge font-semibold">Check your email!</h2>
          <p className="mt-4 text-cream/50">We've sent your 10% off code to <strong className="text-cream">{email}</strong></p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-32 text-center">
      <div className="mx-auto max-w-lg">
        <h2 className="text-huge font-semibold">Get 10% off your first piece.</h2>
        <p className="mt-4 text-cream/50">Drop your email and we'll send a code you can use today.</p>
        <form onSubmit={submit} className="mt-8 flex justify-center gap-2">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="rounded-full border border-cream/15 bg-transparent px-5 py-3 text-sm outline-none focus:border-cream/40" />
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-clay px-6 py-3 text-sm font-medium text-cream transition hover:opacity-90 disabled:opacity-60">
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Sending…" : "Get my code →"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-clay">{error}</p>}
      </div>
    </section>
  );
}
