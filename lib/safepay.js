import { Safepay } from "@sfpy/node-sdk";

// Server-only. Never import this file from a "use client" component — the
// keys here must never reach the browser bundle.
//
// Environment variables required (set these in Vercel → Settings →
// Environment Variables, and in .env.local for local dev):
//   SAFEPAY_API_KEY        — your Secret Key from the Safepay dashboard
//   SAFEPAY_V1_SECRET       — your Public Key from the Safepay dashboard
//   SAFEPAY_WEBHOOK_SECRET  — found under Webhooks in the Safepay dashboard
//   NEXT_PUBLIC_SAFEPAY_ENV — "sandbox" or "production" (safe to expose)
//
// IMPORTANT: I mapped "Secret Key" → apiKey and "Public Key" → v1Secret
// based on the most common convention in Safepay's own SDK examples, but
// I could not verify this against your actual live dashboard. If payment
// creation fails with an auth error, try swapping which key goes in which
// variable — check Safepay's dashboard labels/support if unsure.
export function getSafepayClient() {
  return new Safepay({
    environment: process.env.NEXT_PUBLIC_SAFEPAY_ENV === "production" ? "production" : "sandbox",
    apiKey: process.env.SAFEPAY_API_KEY,
    v1Secret: process.env.SAFEPAY_V1_SECRET,
    webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET,
  });
}
