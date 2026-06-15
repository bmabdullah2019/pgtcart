"use client";

import React from "react";
import Link from "next/link";
import { getImageUrl, BACKEND_URL } from "../utils/api";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useCart();
  
  const oldPrice = parseFloat(product?.old_price || 0);
  const newPrice = parseFloat(product?.new_price || 0);
  const hasDiscount = oldPrice > newPrice && newPrice >= 0;
  const discount = hasDiscount ? ((oldPrice - newPrice) * 100) / oldPrice : 0;
  
  // Handle image path
  const imageObj = product?.image || product?.images?.[0];
  const cardImg = imageObj?.image || product?.thumbnail || "";

  // Mock rating/review count as in Laravel fallback
  const displayRating = 4;
  const displayRatingCount = 0;

  const isOutOfStock = false; // By default we mark in stock unless specified
  const emiPrice = Math.round(newPrice / 12);

  const isWishlisted = isInWishlist(product?.id);

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
      {/* Discount Badge */}
      {hasDiscount && (
        <span className="absolute top-3 left-3 bg-[#ffd300] text-black text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded z-10 shadow-sm animate-pulse">
          {Math.round(discount)}% OFF
        </span>
      )}

      {/* Media wrapper */}
      <div className="relative pt-[100%] bg-gray-50 flex items-center justify-center overflow-hidden">
        <Link href={`/product/${product?.slug}`} className="absolute inset-0 p-4 flex items-center justify-center">
          <img
            src={getImageUrl(cardImg)}
            alt={product?.name || "Product image"}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Action Button Overlays */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={() => toggleWishlist(product)}
            className={`p-2 rounded-full shadow-md transition-all duration-300 ${
              isWishlisted ? "bg-red-500 text-white" : "bg-white hover:bg-[#ffd300] text-gray-800 hover:text-black"
            }`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <svg className={`w-4 h-4 ${isWishlisted ? "fill-current" : "fill-none"}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button
            className="px-4 py-1.5 bg-[#ffd300] hover:bg-black text-black hover:text-[#ffd300] text-xs font-bold rounded shadow-md transition-colors"
          >
            Add to Cart
          </button>
          <Link
            href={`/product/${product?.slug}`}
            className="p-2 bg-white hover:bg-[#ffd300] text-gray-800 hover:text-black rounded-full shadow-md transition-colors"
            title="Quick View"
          >
            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Body details */}
      <div className="p-4 flex flex-col flex-grow bg-white">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-3.5 h-3.5 ${
                star <= displayRating ? "text-amber-400 fill-current" : "text-gray-200"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-[10px] text-gray-400 font-semibold font-mono">({displayRatingCount})</span>
        </div>

        {/* Title */}
        <Link
          href={`/product/${product?.slug}`}
          className="text-xs sm:text-sm font-semibold text-gray-800 hover:text-[#c29900] transition-colors leading-tight line-clamp-2 mb-2 min-h-[2.5rem]"
        >
          {product?.name}
        </Link>

        {/* Pricing */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-extrabold text-[#c29900]">
              BDT {newPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <del className="text-[11px] sm:text-xs text-gray-400">
                BDT {oldPrice.toLocaleString()}
              </del>
            )}
          </div>
          <div className="text-[10px] sm:text-[11px] text-gray-400 font-medium tracking-wide mt-0.5">
            EMIs from BDT {emiPrice.toLocaleString()} / Month
          </div>
        </div>

        {/* In-Stock Indicator */}
        <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
          In stock
        </div>
      </div>
    </div>
  );
}
