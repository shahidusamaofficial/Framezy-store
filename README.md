# The Wall Edit — Wall Frame Storefront

A Next.js + Tailwind storefront for a Pakistan-based wall frame / canvas art
business. Retro-glass aesthetic, quick view, bundles, cart with flat shipping
logic, ready to connect to Supabase.

If you ever want to rename again: find/replace "The Wall Edit" across
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
- **Individual product pages** at `/product/your-slug` — SEO metadata, social
  share previews, and a direct link you can send in WhatsApp/Instagram ads
  (`app/product/[slug]/page.js`)
- **Policy & info pages** — About, Contact (with a working form that saves to
  Supabase), Privacy Policy, Shipping Policy, Return & Exchange Policy, and
  Cancellation Policy, all linked from the footer
- **Rich product pages** — image gallery with thumbnails and a full-screen
  zoom lightbox, trust badges, and an accordion with Description / Frame
  Features / Shipping & Returns / FAQ (`app/product/[slug]/page.js`)
- **Floating WhatsApp button** on every page for instant customer questions
- **Full SEO layer** — unique titles/descriptions per page, canonical URLs,
  dynamic `sitemap.xml`, `robots.txt`, `llms.txt`, custom 404, real favicon,
  Organization/WebSite/Product/Breadcrumb structured data, and a working
  site search (the navbar search icon actually filters products now)
- **Bundles section** — curated multi-product sets sold as one line item
  (`components/BundleSection.js`)
- **Cart drawer** with a real shipping model: flat Rs. 250 per order, waived
  above Rs. 6,000 subtotal (`lib/cart-context.js` — tune `SHIPPING_FLAT_RATE`
  and `FREE_SHIPPING_THRESHOLD` there)
