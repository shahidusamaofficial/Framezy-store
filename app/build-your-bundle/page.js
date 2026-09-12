import { getProducts } from "@/lib/catalog";
import BuildYourBundle from "@/components/BuildYourBundle";
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 60;

export const metadata = {
  title: "Build Your Own Bundle",
  description: "Pick any 3 single-panel prints and get 40% off, on us.",
  alternates: { canonical: "/build-your-bundle" },
};

export default async function BuildYourBundlePage() {
  const allProducts = await getProducts();
  const eligibleProducts = allProducts.filter((p) => p.panels === 1 && !p.isCustom);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Build Your Own Bundle" },
        ]}
      />

      <div className="mt-4 max-w-2xl">
        <h1 className="font-display text-4xl text-cream md:text-5xl">Build Your Own Bundle</h1>
        <p className="mt-3 text-cream/70">
          Pick any 3 single-panel prints below and get <span className="text-gold">40% off</span> the
          combined price — no fixed sets, just what you actually want on your wall.
        </p>
      </div>

      <BuildYourBundle products={eligibleProducts} />
    </main>
  );
}
