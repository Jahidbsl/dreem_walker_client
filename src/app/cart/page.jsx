"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, cartTotal } = useCart();

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 dark:text-zinc-400 mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          href="/products"
          className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold transition-opacity hover:opacity-85"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  const shipping = 10.0;
  const total = cartTotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-zinc-800 pb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">
              Product Details
            </span>
            <button
              onClick={clearCart}
              className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
            >
              Clear Cart
            </button>
          </div>

          {items.map((item) => {
            return (
              <div
                key={item.variantId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-gray-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-black"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 bg-gray-100 dark:bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                      {[
                        item.size && `Size: ${item.size}`,
                        item.color && `Color: ${item.color}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                      ${item.price || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-4 sm:mt-0">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity - 1)
                      }
                      className="px-3 py-1 bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity + 1)
                      }
                      className="px-3 py-1 bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <span className="font-semibold text-gray-900 dark:text-white min-w-[70px] text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Box */}
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 h-fit space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-zinc-400">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-zinc-400">
              <span>Estimated Shipping</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${shipping.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-zinc-800 pt-4 flex justify-between text-base font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full block text-center bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-semibold transition-opacity hover:opacity-85"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}