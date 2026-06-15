"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
      alert("Product already exists in comparison list.");
      return;
    }
    if (compareItems.length >= 4) {
      alert("You can compare up to 4 products at a time.");
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
    alert("Product added to comparison list.");
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
