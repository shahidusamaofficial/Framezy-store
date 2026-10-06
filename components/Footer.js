import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, MessageCircle, ArrowUp } from "lucide-react";

/**
 * Footer — bold editorial closing. Massive wordmark, gold rule,
 * asymmetric link columns, back-to-top.
 */
export default function Footer() {
  return (
    <footer className="footer-photo-scope relative overflow-hidden border-t border-cream/10 bg-ink">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/brand/footer-pattern.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom opacity-25"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/90 to-ink" />
      </div>

      <div className="border-b border-cream/10 px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
            Fine Art Framing &amp; Curation
          </p>
          <h2 className="font-display text-[clamp(3rem,9vw,7rem)] font-medium leading-[0.9] text-cream">
            THE WALL
            <br />
            <span className="italic font-light text-cream/70">EDIT.</span>
          </h2>
          <div className="mt-6 h-px w-24 bg-gold" />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3">
            <Image src="/brand/icon@2x.png" alt="The Wall Edit" width={44} height={48} className="h-10 w-auto" />
            <span className="font-display text-sm tracking-[0.1em] text-cream">EST. 2026</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/50">
            Premium wall frames and canvas art, designed and shipped from
            Pakistan. Amazing quality, honest prices.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition hover:border-gold hover:text-gold"
            >
              <Instagram size={15} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition hover:border-gold hover:text-gold"
            >
              <Facebook size={15} />
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=923016337624"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition hover:border-gold hover:text-gold"
            >
              <MessageCircle size={15} />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-gold">Shop</p>
          <ul className="space-y-2.5 text-sm text-cream/60">
            <li><Link href="/shop" className="transition hover:text-cream">Shop All</Link></li>
            <li><Link href="/shop?bundles=1" className="transition hover:text-cream">Bundles</Link></li>
            <li><Link href="/shop?category=custom" className="transition hover:text-cream">Custom Frames</Link></li>
            <li><Link href="/about" className="transition hover:text-cream">About Us</Link></li>
            <li><Link href="/blog" className="transition hover:text-cream">Blog</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-gold">Support</p>
          <ul className="space-y-2.5 text-sm text-cream/60">
            <li><Link href="/faq" className="transition hover:text-cream">FAQ</Link></li>
            <li><Link href="/shipping-policy" className="transition hover:text-cream">Shipping</Link></li>
            <li><Link href="/return-exchange-policy" className="transition hover:text-cream">Returns</Link></li>
            <li><Link href="/cancellation-policy" className="transition hover:text-cream">Cancellations</Link></li>
            <li><Link href="/contact" className="transition hover:text-cream">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-gold">Legal</p>
          <ul className="space-y-2.5 text-sm text-cream/60">
            <li><Link href="/privacy-policy" className="transition hover:text-cream">Privacy</Link></li>
            <li><Link href="/terms-and-conditions" className="transition hover:text-cream">Terms</Link></li>
            <li><Link href="/ownership-statement" className="transition hover:text-cream">Ownership</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 md:flex-row md:px-8">
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} The Wall Edit. Built with care in Pakistan.
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/60 transition hover:text-gold"
          >
            Back to top
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-cream/20 transition group-hover:border-gold">
              <ArrowUp size={12} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}