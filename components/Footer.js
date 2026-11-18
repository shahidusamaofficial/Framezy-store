import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-cream/5 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Wordmark */}
        <div className="mb-12 text-center">
          <p className="text-massive font-bold tracking-tight">The Wall Edit.</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {[
            { href: "/shop", label: "Shop" },
            { href: "/shop?bundles=1", label: "Bundles" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
            { href: "/faq", label: "FAQ" },
            { href: "/shipping-policy", label: "Shipping" },
            { href: "/return-exchange-policy", label: "Returns" },
            { href: "/privacy-policy", label: "Privacy" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs text-cream/50 transition hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-cream/5 pt-8 sm:flex-row">
          <p className="text-xs text-cream/30">
            © {new Date().getFullYear()} The Wall Edit. Built with care in Pakistan.
          </p>
          <div className="flex gap-4">
            <a href="https://wa.me/923016337624" className="text-xs text-cream/40 transition hover:text-cream" target="_blank">WhatsApp</a>
            <a href="#" className="text-xs text-cream/40 transition hover:text-cream">Instagram</a>
            <a href="#" className="text-xs text-cream/40 transition hover:text-cream">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
