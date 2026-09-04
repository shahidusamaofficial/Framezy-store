import Link from "next/link";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass-dark mt-10 border-t border-white/10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-14 md:grid-cols-4 md:px-8">
        <div className="col-span-2">
          <p className="font-display text-2xl text-cream">
            Frame<span className="text-gradient italic">zy</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-cream/60">
            Premium wall frames and canvas art, designed and shipped from Pakistan.
            Amazing quality, honest prices.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram" className="glass rounded-full p-2.5 text-cream/80 hover:text-gold">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="Facebook" className="glass rounded-full p-2.5 text-cream/80 hover:text-gold">
              <Facebook size={16} />
            </a>
            <a
              href="https://api.whatsapp.com/send?phone=920000000000"
              aria-label="WhatsApp"
              className="glass rounded-full p-2.5 text-cream/80 hover:text-gold"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-wide text-gold">Shop</p>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><Link href="/shop" className="hover:text-gold">Shop All</Link></li>
            <li><Link href="/shop?bundles=1" className="hover:text-gold">Bundles</Link></li>
            <li><Link href="/shop?category=custom" className="hover:text-gold">Custom Frames</Link></li>
            <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-wide text-gold">Support</p>
          <ul className="space-y-2 text-sm text-cream/60">
            <li><Link href="/shipping-policy" className="hover:text-gold">Shipping Policy</Link></li>
            <li><Link href="/return-exchange-policy" className="hover:text-gold">Return & Exchange</Link></li>
            <li><Link href="/cancellation-policy" className="hover:text-gold">Cancellation Policy</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Framezy. Built with Next.js, Tailwind & Supabase.
      </div>
    </footer>
  );
}
