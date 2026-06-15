"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getImageUrl, BACKEND_URL } from "../utils/api";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";

export default function ProductDetailsWrapper({
  product = {},
  relatedProducts = [],
  variantPayload = {},
  displayGallery = [],
  shippingCharges = [],
}) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist, addToCompare, isInCompare } = useCart();

  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  // Active Main Image State
  const [activeImage, setActiveImage] = useState(
    product.display_image || (displayGallery[0]?.src ?? "/no-image.jpg")
  );

  // Attributes State (e.g., color: "", size: "")
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Initialize selected attributes with first available options if variants exist
  useEffect(() => {
    if (variantPayload.has_variant && variantPayload.attribute_groups?.length > 0) {
      const initialAttrs = {};
      variantPayload.attribute_groups.forEach((group) => {
        if (group.values?.length > 0) {
          // Find first attribute value that is valid
          initialAttrs[group.attribute_slug] = group.values[0].value;
        }
      });
      setSelectedAttributes(initialAttrs);
    }
  }, [variantPayload]);

  // Compute selected variant based on attribute selection
  useEffect(() => {
    if (variantPayload.has_variant && variantPayload.variants?.length > 0) {
      const match = variantPayload.variants.find((variant) => {
        // Compare selected attributes with variant attributes
        return Object.entries(selectedAttributes).every(([slug, val]) => {
          return variant.attributes?.[slug] === val || variant[slug] === val;
        });
      });

      setSelectedVariant(match || null);

      if (match && match.image) {
        setActiveImage(match.image);
      }
    } else {
      setSelectedVariant(null);
    }
  }, [selectedAttributes, variantPayload]);

  // Price calculations
  const price = selectedVariant
    ? (selectedVariant.price || selectedVariant.new_price || parseFloat(product.new_price))
    : parseFloat(product.new_price);

  const oldPrice = selectedVariant
    ? (selectedVariant.old_price || parseFloat(product.old_price || product.new_price))
    : parseFloat(product.old_price || product.new_price);

  // EMI monthly estimation (Price divided by 12)
  const emiPrice = Math.round(price / 12);

  // Calculate stock status
  const baseStock = product.warehouse_stocks?.reduce((acc, ws) => {
    return acc + Math.max(0, parseInt(ws.physical_quantity || 0) - parseInt(ws.reserved_quantity || 0));
  }, 0) || 0;

  const stockAvailable = variantPayload.has_variant
    ? (selectedVariant ? selectedVariant.sellable_stock : 0)
    : baseStock;

  const handleQtyChange = (val) => {
    setQty(Math.max(1, Math.min(stockAvailable || 100, qty + val)));
  };

  const handleAddToCart = () => {
    if (stockAvailable <= 0) {
      alert("This product is currently out of stock.");
      return;
    }
    addToCart(product, qty, selectedVariant, selectedAttributes.color, selectedAttributes.size);
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (stockAvailable <= 0) {
      alert("This product is currently out of stock.");
      return;
    }
    addToCart(product, qty, selectedVariant, selectedAttributes.color, selectedAttributes.size);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Product Information Grid */}
      <section className="bg-white border border-gray-100 rounded-lg p-6 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="border border-gray-100 rounded-lg overflow-hidden p-6 bg-gray-50 flex items-center justify-center aspect-square relative group">
            <img
              src={getImageUrl(activeImage)}
              alt={product.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          {displayGallery.length > 0 && (
            <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin">
              {displayGallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img.src)}
                  className={`w-16 h-16 border rounded p-1 bg-white flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors ${
                    activeImage === img.src ? "border-[#ffd300] ring-1 ring-[#ffd300]" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={getImageUrl(img.src)} alt={`Thumbnail ${idx}`} className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: PDP content (split into details + sidebar) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-gray-800">
          
          {/* Left Details Panel (3/5 width on desktop) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <div>
              {product.brand?.name && (
                <span className="text-xs font-extrabold uppercase text-[#c29900] tracking-widest bg-amber-50 px-2 py-0.5 rounded-sm mb-1 inline-block">
                  {product.brand.name}
                </span>
              )}
              <h1 className="text-lg md:text-xl font-bold uppercase text-gray-900 tracking-wide mt-1 leading-snug">
                {product.name}
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-1">
                SKU #: <span className="text-gray-700">{selectedVariant?.sku_code || product.sku_code || "N/A"}</span>
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-1 text-xs font-extrabold mt-1">
              {stockAvailable > 0 ? (
                <span className="text-emerald-600">✓ In stock</span>
              ) : (
                <span className="text-red-500">✕ Out of stock</span>
              )}
            </div>

            {/* Pricing & EMI info */}
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#c29900]">BDT {price.toLocaleString()}</span>
                {oldPrice > price && (
                  <span className="text-sm font-bold text-gray-400 line-through">BDT {oldPrice.toLocaleString()}</span>
                )}
              </div>
              {price >= 5000 && (
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  EMIs from <span className="text-black font-extrabold">BDT {emiPrice.toLocaleString()} / Month</span>
                </p>
              )}
            </div>

            {/* Attribute selectors */}
            {variantPayload.has_variant && variantPayload.attribute_groups?.map((group) => (
              <div key={group.attribute_id} className="flex flex-col gap-2 mt-2">
                <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider">
                  Select {group.attribute_name}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.values.map((val) => {
                    const isSelected = selectedAttributes[group.attribute_slug] === val.value;
                    return (
                      <button
                        key={val.value_id}
                        type="button"
                        onClick={() =>
                          setSelectedAttributes((prev) => ({
                            ...prev,
                            [group.attribute_slug]: val.value,
                          }))
                        }
                        className={`px-3 py-1.5 text-xs font-bold border rounded-sm cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-black border-black text-white"
                            : "border-gray-200 text-gray-700 hover:border-gray-400 bg-white"
                        }`}
                      >
                        {val.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mt-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span>Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-sm bg-white">
                <button
                  type="button"
                  onClick={() => handleQtyChange(-1)}
                  className="px-3 py-1 text-gray-500 hover:bg-gray-100 font-extrabold transition-colors cursor-pointer select-none"
                  disabled={qty <= 1}
                >
                  -
                </button>
                <span className="px-3 text-sm font-extrabold text-gray-900 w-10 text-center select-none">{qty}</span>
                <button
                  type="button"
                  onClick={() => handleQtyChange(1)}
                  className="px-3 py-1 text-gray-500 hover:bg-gray-100 font-extrabold transition-colors cursor-pointer select-none"
                  disabled={qty >= stockAvailable}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-4">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={stockAvailable <= 0}
                className="w-full bg-[#ffd300] hover:bg-[#e6be00] text-black py-3 rounded-sm text-xs font-extrabold uppercase tracking-widest transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:hover:bg-[#ffd300] disabled:cursor-not-allowed"
              >
                Add To Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={stockAvailable <= 0}
                className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-sm text-xs font-extrabold uppercase tracking-widest transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:hover:bg-black disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist & Compare */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  toggleWishlist(product);
                  router.push("/wishlist");
                }}
                className={`border py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isWishlisted 
                    ? "bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600" 
                    : "border-gray-200 text-gray-600 hover:text-[#c29900] hover:border-[#ffd300] bg-white"
                }`}
              >
                <svg className={`w-4 h-4 ${isWishlisted ? "fill-current" : "fill-none"}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  addToCompare(product);
                  router.push("/compare");
                }}
                className={`border py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isCompared 
                    ? "bg-slate-800 border-slate-800 text-white hover:bg-slate-900" 
                    : "border-gray-200 text-gray-600 hover:text-black hover:border-black bg-white"
                }`}
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 3h5v5M4 20h5v-5M21 3L13 11M3 21l8-8" />
                </svg>
                <span>Compare</span>
              </button>
            </div>

            {/* Share Links */}
            <div className="flex items-center gap-2 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3h-4V6.5c0-.8.4-1.2 1.2-1.2H18V1h-2.8C12 1 10 2.8 10 5.8V8H9z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.93 1.4-5.93s-.36-.72-.36-1.77c0-1.66.96-2.9 2.17-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.65 2.56-.99 3.99-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.76-2.24 3.76-5.47 0-2.86-2.06-4.86-5-4.86-3.4 0-5.4 2.56-5.4 5.2 0 1.03.4 2.14.9 2.75.1.12.1.22.08.33l-.33 1.35c-.05.2-.18.25-.42.14C3.83 16.7 3 14.88 3 12c0-4 3-8.2 8.95-8.2 4.7 0 8.35 3.35 8.35 7.8 0 4.67-2.95 8.44-7.05 8.44-1.37 0-2.67-.72-3.1-1.55l-1.07 4.08c-.35 1.37-1.32 3.08-1.97 4.15A12.01 12.01 0 0012 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Banner & Trust Indicators Sidebar (2/5 width on desktop) */}
          <div className="md:col-span-2 flex flex-col gap-4">
            
            {/* Free Shipping Badge */}
            <div className="bg-[#ffd300] text-black p-4 rounded-sm flex items-center gap-3 relative overflow-hidden select-none shadow-sm">
              <div className="flex-grow">
                <p className="font-extrabold text-sm uppercase tracking-wider italic leading-none">Free Shipping</p>
                <p className="text-[10px] font-bold opacity-90 mt-1.5">above 5000 Tk</p>
              </div>
              <svg className="w-9 h-9 text-black/95 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.208-3.32a2.625 2.625 0 00-2.614-2.463H15v3m-3.75-9H6A2.25 2.25 0 003.75 6v7.5c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V5.25a2.25 2.25 0 00-2.25-2.25h-2.25Z" />
              </svg>
            </div>

            {/* Trust Indicators Card */}
            <div className="bg-gray-50 border border-gray-100 rounded-sm p-4 flex flex-col gap-3 text-xs text-gray-700 font-semibold shadow-xs">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-500 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Accept Payments Online</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-500 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Cash on Delivery Facility</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-500 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>36 Months EMI Available</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-500 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Quick Delivery</span>
              </div>
              
              <div className="border-t border-gray-200 my-1"></div>
              
              <div className="flex flex-col gap-2">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Excellent Warranty Support</p>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg className="w-4 h-4 text-gray-500 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>100% Original Products</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg className="w-4 h-4 text-gray-500 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tabs Section for Description/Specifications */}
      <section className="bg-white border border-gray-100 rounded-lg p-6 shadow-xs flex flex-col gap-4">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-3 text-xs uppercase font-extrabold tracking-wider border-b-2 cursor-pointer transition-colors ${
              activeTab === "description" ? "border-[#ffd300] text-[#c29900]" : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specification")}
            className={`px-6 py-3 text-xs uppercase font-extrabold tracking-wider border-b-2 cursor-pointer transition-colors ${
              activeTab === "specification" ? "border-[#ffd300] text-[#c29900]" : "border-transparent text-gray-400 hover:text-black"
            }`}
          >
            Specification
          </button>
        </div>

        <div className="text-sm text-gray-600 leading-relaxed min-h-[150px]">
          {activeTab === "description" ? (
            product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description }} className="prose prose-sm max-w-none font-medium" />
            ) : (
              <p>No description available for this product.</p>
            )
          ) : (
            <div className="flex flex-col gap-2 font-semibold">
              <div className="grid grid-cols-3 py-2 border-b border-gray-50">
                <span className="text-gray-400">Category</span>
                <span className="col-span-2 text-gray-800">{product.category?.name || "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b border-gray-50">
                <span className="text-gray-400">Subcategory</span>
                <span className="col-span-2 text-gray-800">{product.subcategory?.subcategoryName || "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b border-gray-50">
                <span className="text-gray-400">Brand</span>
                <span className="col-span-2 text-gray-800">{product.brand?.name || "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 py-2">
                <span className="text-gray-400">Product Model</span>
                <span className="col-span-2 text-gray-800">{product.sku_code || "N/A"}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-end border-b-2 border-gray-100 pb-2">
            <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-[#ffd300] rounded-xs inline-block"></span>
              <span>Related Products</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.slice(0, 5).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
