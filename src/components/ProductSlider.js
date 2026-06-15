"use client";

import React, { useRef } from "react";
import ProductCard from "./ProductCard";

export default function ProductSlider({ products }) {
  const containerRef = useRef(null);

  if (!products || products.length === 0) return null;

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group w-full">
      {/* Scroll controls */}
      {products.length > 4 && (
        <>
          <button
            onClick={scrollLeft}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-lg border border-gray-100 hover:bg-[#ffd300] hover:text-black transition-all z-10 opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-lg border border-gray-100 hover:bg-[#ffd300] hover:text-black transition-all z-10 opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((prod) => (
          <div
            key={prod.id}
            className="w-[180px] sm:w-[220px] md:w-[240px] flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <ProductCard product={prod} />
          </div>
        ))}
      </div>
    </div>
  );
}
