import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Order Confirmed",
  description: "Your Framezy order has been placed successfully.",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-5 py-28 text-center">
      <CheckCircle2 size={52} className="text-gold" />
      <h1 className="mt-6 font-display text-3xl text-cream">Order placed!</h1>
      <p className="mt-3 text-cream/60">
        Thanks for shopping with Framezy. We'll confirm your order over WhatsApp/call
        shortly and get it packed for delivery.
      </p>
      <Link href="/shop" className="mt-8 rounded-full bg-clay px-6 py-3 text-sm font-semibold text-cream">
        Continue Shopping
      </Link>
    </main>
  );
}
