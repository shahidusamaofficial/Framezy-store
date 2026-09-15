import { SITE_URL } from "@/lib/site-config";

export const metadata = {
  title: "Terms and Conditions",
  description: "The terms and conditions governing use of The Wall Edit website and purchases made through it.",
  alternates: { canonical: "/terms-and-conditions" },
  robots: { index: true, follow: true },
};

export default function TermsAndConditionsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <h1 className="font-display text-4xl text-cream">Terms and Conditions</h1>
      <p className="mt-2 text-sm text-cream/50">Last updated: September 2026</p>

      <div className="mt-8 space-y-8 text-cream/70">
        <section>
          <h2 className="font-display text-xl text-cream">1. Introduction</h2>
          <p className="mt-2">
            These Terms and Conditions govern your use of {SITE_URL} ("the Website") and any purchase made
            through it. By accessing the Website or placing an order, you agree to be bound by these terms.
            If you do not agree with any part of these terms, please do not use the Website.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">2. Use of the Website</h2>
          <p className="mt-2">
            You agree to use this Website only for lawful purposes and in a way that does not infringe the
            rights of, or restrict, or inhibit anyone else's use of the Website. You must not attempt to gain
            unauthorized access to any part of the Website, its servers, or any systems connected to it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">3. Products and Pricing</h2>
          <p className="mt-2">
            We make every effort to display our products and their prices accurately. However, colors, sizes,
            and finishes may vary slightly from what is shown on screen due to display settings and
            photography conditions. Prices are listed in Pakistani Rupees (PKR) and are subject to change
            without prior notice. We reserve the right to correct any pricing errors, even after an order has
            been placed.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">4. Orders and Payment</h2>
          <p className="mt-2">
            When you place an order, you are making an offer to purchase the item(s) in your cart. We reserve
            the right to accept or decline any order for any reason, including but not limited to product
            availability, errors in pricing or product information, or suspected fraudulent activity.
          </p>
          <p className="mt-2">
            We accept Cash on Delivery, Bank Transfer, and card/wallet payments (via Safepay, covering Card,
            JazzCash, and Easypaisa). For advance payment methods, your order is confirmed once payment is
            successfully processed.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">5. Delivery</h2>
          <p className="mt-2">
            We aim to deliver orders within 5–7 working days across Pakistan. Delivery timeframes are
            estimates and may vary due to courier delays, weather, or circumstances beyond our control. Risk
            of loss and title for items purchased pass to you upon delivery to the courier.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">6. Returns, Exchanges, and Cancellations</h2>
          <p className="mt-2">
            Our policies on returns, exchanges, and order cancellations are detailed separately — please refer
            to our Return &amp; Exchange Policy and Cancellation Policy pages for full terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">7. Intellectual Property</h2>
          <p className="mt-2">
            All content on this Website — including product designs, images, text, logos, and branding — is
            the property of The Wall Edit or its licensors and is protected by applicable copyright and
            trademark laws. You may not reproduce, distribute, or use this content for commercial purposes
            without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">8. Limitation of Liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, The Wall Edit shall not be liable for any indirect,
            incidental, or consequential damages arising from your use of the Website or purchase of our
            products. Our total liability for any claim shall not exceed the amount paid for the relevant
            order.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">9. Governing Law</h2>
          <p className="mt-2">
            These terms are governed by the laws of the Islamic Republic of Pakistan. Any disputes arising
            from these terms or your use of the Website shall be subject to the exclusive jurisdiction of the
            courts of Pakistan.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">10. Changes to These Terms</h2>
          <p className="mt-2">
            We may update these Terms and Conditions from time to time. Changes will be posted on this page
            with an updated "Last updated" date. Continued use of the Website after changes are posted
            constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">11. Contact Us</h2>
          <p className="mt-2">
            If you have any questions about these Terms and Conditions, please reach out to us via WhatsApp or
            email at hello@thewalledit.pk.
          </p>
        </section>
      </div>
    </main>
  );
}
