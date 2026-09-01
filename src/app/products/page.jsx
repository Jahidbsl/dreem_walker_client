import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import Link from "next/link";

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

async function getProducts(searchParams) {
  const search = searchParams?.search || "";
  const categoryId = searchParams?.category_id || "";
  const page = searchParams?.page || "1";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?search=${search}&category_id=${categoryId}&page=${page}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function ProductsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const [productsData, categories] = await Promise.all([
    getProducts(resolvedParams),
    getCategories(),
  ]);

  const products = productsData.data?.data || [];
  const currentPage = productsData.data?.current_page || 1;
  const lastPage = productsData.data?.last_page || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <ProductFilter categories={categories} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-10">
        {currentPage > 1 && (
          <Link
            href={`?page=${currentPage - 1}${resolvedParams?.search ? `&search=${resolvedParams.search}` : ""}${resolvedParams?.category_id ? `&category_id=${resolvedParams.category_id}` : ""}`}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Previous
          </Link>
        )}

        <span className="px-4 py-2 self-center">
          Page {currentPage} of {lastPage}
        </span>

        {currentPage < lastPage && (
          <Link
            href={`?page=${currentPage + 1}${resolvedParams?.search ? `&search=${resolvedParams.search}` : ""}${resolvedParams?.category_id ? `&category_id=${resolvedParams.category_id}` : ""}`}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}