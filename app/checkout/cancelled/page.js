import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = {
  title: "Payment Cancelled",
  robots: { index: false, follow: false },
};

export default function CheckoutCancelledPage() {
  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-5 py-28 text-center">
      <XCircle size={52} className="text-clay" />
      <h1 className="mt-6 font-display text-3xl text-cream">Payment cancelled</h1>
      <p className="mt-3 text-cream/60">
        No charge was made. Your cart is still saved if you'd like to try again,
        or choose Cash on Delivery instead.
      </p>
      <Link href="/checkout" className="mt-8 rounded-full bg-clay px-6 py-3 text-sm font-semibold text-cream">
        Back to Checkout
      </Link>
    </main>
  );
}
