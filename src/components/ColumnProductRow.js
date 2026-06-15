"use client";

import React from "react";
import Link from "next/link";
import { getImageUrl } from "../utils/api";

export default function ColumnProductRow({ product }) {
  const price = parseFloat(product?.new_price || 0);
  const imageObj = product?.image || product?.images?.[0];
  const img = imageObj?.image || product?.thumbnail || "";
  const emiPrice = Math.round(price / 12);

  return (
    <div className="flex items-center gap-3 p-2 border border-gray-100 hover:border-amber-100 hover:shadow-xs rounded-lg bg-white transition-all duration-200 group">
      <Link
        href={`/product/${product?.slug}`}
        className="flex-shrink-0 w-16 h-16 border border-gray-100 rounded-md overflow-hidden flex items-center justify-center p-1.5 bg-gray-50"
      >
        <img
          src={getImageUrl(img)}
          alt={product?.name || "Product image"}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </Link>
      <div className="flex-grow min-w-0 flex flex-col justify-center">
        <Link
          href={`/product/${product?.slug}`}
          className="text-xs font-semibold text-gray-800 group-hover:text-[#c29900] transition-colors truncate block mb-0.5 leading-snug"
          title={product?.name}
        >
          {product?.name}
        </Link>
        <div className="text-sm font-extrabold text-[#c29900] mb-0.5">
          BDT {price.toLocaleString()}
        </div>
        <div className="text-[10px] text-gray-400 font-medium">
          EMIs from BDT {emiPrice.toLocaleString()} / Month
        </div>
      </div>
    </div>
  );
}
