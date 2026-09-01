import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  const firstVariant = product.variants?.[0];
  const image = firstVariant?.image_url;

  return (
    <Link
      href={`/products/${product.id}`}
      className="rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all block"
    >
      <div className="aspect-square relative">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs uppercase tracking-wide">
          {product.category?.name}
        </span>
        <h3 className="text-lg font-semibold mt-1">
          {product.name}
        </h3>
        <p className="text-sm mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold">
            {firstVariant ? `$${firstVariant.price}` : "N/A"}
          </span>
          <span className="text-sm">
            {firstVariant?.stock > 0
              ? `${firstVariant.stock} in stock`
              : "Out of stock"}
          </span>
        </div>
        {product.variants?.length > 0 && (
          <p className="text-xs mt-2">
            {product.variants.length} variant(s) available
          </p>
        )}
      </div>
    </Link>
  );
}