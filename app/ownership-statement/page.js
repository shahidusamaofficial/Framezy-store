export const metadata = {
  title: "Ownership Statement",
  description: "Ownership and operator details for The Wall Edit (thewalledit.pk).",
  alternates: { canonical: "/ownership-statement" },
  robots: { index: true, follow: true },
};

export default function OwnershipStatementPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <h1 className="font-display text-4xl text-cream">Ownership Statement</h1>
      <p className="mt-2 text-sm text-cream/50">Last updated: September 2026</p>

      <div className="mt-8 space-y-6 text-cream/70">
        <p>
          This page confirms the ownership and operation details of the website thewalledit.pk ("The Wall
          Edit"), provided for verification and transparency purposes.
        </p>

        <div className="glass space-y-4 rounded-2xl p-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-cream/50">Business Name</p>
            <p className="mt-1 text-cream">The Wall Edit</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-cream/50">Legal Owner</p>
            <p className="mt-1 text-cream">Usama Shahid</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-cream/50">Business Structure</p>
            <p className="mt-1 text-cream">Sole Proprietorship</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-cream/50">Business Location</p>
            <p className="mt-1 text-cream">Burewala, Punjab, Pakistan</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-cream/50">Website</p>
            <p className="mt-1 text-cream">https://www.thewalledit.pk</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-cream/50">Contact Email</p>
            <p className="mt-1 text-cream">hello@thewalledit.pk</p>
          </div>
        </div>

        <p>
          I, Usama Shahid, declare that I am the sole owner and operator of the business trading as "The Wall
          Edit" and the website thewalledit.pk. I am solely responsible for all content, products, and
          transactions conducted through this website.
        </p>
      </div>
    </main>
  );
}
