import HeroSlider from "./HeroSlider";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck } from "lucide-react";

async function getFeaturedProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?page=1`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  const products = data.data?.data ?? data.data ?? [];
  return products.slice(0, 6);
}

export default async function HeroBanner() {
  const products = await getFeaturedProducts();

  const slides = products
    .filter((p) => p.variants?.[0]?.image_url)
    .map((p) => ({
      id: p.id,
      name: p.name,
      image: p.variants[0].image_url,
      price: Math.min(...p.variants.map((v) => Number(v.price))),
    }));

  return (
    <section className="relative overflow-hidden bg-[var(--surface-alt)]">
      {/* Decorative background shapes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--accent)]/5 rounded-full blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--ink) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--border-color)] rounded-full pl-1.5 pr-4 py-1.5 mb-6">
              <span className="bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                New
              </span>
              <span className="text-xs font-medium text-[var(--ink-soft)]">
                Fall/Winter 2026 Collection
              </span>
            </span>

            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold text-[var(--ink)] leading-[1.08] tracking-tight">
              Walk Into Every
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">Dream</span>
                <span className="absolute left-0 bottom-1 sm:bottom-2 w-full h-3 sm:h-4 bg-[var(--accent)]/25 -z-0 rounded-sm" />
              </span>{" "}
              With Confidence
            </h1>

            <p className="text-[var(--ink-soft)] text-base sm:text-lg mt-6 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Premium footwear crafted from the finest materials — where
              timeless design meets everyday comfort.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-9 justify-center lg:justify-start">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 bg-[var(--ink)] text-[var(--surface-alt)] px-8 py-4 rounded-full font-semibold hover:opacity-85 active:scale-[0.98] transition-all"
              >
                Shop Collection
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 border border-[var(--border-color)] text-[var(--ink)] px-8 py-4 rounded-full font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                View Lookbook
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-10">
              <div className="flex -space-x-3">
                {["A", "R", "M", "S"].map((letter, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-[var(--surface-alt)] bg-[var(--accent)] text-white text-xs font-semibold flex items-center justify-center"
                    style={{ opacity: 1 - i * 0.12 }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)]"
                    />
                  ))}
                </div>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Loved by 10,000+ walkers
                </p>
              </div>
            </div>
          </div>

          {/* Sliding product images */}
          <HeroSlider slides={slides} />
        </div>

        {/* Trust strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 lg:mt-20 pt-8 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-soft)] flex items-center justify-center shrink-0">
              <Truck className="w-4.5 h-4.5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--ink)]">
                Fast Delivery
              </p>
              <p className="text-xs text-[var(--muted)]">
                2–4 business days
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-soft)] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4.5 h-4.5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--ink)]">
                Quality Guarantee
              </p>
              <p className="text-xs text-[var(--muted)]">
                Premium materials only
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-soft)] flex items-center justify-center shrink-0">
              <Star className="w-4.5 h-4.5 fill-[var(--accent)] text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--ink)]">
                4.9 out of 5
              </p>
              <p className="text-xs text-[var(--muted)]">
                From 2,300+ reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}