import InfoPage from "@/components/InfoPage";
import { SITE_URL } from "@/lib/site-config";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How The Wall Edit collects, uses, and protects your personal information when you shop for wall frames and canvas art online in Pakistan.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  const siteHost = SITE_URL.replace(/^https?:\/\//, "");
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="September 2026"
      breadcrumbItems={[
        { name: "Home", href: "/" },
        { name: "Privacy Policy" },
      ]}
    >
      <p>
        This policy explains what information The Wall Edit ("we", "us") collects
        when you use {siteHost} (the "Site"), how we use it, and the
        choices you have. By placing an order or contacting us, you agree to
        the practices described here.
      </p>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">1. Information we collect</h2>
        <p>When you shop with us or contact us, we may collect:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Your name, phone number, delivery address, and city (at checkout)</li>
          <li>Your email address, if you provide one via the Contact Us form</li>
          <li>Order details — items purchased, sizes, prices, and payment method selected</li>
          <li>Basic technical data such as browser type and general location, collected automatically for security and performance</li>
        </ul>
        <p className="mt-2">
          We do not collect card or bank details directly — if you pay by
          bank transfer, that transaction happens through your own banking
          app, not on this Site.
        </p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">2. How we use your information</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>To process, pack, and deliver your order</li>
          <li>To contact you about your order status, delays, or delivery issues</li>
          <li>To respond to questions submitted via the Contact Us form</li>
          <li>To improve the Site and prevent fraudulent orders</li>
        </ul>
        <p className="mt-2">We do not sell or rent your personal information to third parties.</p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">3. Who we share it with</h2>
        <p>We share the minimum necessary information with:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Our courier partners, to deliver your order (your name, phone, and address)</li>
          <li>Supabase, our database and storage provider, which securely hosts order and message records on our behalf</li>
        </ul>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">4. Cookies and local storage</h2>
        <p>
          Your shopping cart is stored in your browser's local storage so it
          persists if you close the tab. This data stays on your device and
          isn't sent to us until you complete checkout.
        </p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">5. Data retention</h2>
        <p>
          We keep order records for as long as reasonably needed for
          accounting, warranty, and dispute-resolution purposes. You can ask
          us to delete personal information we hold about you, subject to
          any legal obligation we have to keep transaction records.
        </p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">6. Your rights</h2>
        <p>
          You can ask us what information we hold about you, request a
          correction, or request deletion, by reaching out through our{" "}
          <a href="/contact" className="text-gold underline underline-offset-2">Contact Us</a> page.
        </p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">7. Children's privacy</h2>
        <p>This Site is intended for adults placing orders. We do not knowingly collect information from children.</p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">8. Changes to this policy</h2>
        <p>We may update this policy occasionally. The "Last updated" date at the top reflects the most recent version.</p>
      </div>

      <div>
        <h2 className="mb-2 font-display text-lg text-cream">9. Contact us</h2>
        <p>
          Questions about this policy? Reach us via the{" "}
          <a href="/contact" className="text-gold underline underline-offset-2">Contact Us</a> page or WhatsApp.
        </p>
      </div>
    </InfoPage>
  );
}
