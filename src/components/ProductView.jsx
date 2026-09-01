"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function ProductView({ product }) {
  const { addItem } = useCart();

  const variants = product.variants || [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = variants[selectedIndex];
  const inStock = selected?.stock > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-6">
      {/* Left: Gallery */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <div className="relative aspect-square bg-[var(--surface)] rounded-2xl overflow-hidden">
          {selected?.image_url ? (
            <Image
              key={`${selectedIndex}-${selected.image_url}`}
              src={selected.image_url}
              alt={product.name}
              fill
              priority
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-sm">
              No image available
            </div>
          )}

          {!inStock && selected && (
            <span className="absolute top-4 left-4 bg-[var(--ink)] text-[var(--surface-alt)] text-xs font-medium tracking-wide px-3 py-1.5 rounded-full">
              Out of stock
            </span>
          )}
        </div>

        {/* Thumbnail rack */}
        {variants.length > 0 && (
          <div className="flex gap-3 mt-5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {variants.map((variant, index) => {
              const isActive = index === selectedIndex;
              return (
                <button
                  key={variant.id ?? index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className="flex-shrink-0 flex flex-col items-center gap-2 group"
                >
                  <span
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      isActive
                        ? "border-[var(--accent)] shadow-[0_2px_10px_rgba(168,99,46,0.25)]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    {variant.image_url ? (
                      <Image
                        src={variant.image_url}
                        alt={`${variant.size || ""} ${variant.color || ""}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-[10px] text-[var(--muted)] bg-[var(--surface)]">
                        N/A
                      </span>
                    )}
                    {variant.stock === 0 && (
                      <span className="absolute inset-0 bg-[var(--surface-alt)]/70" />
                    )}
                  </span>
                  <span
                    className={`text-[11px] font-medium tracking-wide transition-colors ${
                      isActive
                        ? "text-[var(--ink)]"
                        : "text-transparent group-hover:text-[var(--muted)]"
                    }`}
                  >
                    {variant.color || variant.size || "\u00A0"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Desktop CTA */}
        <div className="hidden lg:block mt-6 border border-[var(--border-color)] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-medium text-[var(--ink)]">
                {[selected?.size && `Size ${selected.size}`, selected?.color]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p
                className={`text-sm mt-1 ${inStock ? "text-[var(--success)]" : "text-red-600 dark:text-red-400"}`}
              >
                {inStock
                  ? `${selected.stock} in stock`
                  : "Currently unavailable"}
              </p>
            </div>
            <span className="text-2xl font-[family-name:var(--font-display)] font-semibold text-[var(--ink)]">
              ${selected?.price}
            </span>
          </div>
          <AddToCartButton 
            inStock={inStock} 
            onClick={() => addItem(product, selected, 1)} 
          />
        </div>

        {/* Mobile sticky bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface-alt)]/95 backdrop-blur border-t border-[var(--border-color)] px-4 py-3 flex items-center gap-4 z-20">
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold leading-none text-[var(--ink)]">
              ${selected?.price}
            </p>
            <p
              className={`text-xs mt-1 ${inStock ? "text-[var(--success)]" : "text-red-600 dark:text-red-400"}`}
            >
              {inStock ? `${selected.stock} in stock` : "Out of stock"}
            </p>
          </div>
          <AddToCartButton 
            inStock={inStock} 
            compact 
            onClick={() => addItem(product, selected, 1)} 
          />
        </div>
      </div>

      {/* Right: Info + variants list */}
      <div>
        <span className="text-xs font-medium tracking-[0.15em] text-[var(--accent)] uppercase">
          {product.category?.name}
        </span>
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-[var(--ink)] mt-2 leading-tight">
          {product.name}
        </h1>
        <p className="text-[var(--ink-soft)] mt-4 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-10">
          <h2 className="text-sm font-semibold tracking-wide text-[var(--ink)] uppercase mb-4">
            All Variants
          </h2>
          <div className="space-y-2.5">
            {variants.map((variant, index) => {
              const isActive = index === selectedIndex;
              return (
                <button
                  key={variant.id ?? index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between border rounded-xl p-4 text-left transition-colors ${
                    isActive
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--border-color)] hover:border-[var(--accent-border-hover)]"
                  }`}
                >
                  <div>
                    <p className="font-medium text-[var(--ink)]">
                      {[variant.size && `Size ${variant.size}`, variant.color]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p
                      className={`text-sm mt-0.5 ${
                        variant.stock > 0
                          ? "text-[var(--success)]"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {variant.stock > 0
                        ? `${variant.stock} in stock`
                        : "Out of stock"}
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-[var(--ink)]">
                    ${variant.price}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddToCartButton({ inStock, compact = false, onClick }) {
  return (
    <button
      disabled={!inStock}
      onClick={onClick}
      className={`${compact ? "px-6 py-3 text-sm" : "w-full py-3.5"} rounded-xl font-semibold tracking-wide transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
        inStock
          ? "bg-[var(--ink)] text-[var(--surface-alt)] hover:opacity-85 active:scale-[0.98]"
          : "bg-[var(--border-color)] text-[var(--muted)] cursor-not-allowed"
      }`}
    >
      {inStock ? "Add to Cart" : "Out of Stock"}
    </button>
  );
}