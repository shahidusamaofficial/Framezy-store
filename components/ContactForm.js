"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    if (!supabase) {
      setStatus("error");
      setErrorMsg(
        "Supabase isn't connected yet — add your env vars so messages can be saved. Your message wasn't lost, just re-send once it's connected."
      );
      return;
    }

    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject || null,
        message: form.message,
      });
      if (error) throw error;
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg("Something went wrong sending your message. Please try again or WhatsApp us directly.");
    }
  }

  if (status === "success") {
    return (
      <div className="glass rounded-2xl p-6 text-center md:p-8">
        <p className="font-display text-xl text-cream">Message sent!</p>
        <p className="mt-2 text-sm text-cream/60">
          Thanks for reaching out — we'll get back to you as soon as we can.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 rounded-full border border-gold/40 px-5 py-2 text-xs font-semibold text-gold transition hover:bg-gold hover:text-ink"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass space-y-4 rounded-2xl p-6 md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream/60">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream/60">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream/60">Phone (optional)</label>
          <input
            type="tel"
            placeholder="03xx-xxxxxxx"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream/60">Subject (optional)</label>
          <input
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            placeholder="Order question, custom frame, etc."
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream outline-none focus:border-gold"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream/60">Message</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-cream outline-none focus:border-gold"
        />
      </div>

      {status === "error" && <p className="text-sm text-clay">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-clay py-3.5 text-sm font-semibold text-cream transition hover:bg-rust disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
