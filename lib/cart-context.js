"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export const SHIPPING_FLAT_RATE = 250;
export const FREE_SHIPPING_THRESHOLD = 6000;

const STORAGE_KEY = "thewalledit_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState(null);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // storage full or unavailable — cart still works in-memory
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  function addItem(product, options = {}) {
    const { size, qty = 1, kind = "product", price } = options;
    const resolvedPrice = price != null ? price : product.price;
    const lineId = `${kind}:${product.id}:${size || "default"}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        return prev.map((i) =>
          i.lineId === lineId ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          lineId,
          kind,
          id: product.id,
          name: product.name,
          image: product.image,
          price: resolvedPrice,
          size: size || product.sizes?.[0] || null,
          qty,
        },
      ];
    });
    setBump((b) => b + 1);
    setToast({ id: Date.now(), name: product.name });
  }

  function removeItem(lineId) {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }

  function updateQty(lineId, qty) {
    if (qty <= 0) return removeItem(lineId);
    setItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, qty } : i)));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const itemCount = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const shipping = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  }, [subtotal, items.length]);
  const total = subtotal + shipping;
  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const value = {
    items,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    subtotal,
    shipping,
    total,
    itemCount,
    amountToFreeShipping,
    toast,
    bump,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function formatPKR(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-PK")}`;
}
