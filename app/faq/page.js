import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about The Wall Edit — sizing, custom frames, shipping, payment, and returns.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    q: "What sizes do your frames come in?",
    a: "Most single-panel pieces are available in 16x20in, 20x28in, 24x36in, or 30x40in, and some in 36x48in. Multi-panel sets (2 to 10 panels) come as a fixed layout — check each product page for its exact size options.",
  },
  {
    q: "Do bigger sizes cost more?",
    a: "Yes, where a product offers multiple sizes, larger sizes are priced higher to reflect the extra material and printing cost. You'll always see the exact price for your chosen size before adding to cart.",
  },
  {
    q: "Can I get a custom frame made?",
    a: "Yes — browse our Custom Frames category for personalized options like Nikkah frames with your names and date. After checkout, send your details over WhatsApp and we'll confirm the layout before printing.",
  },
  {
    q: "What are your frames made of?",
    a: "A fade-resistant luster print on a durable border, backed with sturdy wood for support — built to hold up in everyday humidity and heat.",
  },
  {
    q: "Do you deliver across all of Pakistan?",
    a: "Yes, we ship nationwide via courier partners. Delivery is typically 3–5 working days in major cities and 5–7 working days for more remote areas.",
  },
  {
    q: "What does shipping cost?",
    a: "A flat Rs. 250 per order, free on orders of Rs. 6,000 or more. The exact amount is always shown in your cart before checkout.",
  },
  {
    q: "Can I pay Cash on Delivery?",
    a: "Yes, COD is available on every order, alongside bank transfer.",
  },
  {
    q: "What if my order arrives damaged?",
    a: "Contact us within 48 hours of delivery with photos or a short video and we'll arrange a free replacement or exchange. See our Return & Exchange Policy for full details.",
  },
  {
    q: "Can I cancel or change my order after placing it?",
    a: "Yes, as long as it hasn't shipped yet — message us on WhatsApp with your order number as soon as possible. Once dispatched, orders can't be cancelled. Custom orders can't be changed once we've confirmed the layout and started production.",
  },
  {
    q: "Do you offer bulk or wholesale pricing?",
    a: "For larger orders (e.g. for an office, restaurant, or gifting multiple people), reach out via our Contact Us page with details of what you need and we'll get back to you with options.",
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "FAQ" }]} />

      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">Need to know</p>
      <h1 className="font-display text-4xl text-cream md:text-5xl">Frequently Asked Questions</h1>

      <div className="glass mt-10 divide-y divide-white/10 rounded-[1.75rem] p-6 md:p-10">
        {faqs.map((f) => (
          <div key={f.q} className="py-5 first:pt-0 last:pb-0">
            <h2 className="font-display text-lg text-cream">{f.q}</h2>
            <p className="mt-2 text-sm leading-relaxed text-cream/70">{f.a}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-cream/50">
        Still have a question?{" "}
        <a href="/contact" className="text-gold underline underline-offset-2">Contact us</a> and we'll help directly.
      </p>
    </main>
  );
}
