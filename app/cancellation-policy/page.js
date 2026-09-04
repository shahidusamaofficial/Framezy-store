import InfoPage from "@/components/InfoPage";

export const metadata = {
  title: "Cancellation Policy",
  description:
    "When you can cancel a Framezy order for free, and what happens once an order has shipped or a custom frame is in production.",
  alternates: { canonical: "/cancellation-policy" },
};

export default function CancellationPolicyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Cancellation Policy"
      updated="September 2026"
      breadcrumbItems={[
        { name: "Home", href: "/" },
        { name: "Cancellation Policy" },
      ]}
    >
      <div>
        <h2 className="mb-2 font-display text-lg text-cream">Before dispatch</h2>
        <p>
          You can cancel your order free of charge any time before it has
          been packed and handed to our courier. Message us via WhatsApp or
          the Contact Us page with your order number as soon as possible —
          the earlier you reach out, the more likely we can stop it in time.
        </p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">After dispatch</h2>
        <p>
          Once an order has shipped, it can no longer be cancelled. If you no
          longer want the item, you're welcome to refuse delivery, but note
          that repeated refused Cash on Delivery orders may affect your
          ability to place COD orders with us in future — see our{" "}
          <a href="/shipping-policy" className="text-gold underline underline-offset-2">
            Shipping Policy
          </a>.
        </p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">Custom orders</h2>
        <p>
          Custom frames (e.g. Nikkah frames with your names and date) cannot
          be cancelled once we've confirmed your layout and started
          production, since these are made specifically for you and can't be
          resold.
        </p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">Cancellations initiated by us</h2>
        <p>
          Occasionally we may need to cancel an order — for example, if an
          item is out of stock or we're unable to verify an order. In that
          case, we'll notify you and issue a full refund for any amount
          already paid.
        </p>
      </div>
    </InfoPage>
  );
}
