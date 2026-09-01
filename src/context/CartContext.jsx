"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "dreem_walker_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // corrupted storage, ignore and start fresh
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist to localStorage whenever cart changes (after initial hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          setItems(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {
          // ignore parse errors
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addItem = useCallback((product, variant, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.variantId === variant.id);

      if (existing) {
        return prev.map((item) =>
          item.variantId === variant.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + quantity,
                  variant.stock ?? Infinity
                ),
              }
            : item
        );
      }

      return [
        ...prev,
        {
          variantId: variant.id,
          productId: product.id,
          name: product.name,
          image: variant.image_url,
          size: variant.size,
          color: variant.color,
          price: variant.price,
          stock: variant.stock,
          quantity: Math.min(quantity, variant.stock ?? Infinity),
        },
      ];
    });
  }, []);

  const removeItem = useCallback((variantId) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.variantId !== variantId);
      }
      return prev.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: Math.min(quantity, item.stock ?? Infinity) }
          : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = {
    items,
    hydrated,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}