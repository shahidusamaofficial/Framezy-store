import { getProducts } from "@/lib/catalog";
import FindYourStyleQuiz from "@/components/FindYourStyleQuiz";

export const revalidate = 60;

export const metadata = {
  title: "Find Your Wall Art Style",
  description: "Answer a few quick questions and we'll match you with the wall art style that actually fits your space and taste.",
  alternates: { canonical: "/find-your-style" },
};

export default async function FindYourStylePage() {
  const products = await getProducts();

  return <FindYourStyleQuiz allProducts={products} />;
}
