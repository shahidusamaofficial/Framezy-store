import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Framezy about an order, a custom frame, or a general question — WhatsApp, email, or send us a message directly.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact Us" }]} />
      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">We'd love to hear from you</p>
      <h1 className="font-display text-4xl text-cream md:text-5xl">Contact Us</h1>
      <p className="mt-4 max-w-xl text-cream/60">
        Questions about an order, a custom frame, or just want to say hi —
        send us a message and we'll get back to you as soon as we can.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <div className="glass flex items-start gap-3 rounded-2xl p-4">
            <MessageCircle size={18} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="text-sm font-medium text-cream">WhatsApp</p>
              <a
                href="https://api.whatsapp.com/send?phone=920000000000"
                className="text-sm text-cream/60 hover:text-gold"
              >
                +92 000 0000000
              </a>
              <p className="mt-0.5 text-xs text-cream/40">Fastest way to reach us</p>
            </div>
          </div>

          <div className="glass flex items-start gap-3 rounded-2xl p-4">
            <Mail size={18} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="text-sm font-medium text-cream">Email</p>
              <a href="mailto:hello@framezy.pk" className="text-sm text-cream/60 hover:text-gold">
                hello@framezy.pk
              </a>
            </div>
          </div>

          <div className="glass flex items-start gap-3 rounded-2xl p-4">
            <Clock size={18} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="text-sm font-medium text-cream">Response time</p>
              <p className="text-sm text-cream/60">Mon–Sat, 10am–7pm PKT — usually within a few hours</p>
            </div>
          </div>

          <div className="glass flex items-start gap-3 rounded-2xl p-4">
            <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="text-sm font-medium text-cream">Based in</p>
              <p className="text-sm text-cream/60">Pakistan — shipping nationwide</p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}
