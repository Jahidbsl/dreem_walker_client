"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSlider({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-[var(--surface)] flex items-center justify-center px-4 sm:px-0">
        <p className="text-sm text-[var(--muted)]">No products to show</p>
      </div>
    );
  }

  const active = slides[activeIndex];

  return (
    <div className="relative px-4 sm:px-0">
      <Link
        href={`/products/${active.id}`}
        className="relative block aspect-[4/5] rounded-[2rem] overflow-hidden bg-[var(--surface)] shadow-2xl shadow-black/10 group"
      >
        {slides.map((slide, index) => (
          <Image
            key={slide.id}
            src={slide.image}
            alt={slide.name}
            fill
            priority={index === 0}
            unoptimized
            className={`object-cover transition-opacity duration-700 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Product name + price overlay, appears on the current slide */}
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
          <div>
            <p className="text-white text-sm font-medium drop-shadow-sm line-clamp-1">
              {active.name}
            </p>
            <p className="text-white/80 text-xs mt-0.5">Tap to view details</p>
          </div>
          <span className="bg-white/95 backdrop-blur text-[var(--ink)] text-sm font-bold px-3 py-1.5 rounded-full shrink-0">
            ${active.price}
          </span>
        </div>
      </Link>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${slide.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-6 bg-[var(--accent)]"
                  : "w-1.5 bg-[var(--border-color)] hover:bg-[var(--muted)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}