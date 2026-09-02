# Framezy — Wall Frame Storefront

A Next.js + Tailwind storefront for a Pakistan-based wall frame / canvas art
business. Retro-glass aesthetic, quick view, bundles, cart with flat shipping
logic, ready to connect to Supabase.

If you ever want to rename again: find/replace "Framezy" across
`app/layout.js`, `components/Navbar.js`, and `components/Footer.js` — note
the logo in the last two files is split into two `<span>`s for the gradient
accent (`Frame` / `zy`), so keep that split when swapping in a new name.

## What's inside

- **Retro-glass design system** — warm terracotta/gold palette, Fraunces display
  serif, frosted "liquid glass" cards (`app/globals.css` → `.glass` / `.glass-dark`)
- **Animated hero** with floating glass image cards and a marquee strip
  (`components/Hero.js`)
- **Quick View modal** — size + qty selection without leaving the grid
  (`components/QuickView.js`)
- **Bundles section** — curated multi-product sets sold as one line item
  (`components/BundleSection.js`)
- **Cart drawer** with a real shipping model: flat Rs. 250 per order, waived
  above Rs. 6,000 subtotal (`lib/cart-context.js` — tune `SHIPPING_FLAT_RATE`
  and `FREE_SHIPPING_THRESHOLD` there)
- **Checkout page** that writes orders straight into Supabase (falls back
  gracefully if Supabase isn't connected yet)
- **Supabase schema** (`supabase/schema.sql`) for products, categories,
  bundles, and orders with row-level security already set up

Product data currently lives in `lib/products.js`, seeded from the categories
and structure of the reference site you shared. **Swap the `image` URLs for
your own product photography before launch** — they're hot-linked placeholders
so the site isn't empty on day one, not something to ship with.

---

## Step-by-step: from this folder to a live site

### 1. Get the code running locally (optional but recommended)

You'll need [Node.js 18+](https://nodejs.org) installed.

```bash
cd framezy
npm install
npm run dev
```

Open `http://localhost:3000` — the site works immediately using the static
catalog in `lib/products.js`, even before Supabase is connected.

### 2. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Once it's created, open **SQL Editor → New query**.
3. Paste the contents of `supabase/schema.sql` and click **Run**. This creates
   `categories`, `products`, `bundles`, and `orders` tables with the right
   permissions, and seeds the category list.
4. Go to **Project Settings → API**. Copy the **Project URL** and the
   **anon public key**.
5. In the project folder, copy `.env.example` to `.env.local` and paste those
   two values in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
6. (Optional, later) Seed `products` and `bundles` from `lib/products.js` —
   either insert rows manually in the Table Editor, or write a one-off script
   that reads the file and calls `supabase.from('products').insert(...)`.
   Until you do this, the site keeps working off the static file, so there's
   no rush.

### 3. Push the code to GitHub

```bash
cd framezy
git init
git add .
git commit -m "Initial Framezy storefront"
```

Then on [github.com](https://github.com):
1. Click **New repository**, name it (e.g. `framezy-store`), keep it empty
   (no README/license — you already have files).
2. Copy the commands GitHub shows you under "…or push an existing repository":
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/framezy-store.git
   git branch -M main
   git push -u origin main
   ```

### 4. Deploy on Netlify

This repo already includes a `netlify.toml` that tells Netlify to use its
official Next.js Runtime, so no manual config is needed.

1. Go to [netlify.com](https://netlify.com) → **Add new site → Import an
   existing project**.
2. Choose **GitHub**, authorize Netlify, and pick the repo you just pushed.
3. Netlify reads `netlify.toml` automatically and sets the build command
   (`npm run build`) for you — leave the defaults as they are.
4. Before deploying, open **Add environment variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (same values as your `.env.local`)
5. Click **Deploy site**. In a minute or two you'll get a free live URL at
   `random-name-123.netlify.app`.
6. Rename the subdomain to something on-brand for free: **Site
   configuration → Domain management → Options → Edit site name** — e.g.
   change it to `framezy.netlify.app`.
7. Optional, once you actually buy a domain (Netlify doesn't sell domains,
   but pointing one at Netlify is free): **Domain management → Add a domain**,
   then add the CNAME/A records Netlify shows you at your registrar
   (Namecheap, GoDaddy, or PKNIC for a `.pk` domain).

### 5. Post-launch checklist

- Replace placeholder product photos in `lib/products.js` with your own shoots.
- Update the WhatsApp number in `components/Footer.js` (currently a placeholder).
- Tune `SHIPPING_FLAT_RATE` and `FREE_SHIPPING_THRESHOLD` in
  `lib/cart-context.js` to match your real courier costs.
- Consider adding a payment gateway (JazzCash/Easypaisa/Stripe) — right now
  checkout supports Cash on Delivery and records "card" orders for manual
  follow-up; wiring live card payments is a separate integration.
- Add Google Analytics / Meta Pixel in `app/layout.js` once you're running ads.

---

## Project structure

```
app/
  layout.js          — fonts, cart provider, nav/footer shell
  page.js             — homepage (hero, bestsellers, categories, bundles, reviews)
  shop/page.js         — full catalog with category filter
  checkout/page.js     — checkout form → Supabase orders table
  checkout/success/    — order confirmation
  globals.css         — design tokens + liquid glass utilities
components/            — Navbar, Hero, ProductCard, QuickView, CartDrawer, etc.
lib/
  products.js          — catalog + bundle data (swap for Supabase fetch later)
  cart-context.js       — cart state, shipping calculation, localStorage
  supabaseClient.js     — Supabase browser client
supabase/schema.sql     — full DB schema + RLS policies
netlify.toml            — Netlify build config (Next.js Runtime)
```
