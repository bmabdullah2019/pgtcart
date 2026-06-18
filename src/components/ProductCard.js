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
    <div className="bg-white rounded-none border-b border-r border-gray-100 overflow-hidden hover:shadow-md hover:z-10 transition-all duration-300 group flex flex-col h-full relative">
      {/* Discount Badge */}
      {hasDiscount && (
        <span className="absolute top-3 left-3 bg-[#ffd300] text-black text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded z-10 shadow-sm animate-pulse">
          {Math.round(discount)}% OFF
        </span>
      )}

      {/* Wishlist Heart Icon (Always visible but subtle) */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 hover:bg-white rounded-full text-gray-400 hover:text-red-500 shadow-xs transition-colors cursor-pointer"
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <svg className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "fill-none text-gray-300"}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Media wrapper */}
      <div className="relative pt-[100%] bg-white flex items-center justify-center overflow-hidden">
        <Link href={`/product/${product?.slug}`} className="absolute inset-0 p-4 flex items-center justify-center">
          <img
            src={getImageUrl(cardImg)}
            alt={product?.name || "Product image"}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Action Button Overlays (Floating sidebar on hover) */}
        <div className="absolute right-3 top-12 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 z-10">
          <button
            className="p-2 bg-white hover:bg-[#ffd300] text-gray-700 hover:text-black rounded-full shadow-md transition-colors"
            title="Add to Cart"
          >
            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
          <Link
            href={`/product/${product?.slug}`}
            className="p-2 bg-white hover:bg-[#ffd300] text-gray-700 hover:text-black rounded-full shadow-md transition-colors"
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
      <div className="p-4 flex flex-col flex-grow bg-white text-center">
        {/* Title */}
        <Link
          href={`/product/${product?.slug}`}
          className="text-xs sm:text-sm font-semibold text-gray-800 hover:text-[#c29900] transition-colors leading-tight line-clamp-2 mb-2 min-h-[2.5rem] text-center"
        >
          {product?.name}
        </Link>

        {/* Pricing */}
        <div className="mt-auto pt-1 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm sm:text-base font-extrabold text-[#c29900]">
              BDT {newPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <del className="text-[11px] sm:text-xs text-gray-400">
                BDT {oldPrice.toLocaleString()}
              </del>
            )}
          </div>
          <div className="text-[10px] sm:text-[11px] text-gray-500 font-semibold tracking-wide mt-1">
            EMIs from <span className="font-extrabold text-gray-900">BDT {emiPrice.toLocaleString()}/Month</span>
          </div>
        </div>
      </div>
    </div>
  );
}
