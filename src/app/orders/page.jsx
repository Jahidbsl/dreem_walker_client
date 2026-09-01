"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, Loader2 } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-[var(--border-color)] text-[var(--muted)]",
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

const STATUS_LABELS = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load orders");

        const data = await res.json();
        setOrders(data.data ?? []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-[var(--muted)] text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading your orders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[var(--ink)] font-medium mb-1">Couldn't load orders</p>
          <p className="text-sm text-[var(--muted)]">{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <Package className="w-10 h-10 text-[var(--muted)] mx-auto mb-3" />
          <p className="text-[var(--ink)] font-medium mb-1">No orders yet</p>
          <p className="text-sm text-[var(--muted)] mb-4">
            Your placed orders will show up here.
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-[family-name:var(--font-display)] font-semibold text-[var(--ink)] mb-8">
        My Orders
      </h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const itemCount =
            order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
          const previewItems = order.items?.slice(0, 3) ?? [];
          const extraCount = (order.items?.length ?? 0) - previewItems.length;

          return (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-5 hover:border-[var(--accent)]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    Order #{order.id}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {itemCount} item{itemCount !== 1 ? "s" : ""}
                  </p>
                </div>

                <span
                  className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                    STATUS_STYLES[order.status] || STATUS_STYLES.pending
                  }`}
                >
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {previewItems.map((item, i) => (
                    <div
                      key={item.id ?? i}
                      className="w-10 h-10 rounded-lg border-2 border-[var(--surface)] bg-[var(--surface-alt)] overflow-hidden"
                    >
                      {item.variant?.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.variant.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                  {extraCount > 0 && (
                    <div className="w-10 h-10 rounded-lg border-2 border-[var(--surface)] bg-[var(--surface-alt)] flex items-center justify-center text-xs font-medium text-[var(--muted)]">
                      +{extraCount}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-[var(--ink)]">
                    ${Number(order.total).toFixed(2)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}