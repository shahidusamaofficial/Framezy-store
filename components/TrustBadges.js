import { ShieldCheck, PackageCheck, PackageOpen, RefreshCw } from "lucide-react";
import Link from "next/link";

const badges = [
  {
    icon: ShieldCheck,
    title: "Fade-Resistant",
    desc: "Gallery-grade print built to last",
  },
  {
    icon: PackageOpen,
    title: "Inspect Before Paying",
    desc: "Check visible damage before COD payment",
  },
  {
    icon: PackageCheck,
    title: "Secure Packaging",
    desc: "Padded and boxed for safe transit",
  },
  {
    icon: RefreshCw,
    title: "Easy Exchange",
    desc: "Hassle-free on genuine issues",
    href: "/return-exchange-policy",
  },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {badges.map((b) => {
        const Icon = b.icon;
        const content = (
          <div className="glass flex h-full flex-col items-start gap-2 rounded-xl p-3.5">
            <Icon size={18} className="text-gold" />
            <div>
              <p className="text-xs font-semibold text-cream">{b.title}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-cream/50">{b.desc}</p>
            </div>
          </div>
        );
        return b.href ? (
          <Link key={b.title} href={b.href} className="transition hover:-translate-y-0.5">
            {content}
          </Link>
        ) : (
          <div key={b.title}>{content}</div>
        );
      })}
    </div>
  );
}
