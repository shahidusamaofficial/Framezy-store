import InfoPage from "@/components/InfoPage";

export const metadata = {
  title: "Return & Exchange Policy",
  description:
    "What qualifies for a return or exchange on The Wall Edit wall frames, what doesn't, and how to request one.",
  alternates: { canonical: "/return-exchange-policy" },
};

export default function ReturnExchangePolicyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Return & Exchange Policy"
      updated="September 2026"
      breadcrumbItems={[
        { name: "Home", href: "/" },
        { name: "Return & Exchange Policy" },
      ]}
    >
      <p>
        We want you to love your frame. Because these are printed and framed
        items, our policy balances protecting you against genuine defects
        with the fact that these are made-to-order products.
      </p>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">Eligible for return or exchange</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>The item arrived damaged, cracked, or with a manufacturing defect</li>
          <li>You received the wrong product or size than what you ordered</li>
          <li>The print quality is visibly faulty (e.g. misprint, colour defect)</li>
        </ul>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">Not eligible for return or exchange</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Change of mind after the order has been dispatched</li>
          <li>Custom/personalized frames (e.g. Nikkah frames with your names and date) once production has started, unless the item is defective</li>
          <li>Minor variations in colour due to screen display differences between devices</li>
          <li>Damage caused after delivery (e.g. improper handling, hanging, or cleaning)</li>
        </ul>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">How to request a return or exchange</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Contact us within 48 hours of delivery via WhatsApp or the Contact Us page.</li>
          <li>Share your order number, a description of the issue, and clear photos or a short video (an unboxing video helps us resolve damage claims faster).</li>
          <li>We'll review and confirm whether it qualifies, usually within 1–2 working days.</li>
          <li>If approved, we'll arrange a pickup or ask you to ship the item back, and send a replacement or process your refund.</li>
        </ol>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">Condition for returned items</h2>
        <p>Items must be unused, in their original packaging, and in the same condition you received them, unless the return is due to a defect on our part.</p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">Refunds</h2>
        <p>
          Approved refunds are issued to your original payment method (bank
          transfer details you provide, for COD orders) within 5–7 working
          days of us receiving the returned item, where applicable.
        </p>
      </div>
    </InfoPage>
  );
}
