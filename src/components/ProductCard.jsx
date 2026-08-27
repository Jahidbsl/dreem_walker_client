export default function ProductCard({ product }) {
  const firstVariant = product.variants?.[0];
  const image = firstVariant?.image_url;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {product.category?.name}
        </span>
        <h3 className="text-lg font-semibold mt-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold">
            {firstVariant ? `$${firstVariant.price}` : "N/A"}
          </span>
          <span className="text-sm text-gray-500">
            {firstVariant?.stock > 0
              ? `${firstVariant.stock} in stock`
              : "Out of stock"}
          </span>
        </div>
        {product.variants?.length > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            {product.variants.length} variant(s) available
          </p>
        )}
      </div>
    </div>
  );
}