"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

function AccordionItem({ title, children, isOpen, onToggle }) {
  return (
    <div className="border-b border-white/10 last:border-none">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-display text-base text-cream md:text-lg">{title}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gold transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ${
          isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 text-sm leading-relaxed text-cream/70">{children}</div>
      </div>
    </div>
  );
}

const faqs = [
  {
    q: "Do you offer custom frame designs?",
    a: "Yes — check our Custom Frames category for personalized names, dates, and layouts (like Nikkah frames). Send us your details over WhatsApp after ordering and we'll confirm the layout before printing.",
  },
  {
    q: "What are your frames made of?",
    a: "A fade-resistant luster print on a durable border, backed with sturdy wood for support — built to handle everyday humidity and heat, not just look good in a photo.",
  },
  {
    q: "How long does delivery take?",
    a: "Usually 3–5 working days in major cities, 5–7 for remote areas. See our Shipping Policy for full details.",
  },
  {
    q: "Can I pay Cash on Delivery?",
    a: "Yes, COD is available on every order across Pakistan, alongside bank transfer.",
  },
];

export default function ProductAccordion({ product }) {
  const [open, setOpen] = useState("description");

  function toggle(key) {
    setOpen((cur) => (cur === key ? null : key));
  }

  return (
    <div className="glass mt-14 rounded-[1.75rem] p-6 md:p-8">
      <AccordionItem title="Description" isOpen={open === "description"} onToggle={() => toggle("description")}>
        <p>{product.description}</p>
      </AccordionItem>

      <AccordionItem title="Frame Features" isOpen={open === "features"} onToggle={() => toggle("features")}>
        <ul className="space-y-2">
          {product.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" /> {f}
            </li>
          ))}
        </ul>
      </AccordionItem>

      <AccordionItem
        title="Shipping & Returns"
        isOpen={open === "shipping"}
        onToggle={() => toggle("shipping")}
      >
        <p>
          Flat Rs. 250 shipping, free above Rs. 6,000. Delivered in 3–5
          working days across most of Pakistan. Report any damage within 48
          hours for a free replacement or exchange.
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs">
          <Link href="/shipping-policy" className="text-gold underline underline-offset-2">
            Full Shipping Policy
          </Link>
          <Link href="/return-exchange-policy" className="text-gold underline underline-offset-2">
            Full Return & Exchange Policy
          </Link>
        </div>
      </AccordionItem>

      <AccordionItem title="FAQ" isOpen={open === "faq"} onToggle={() => toggle("faq")}>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q}>
              <p className="font-medium text-cream/90">{f.q}</p>
              <p className="mt-1 text-cream/60">{f.a}</p>
            </div>
          ))}
        </div>
      </AccordionItem>
    </div>
  );
}
