import ProductView from "@/components/ProductView";
import Link from "next/link";

async function getProduct(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;
  const data = await getProduct(id);
  const product = data.data ?? data;

  return (
    <div className="min-h-screen bg-[var(--surface-alt)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 lg:pb-10">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
        >
          ← Back to products
        </Link>

        <ProductView product={product} />
      </div>
    </div>
  );
}