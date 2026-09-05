import InfoPage from "@/components/InfoPage";

export const metadata = {
  title: "Shipping Policy",
  description:
    "Delivery coverage, timelines, and shipping charges for The Wall Edit orders across Pakistan — flat Rs. 250 shipping, free above Rs. 6,000.",
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Shipping Policy"
      updated="September 2026"
      breadcrumbItems={[
        { name: "Home", href: "/" },
        { name: "Shipping Policy" },
      ]}
    >
      <div>
        <h2 className="mb-2 font-display text-lg text-cream">Delivery coverage</h2>
        <p>We deliver across Pakistan via trusted courier partners, including major cities and most remote areas.</p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">Shipping charges</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>A flat shipping charge of Rs. 250 applies per order.</li>
          <li>Orders with a subtotal of Rs. 6,000 or more ship free.</li>
          <li>The exact shipping charge (or "Free") is always shown in your cart before checkout — there are no hidden fees added later.</li>
        </ul>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">Processing & delivery time</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Orders are packed and handed to our courier within 1–2 working days of confirmation.</li>
          <li>Standard delivery takes 3–5 working days within major cities, and 5–7 working days for remote areas.</li>
          <li>Custom frames (e.g. Nikkah frames) may take slightly longer, as we confirm your layout with you before printing.</li>
        </ul>
        <p className="mt-2">
          These are estimates, not guarantees — weather, courier delays, or
          public holidays can occasionally push delivery back a few days.
        </p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">Order tracking</h2>
        <p>Once your order is dispatched, we'll share your tracking details via call, SMS, or WhatsApp using the phone number you provided at checkout.</p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">Packaging</h2>
        <p>Every frame is wrapped and boxed with protective padding to survive transit. If a package arrives visibly damaged, please film yourself opening it and contact us within 48 hours — see our Return & Exchange Policy.</p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">Failed or refused delivery</h2>
        <p>
          For Cash on Delivery orders, if you're unavailable, the courier
          will typically attempt delivery again or hold the parcel briefly
          at a local office before returning it to us. Repeated refused COD
          deliveries may affect your ability to place COD orders with us in
          future.
        </p>
      </div>
    </InfoPage>
  );
}
