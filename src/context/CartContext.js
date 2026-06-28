"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Load cart, wishlist, and compare items from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      
      const storedWishlist = localStorage.getItem("wishlistItems");
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist));
      }

      const storedCompare = localStorage.getItem("compareItems");
      if (storedCompare) {
        setCompareItems(JSON.parse(storedCompare));
      }
    } catch (error) {
      console.error("Error reading cart/wishlist/compare from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  // Sync to localStorage helpers
  const saveCart = (items) => {
    setCartItems(items);
    try {
      localStorage.setItem("cartItems", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  };

  const saveWishlist = (items) => {
    setWishlistItems(items);
    try {
      localStorage.setItem("wishlistItems", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving wishlist to localStorage", error);
    }
  };

  const saveCompare = (items) => {
    setCompareItems(items);
    try {
      localStorage.setItem("compareItems", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving compare to localStorage", error);
    }
  };

  const addToCart = (product, qty = 1, variant = null, selectedColor = null, selectedSize = null) => {
    const variantId = variant ? variant.id : null;
    const rowId = variantId ? `prod-${product.id}-var-${variantId}` : `prod-${product.id}`;

    // Get correct price: variant price or product price
    const price = variant && variant.new_price !== undefined && variant.new_price !== null
      ? parseFloat(variant.new_price)
      : parseFloat(product.new_price);

    const oldPrice = variant && variant.old_price !== undefined && variant.old_price !== null
      ? parseFloat(variant.old_price)
      : parseFloat(product.old_price || product.new_price);

    // Get correct image path
    const image = variant && variant.image
      ? variant.image
      : (product.image?.image || product.display_image || "");

    const newItems = [...cartItems];
    const existingIndex = newItems.findIndex((item) => item.rowId === rowId);

    if (existingIndex > -1) {
      newItems[existingIndex].qty += qty;
    } else {
      newItems.push({
        rowId,
        id: product.id,
        name: product.name,
        price: price,
        old_price: oldPrice,
        image: image,
        qty: qty,
        variant_id: variantId,
        product_size: selectedSize || (variant ? variant.size : null),
        product_color: selectedColor || (variant ? variant.color : null),
        slug: product.slug,
      });
    }

    saveCart(newItems);
  };

  const removeFromCart = (rowId) => {
    const newItems = cartItems.filter((item) => item.rowId !== rowId);
    saveCart(newItems);
  };

  const updateQty = (rowId, qty) => {
    const newItems = cartItems.map((item) => {
      if (item.rowId === rowId) {
        return { ...item, qty: Math.max(1, qty) };
      }
      return item;
    });
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Wishlist actions
  const toggleWishlist = (product) => {
    const existingIndex = wishlistItems.findIndex((item) => item.id === product.id);
    let newItems;
    if (existingIndex > -1) {
      newItems = wishlistItems.filter((item) => item.id !== product.id);
    } else {
      newItems = [
        ...wishlistItems,
        {
          id: product.id,
          name: product.name,
          price: parseFloat(product.new_price),
          old_price: parseFloat(product.old_price || product.new_price),
          image: product.image?.image || product.display_image || "",
          slug: product.slug,
        },
      ];
    }
    saveWishlist(newItems);
  };

  const removeFromWishlist = (id) => {
    const newItems = wishlistItems.filter((item) => item.id !== id);
    saveWishlist(newItems);
  };

  const clearWishlist = () => {
    saveWishlist([]);
  };

  // Compare actions
  const addToCompare = (product) => {
    const alreadyInCompare = compareItems.some((item) => item.id === product.id);
    if (alreadyInCompare) {
      addToast("Product already exists in comparison list.", "warning");
      return;
    }
    if (compareItems.length >= 4) {
      addToast("You can compare up to 4 products at a time.", "warning");
      return;
    }
    const newItems = [
      ...compareItems,
      {
        id: product.id,
        name: product.name,
        price: parseFloat(product.new_price),
        old_price: parseFloat(product.old_price || product.new_price),
        image: product.image?.image || product.display_image || "",
        slug: product.slug,
        brand: product.brand?.name || "N/A",
        category: product.category?.name || "N/A",
        colors: product.procolors?.map(pc => pc.color?.colorName).join(", ") || "N/A",
        sizes: product.prosizes?.map(ps => ps.size?.sizeName).join(", ") || "N/A",
        stockStatus: (product.warehouse_stocks?.reduce((acc, ws) => acc + Math.max(0, parseInt(ws.physical_quantity || 0) - parseInt(ws.reserved_quantity || 0)), 0) || 0) > 0 ? "In Stock" : "Out of Stock",
      },
    ];
    saveCompare(newItems);
    addToast("Product added to comparison list.", "success");
  };

  const removeFromCompare = (id) => {
    const newItems = compareItems.filter((item) => item.id !== id);
    saveCompare(newItems);
  };

  const clearCompare = () => {
    saveCompare([]);
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoaded,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartSubtotal,
        cartCount,
        addToast,

        // Wishlist
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist: (id) => wishlistItems.some((item) => item.id === id),

        // Compare
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare: (id) => compareItems.some((item) => item.id === id),
      }}
    >
      {children}

      {/* Global Toast Notification System */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 animate-slide-in-right bg-white ${
              toast.type === "error"
                ? "border-red-500 text-red-800"
                : toast.type === "warning"
                ? "border-yellow-500 text-yellow-800"
                : "border-green-500 text-green-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "error" ? (
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : toast.type === "warning" ? (
                <svg className="w-5 h-5 text-yellow-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-xs font-bold font-sans text-gray-800 leading-tight">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
