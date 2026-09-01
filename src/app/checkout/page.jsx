"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Loader2, MapPin, Phone, User, StickyNote } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, cartTotal, hydrated, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping: {
            name: form.name,
            phone: form.phone,
            address: form.address,
            city: form.city,
            note: form.note,
          },
          payment_method: "cod",
          items: items.map((item) => ({
            variant_id: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
          total: cartTotal,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to place order.");
      }

      clearCart();
      router.push("/orders");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

if (hydrated && items.length === 0) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[var(--ink)] font-medium mb-1">Your cart is empty</p>
        <p className="text-sm text-[var(--muted)] mb-4">
          Add some products before checking out.
        </p>
        <Link
          href="/products"
          className="inline-block bg-[var(--ink)] text-[var(--surface-alt)] px-5 py-2 rounded-md text-sm font-medium hover:opacity-85 transition-opacity"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-[family-name:var(--font-display)] font-semibold text-[var(--ink)] mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Shipping form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6">
            <h2 className="text-sm font-semibold tracking-wide text-[var(--ink)] uppercase mb-5">
              Shipping Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--ink-soft)] mb-1.5">
                  <User className="w-3.5 h-3.5" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-3 py-2.5 border border-[var(--border-color)] bg-[var(--surface-alt)] text-[var(--ink)] rounded-md outline-none transition-colors focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--ink-soft)] mb-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2.5 border border-[var(--border-color)] bg-[var(--surface-alt)] text-[var(--ink)] rounded-md outline-none transition-colors focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--ink-soft)] mb-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Delivery Address
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="House, road, area..."
                  className="w-full px-3 py-2.5 border border-[var(--border-color)] bg-[var(--surface-alt)] text-[var(--ink)] rounded-md outline-none transition-colors focus:border-[var(--accent)] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--ink-soft)] mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Dhaka"
                  className="w-full px-3 py-2.5 border border-[var(--border-color)] bg-[var(--surface-alt)] text-[var(--ink)] rounded-md outline-none transition-colors focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--ink-soft)] mb-1.5">
                  <StickyNote className="w-3.5 h-3.5" />
                  Order Note (optional)
                </label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any delivery instructions..."
                  className="w-full px-3 py-2.5 border border-[var(--border-color)] bg-[var(--surface-alt)] text-[var(--ink)] rounded-md outline-none transition-colors focus:border-[var(--accent)] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6">
            <h2 className="text-sm font-semibold tracking-wide text-[var(--ink)] uppercase mb-4">
              Payment Method
            </h2>
            <div className="flex items-center justify-between border border-[var(--accent)] bg-[var(--accent-soft)] rounded-xl p-4">
              <div>
                <p className="font-medium text-[var(--ink)]">Cash on Delivery</p>
                <p className="text-sm text-[var(--muted)] mt-0.5">
                  Pay when your order arrives
                </p>
              </div>
              <span className="w-4 h-4 rounded-full border-2 border-[var(--accent)] bg-[var(--accent)]" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-950/40 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded text-sm">
              {error}
            </div>
          )}

          {/* Mobile submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="lg:hidden w-full flex items-center justify-center gap-2 bg-[var(--ink)] text-[var(--surface-alt)] py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Placing Order...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-6 lg:sticky lg:top-24">
            <h2 className="text-sm font-semibold tracking-wide text-[var(--ink)] uppercase mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-[var(--surface-alt)] overflow-hidden shrink-0 border border-[var(--border-color)]">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--ink)] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {[item.size && `Size ${item.size}`, item.color]
                        .filter(Boolean)
                        .join(" · ")}{" "}
                      · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--ink)] shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--border-color)] mt-5 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-[var(--muted)]">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--muted)]">
                <span>Delivery</span>
                <span>Calculated at delivery</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[var(--ink)] pt-2 border-t border-[var(--border-color)]">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Desktop submit button */}
            <button
              type="submit"
              form="checkout-form"
              onClick={handleSubmit}
              disabled={submitting}
              className="hidden lg:flex w-full items-center justify-center gap-2 bg-[var(--ink)] text-[var(--surface-alt)] py-3 rounded-xl font-semibold mt-6 hover:opacity-85 transition-opacity disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}