- **Checkout page** that writes orders straight into Supabase (falls back
  gracefully if Supabase isn't connected yet)
- **Supabase schema** (`supabase/schema.sql`) for products, categories,
  bundles, and orders with row-level security already set up

Product data lives in Supabase once you've set it up (see below) — the
`lib/products.js` file is only a fallback shown before you add your first
real product, or if Supabase is briefly unreachable. **This fallback isn't
additive** — the moment your Supabase `products` table has even one row,
the demo catalog disappears entirely and only Supabase's contents show.

If you'd like a head start instead of typing 16 products by hand, run
`supabase/seed-demo-products.sql` in the Supabase SQL Editor — it inserts
the same demo products and bundles the site launched with, so you can edit
or delete them one at a time as you get real photos, instead of starting
from zero. Totally optional — skip it if you'd rather start blank.

---

## Managing products, images, and bundles (no code required)

Once the schema is running (Step 2 below) and your site is deployed, you
never need to touch code again to add or edit products. Everything happens
in the Supabase dashboard.

### Set up image storage (one-time)

1. In your Supabase project, click **Storage** in the left sidebar.
2. Click **New bucket**, name it `product-images`, and toggle **Public
   bucket** ON (this is what lets your website display the photos). Click
   Create.

### Add a product

1. Click **Storage → product-images → Upload file**, and upload your product
   photo. Click on the uploaded file and copy its **URL** (it'll look like
   `https://xxxxx.supabase.co/storage/v1/object/public/product-images/yourphoto.jpg`).
2. Click **Table Editor → products → Insert → Insert row**.
3. Fill in the fields:
   - `slug` — a unique URL-safe id, e.g. `sunset-canvas-frame` (lowercase, dashes, no spaces)
   - `name` — e.g. `Sunset Canvas Frame`
   - `category_slug` — must match one of: `islamic`, `abstract`, `typography`, `floral`, `animal`, `girlish`, `kids`, `panel-sets`, `custom`
   - `panels` — `1` for a single frame, `2`–`10` for multi-panel sets
   - `price` — the selling price, e.g. `2500`
   - `compare_at` — optional "was" price for showing a discount, e.g. `5000`
   - `image` — paste the Storage URL you copied in step 1
   - `sizes` — click into the array field and add entries like `16x20in`, `20x28in`
   - `description` — a short paragraph shown in Quick View
   - `is_custom` — leave unchecked unless it's a custom/personalized frame
4. Click **Save**. It appears on your live site within about a minute
   (or instantly on the Shop page, which always fetches fresh).

### Edit or remove a product

Go to **Table Editor → products**, click the row, edit any field, and save.
To remove it, select the row and click **Delete**.

### Add a bundle

1. **Table Editor → bundles → Insert row**.
2. Fill in `slug`, `name`, `description`, `price`, `compare_at`, and `image`
   (same Storage upload process as above).
3. For `product_ids`, add the **slugs** of the products included in the
   bundle, e.g. `{"sunset-canvas-frame","lucky-typography-frame"}` — these
   must exactly match the `slug` values of existing products.

### Add a new category

**Table Editor → categories → Insert row** — just `slug`, `name`, and
`blurb`. It'll show up in the navbar and shop filters automatically. Note:
the homepage's category tiles (`components/CategoryGrid.js`) have a fixed
image per category slug — if you add a brand-new category slug, that one
tile will need an image added in code, but everything else (nav, shop
filtering) works immediately without touching code.



## Step-by-step: from this folder to a live site

### 1. Get the code running locally (optional but recommended)

You'll need [Node.js 18+](https://nodejs.org) installed.

```bash
cd thewalledit
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
cd thewalledit
git init
git add .
git commit -m "Initial The Wall Edit storefront"
```

Then on [github.com](https://github.com):
1. Click **New repository**, name it (e.g. `thewalledit-store`), keep it empty
   (no README/license — you already have files).
2. Copy the commands GitHub shows you under "…or push an existing repository":
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/thewalledit-store.git
   git branch -M main
   git push -u origin main
   ```

### 4. Deploy on Vercel

Vercel is built by the makers of Next.js, so it deploys straight from GitHub
with zero config — no build settings to touch.

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**.
2. Choose **Continue with GitHub**, authorize Vercel, and import the repo
   you just pushed.
3. Leave the Framework Preset, Build Command, and Output Directory as the
   defaults Vercel auto-detects.
4. Before deploying, expand **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` — you won't know your final URL yet; add it after
     step 5 below and redeploy once (see step 6)
   (same values as your `.env.local`)
5. Click **Deploy**. You'll land on a live URL like
   `the-wall-edit.vercel.app` within a minute or two.
6. Go to **Project → Settings → Environment Variables**, set
   `NEXT_PUBLIC_SITE_URL` to your actual URL from step 5, then go to
   **Deployments → (latest) → ⋯ → Redeploy** so the site picks up the
   correct value. This is what makes your sitemap, canonical links, and
   social share previews point to the right place.
7. Optional, once you buy a custom domain (Namecheap, GoDaddy, or PKNIC for
   a `.pk` domain): **Project → Settings → Domains → Add**, then add the
   DNS records Vercel shows you at your registrar. Afterwards, update
   `NEXT_PUBLIC_SITE_URL` again to the new domain and redeploy.

### 5. Post-launch checklist

- Replace placeholder product photos in `lib/products.js` with your own shoots.
- Update the WhatsApp number in `components/Footer.js` and
  `components/WhatsAppFloatingButton.js` (currently a placeholder).
- Tune `SHIPPING_FLAT_RATE` and `FREE_SHIPPING_THRESHOLD` in
  `lib/cart-context.js` to match your real courier costs.
- Consider adding a payment gateway (JazzCash/Easypaisa/Stripe) — right now
  checkout supports Cash on Delivery and records "card" orders for manual
  follow-up; wiring live card payments is a separate integration.
- Add Google Analytics / Meta Pixel in `app/layout.js` once you're running ads.

### 5b. Custom domain, SEO, and structured data (this update)

This update added a full technical/SEO pass. Here's what you need to do to
finish switching it on:

**1. Set your real site URL.** Once you have a domain (custom or just your
`.vercel.app` one), set it in Vercel's environment variables:
```
NEXT_PUBLIC_SITE_URL=https://the-wall-edit.vercel.app
```
(or `https://your-custom-domain.com` once you buy one). This single value
drives your canonical URLs, `sitemap.xml`, and Open Graph tags — if it's
wrong, those will all point to the wrong place. If you buy a custom domain
later (see step 7 in the Vercel section above for how to connect it),
update this env var and redeploy.

**2. Verify the new SEO files after deploying:**
- `yourdomain.com/sitemap.xml` — should list every page and product
- `yourdomain.com/robots.txt` — should reference the sitemap
- `yourdomain.com/llms.txt` — plain-language site summary for AI crawlers
- Favicon should show your real logo mark in the browser tab (not a generic
  Next.js/React icon) — do a hard refresh (Ctrl/Cmd+Shift+R) since favicons
  are aggressively cached by browsers

**3. LocalBusiness structured data is off by default, on purpose.** I didn't
invent a fake street address or phone number for you — Google penalizes
fake local business data, and it would be misleading either way. If you
have a real registered address, add these Vercel env vars and it'll start
publishing automatically:
```
NEXT_PUBLIC_BUSINESS_PHONE=+92...
NEXT_PUBLIC_BUSINESS_STREET=...
NEXT_PUBLIC_BUSINESS_CITY=...
NEXT_PUBLIC_BUSINESS_REGION=...
NEXT_PUBLIC_BUSINESS_POSTAL_CODE=...
NEXT_PUBLIC_FACEBOOK_URL=...
NEXT_PUBLIC_INSTAGRAM_URL=...
```
If you don't have a physical storefront (most home-based Pakistani online
stores don't), it's fine to leave these blank — the site still gets
Organization + WebSite + Product + Breadcrumb structured data either way,
which covers the SEO value that actually applies to an online-only store.

**4. Favicon & logo:** The favicon (`app/favicon.ico`, `app/icon.png`,
`app/apple-icon.png`) uses your real designed logo — the frame-and-hand
mark, composited onto a cream rounded-square background for guaranteed
contrast in browser tabs. Note that at true favicon size (16–32px) the
fine detail (the ornate carved frame, the hand) gets a little soft — the
logo has more intricate linework than a favicon really wants. It's still
clearly legible as "something elegant," and it's a big step up from a
generic icon, but if you ever want a simplified ultra-small-size version,
that's a quick follow-up. The full logo (with the "FINE ART FRAMING &
CURATION" tagline) is used in the Navbar (icon + wordmark) and Footer
(icon + wordmark + tagline) — see `public/brand/` for the source images.

**5. Test for console errors before you rely on this being error-free.** I
did a thorough static code review (checked image domains are whitelisted,
all `key` props present, Suspense boundaries around `useSearchParams`, no
hydration-sensitive code, etc.) but I don't have a way to actually run
`npm run build` or open a real browser console in this environment — I
can't truthfully claim to have tested it live. Please run:
```bash
npm install
npm run build
npm run start
```
locally, open the browser console on a few pages (home, shop, a product
page, checkout), and send me anything that shows up — I'll fix it
immediately.

**6. What "reduce huge JavaScript" actually means here:** I disabled
production source maps, enabled `optimizePackageImports` for the two
biggest dependencies (lucide-react, framer-motion), and deferred the cart
drawer and quick-view modal so their code only loads when opened rather
than on every page load. I did not rewrite this as a lighter framework —
Next.js + Tailwind + Framer Motion is a reasonable, normal stack for a
storefront like this, and further shrinking it (e.g. dropping Framer
Motion entirely) would mean losing the animations you asked for. If bundle
size becomes a real problem once you have analytics, `next build` prints a
per-route JS size table you can share with me to target further.

### 6. About the new policy pages and Contact form

- The Privacy, Shipping, Return & Exchange, and Cancellation policy pages
  are written to match this project's actual behavior (e.g. the Rs. 250
  flat shipping / free-above-Rs. 6,000 logic from `lib/cart-context.js`).
  **I'm not a lawyer and this isn't legal advice** — treat these as a strong
  starting draft, and have them reviewed by a lawyer before you scale up,
  especially around Pakistani consumer protection and data-handling rules
  (PECA 2016) if you start collecting more customer data.
- Update the placeholder WhatsApp number (`components/Footer.js` and
  `app/contact/page.js`) and email (`hello@thewalledit.pk`) to your real ones.
- The Contact Us form saves messages into a new `contact_messages` table in
  Supabase. **If you already ran the original `schema.sql`**, run
  `supabase/migration-contact-messages.sql` once in the SQL Editor to add
  just this table — no need to re-run the whole schema. New setups get it
  automatically from `schema.sql`.
- To read messages: Supabase → Table Editor → `contact_messages`.

### 7. About product galleries and feature lists

- Products now support multiple photos and a bullet list of frame features,
  shown on the individual product page. In Supabase, these live in two new
  `products` columns: `images` (array of photo URLs — add more via Storage
  the same way you add the main `image`) and `features` (array of short
  bullet strings, e.g. `Sturdy wood backing`, `Ready to hang`). Both are
  optional — leave them empty and the site falls back to just the single
  `image` and a sensible default feature list.
- **If you already ran `schema.sql` before this update**, run
  `supabase/migration-product-gallery.sql` once in the SQL Editor to add
  these two columns. New setups get them automatically from `schema.sql`.
- Update `components/WhatsAppFloatingButton.js` and the trust badges in
  `components/TrustBadges.js` with your real WhatsApp number and any
  policies you want to highlight.

---

## Project structure

```
app/
  layout.js          — fonts, cart provider, nav/footer shell, site-wide metadata + structured data
  page.js             — homepage (hero, bestsellers, categories, bundles, reviews)
  shop/page.js         — metadata wrapper → components/ShopPageClient.js (catalog + search + filters)
  checkout/layout.js    — metadata for the (client-component) checkout page, noindex
  checkout/page.js     — checkout form → Supabase orders table
  checkout/success/    — order confirmation, noindex
  product/[slug]/      — product page (gallery, purchase, accordion, Product schema) + 404
  about/page.js         — About Us
  contact/page.js       — Contact Us + form → Supabase contact_messages table
  privacy-policy/, shipping-policy/, return-exchange-policy/,
  cancellation-policy/  — legal/info pages, each with breadcrumbs + unique metadata
  not-found.js          — site-wide custom 404
  sitemap.js            — dynamic sitemap.xml (all pages + live products)
  robots.js             — robots.txt, points to sitemap
  opengraph-image.js    — dynamically generated default share image
  icon.png, apple-icon.png, favicon.ico — favicon (real logo, cream-chip background)
  globals.css         — design tokens + liquid glass utilities
components/
  SiteStructuredData.js — Organization + WebSite (+ LocalBusiness if configured) JSON-LD
  Breadcrumbs.js        — visual breadcrumbs + BreadcrumbList JSON-LD
  ShopPageClient.js     — client-side shop logic (category filter + search), used by shop/page.js
  Navbar, Hero, ProductCard, QuickView, CartDrawer, ProductGallery,
  TrustBadges, ProductAccordion, WhatsAppFloatingButton, etc.
lib/
  site-config.js        — SITE_URL and optional business info, from env vars
  products.js          — fallback catalog data (used only before Supabase has rows)
  catalog.js            — fetches products/categories/bundles from Supabase, falls back to products.js
  cart-context.js       — cart state, shipping calculation, localStorage
  supabaseClient.js     — Supabase browser client
public/llms.txt          — plain-language site summary for AI crawlers
public/brand/            — real logo source images (icon, used in Navbar/Footer/OG image)
supabase/schema.sql     — full DB schema + RLS policies
```
