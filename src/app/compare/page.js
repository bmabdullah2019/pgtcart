"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../utils/api";

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare, addToCart } = useCart();

  const handleAddToCart = (item) => {
    // Construct product payload for addToCart
    const productPayload = {
      id: item.id,
      name: item.name,
      new_price: item.price,
      old_price: item.old_price,
      display_image: item.image,
      slug: item.slug,
    };
    addToCart(productPayload, 1);
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      <div className="border-b border-gray-200 pb-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-black uppercase tracking-wider text-gray-900 flex items-center gap-3">
          <span className="w-3 h-7 bg-[#ffd300] rounded-sm"></span>
          Product Comparison ({compareItems.length}/4)
        </h1>
        {compareItems.length > 0 && (
          <button
            onClick={clearCompare}
            className="border border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded transition-all"
          >
            Clear List
          </button>
        )}
      </div>

      {compareItems.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg p-12 text-center shadow-xs flex flex-col items-center justify-center">
          <svg className="w-20 h-20 text-gray-200 mb-6 fill-none stroke-current" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20h5v-5M21 3L13 11M3 21l8-8" />
          </svg>
          <h2 className="text-lg font-bold text-gray-700 mb-2">No Products Selected</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md">
            Add products to your comparison list from the product cards or details pages to view details side-by-side.
          </p>
          <Link
            href="/"
            className="bg-[#ffd300] hover:bg-[#e6be00] text-black font-extrabold text-xs uppercase tracking-widest px-8 py-3 rounded transition-colors shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <th className="p-4 sm:p-5 w-48 font-bold border-r border-gray-100">Features</th>
                  {compareItems.map((item) => (
                    <th key={item.id} className="p-4 sm:p-5 w-64 border-r border-gray-100 last:border-r-0 relative group">
                      <button
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 bg-white hover:bg-red-50 rounded-full shadow-xs border border-gray-100"
                        title="Remove product"
                      >
                        <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="flex flex-col items-center text-center gap-3 pt-2">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-24 h-24 object-contain bg-gray-50 rounded p-1 border border-gray-100"
                        />
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-bold text-gray-800 hover:text-[#c29900] text-xs sm:text-sm transition-colors line-clamp-2 min-h-[2.5rem]"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-baseline gap-1.5 justify-center">
                          <span className="font-extrabold text-[#c29900] text-sm sm:text-base">
                            ৳ {item.price.toLocaleString()}
                          </span>
                          {item.old_price > item.price && (
                            <del className="text-[10px] text-gray-400 font-semibold">
                              ৳ {item.old_price.toLocaleString()}
                            </del>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full bg-[#ffd300] hover:bg-[#e6be00] text-black font-extrabold text-xs uppercase tracking-widest py-2 rounded transition-colors shadow-xs"
                        >
                          Add To Cart
                        </button>
                      </div>
                    </th>
                  ))}
                  {/* Fill empty spaces to keep table neat */}
                  {Array.from({ length: Math.max(0, 4 - compareItems.length) }).map((_, idx) => (
                    <th key={`empty-${idx}`} className="p-4 sm:p-5 w-64 border-r border-gray-100 last:border-r-0 bg-slate-50/20">
                      <div className="flex flex-col items-center justify-center text-center text-gray-300 py-12">
                        <svg className="w-8 h-8 mb-2 fill-none stroke-current" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span className="text-xs font-semibold">Add product to compare</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-semibold text-gray-700">
                {/* Brand row */}
                <tr className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-4 sm:p-5 border-r border-gray-100 font-bold bg-slate-50/50 text-gray-500 uppercase tracking-wider">Brand</td>
                  {compareItems.map((item) => (
                    <td key={`brand-${item.id}`} className="p-4 sm:p-5 border-r border-gray-100 last:border-r-0 text-center font-bold text-gray-800">{item.brand}</td>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - compareItems.length) }).map((_, idx) => (
                    <td key={`brand-empty-${idx}`} className="p-4 sm:p-5 border-r border-gray-100 last:border-r-0 bg-slate-50/20"></td>
                  ))}
                </tr>
                {/* Category row */}
                <tr className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-4 sm:p-5 border-r border-gray-100 font-bold bg-slate-50/50 text-gray-500 uppercase tracking-wider">Category</td>
                  {compareItems.map((item) => (
                    <td key={`cat-${item.id}`} className="p-4 sm:p-5 border-r border-gray-100 last:border-r-0 text-center text-gray-600">{item.category}</td>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - compareItems.length) }).map((_, idx) => (
                    <td key={`cat-empty-${idx}`} className="p-4 sm:p-5 border-r border-gray-100 last:border-r-0 bg-slate-50/20"></td>
                  ))}
                </tr>
                {/* Stock Status row */}
                <tr className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-4 sm:p-5 border-r border-gray-100 font-bold bg-slate-50/50 text-gray-500 uppercase tracking-wider">Availability</td>
                  {compareItems.map((item) => {
                    const isAvailable = item.stockStatus === "In Stock";
                    return (
                      <td key={`stock-${item.id}`} className="p-4 sm:p-5 border-r border-gray-100 last:border-r-0 text-center">
                        <span className={`font-bold uppercase tracking-wider ${isAvailable ? "text-emerald-600" : "text-red-500"}`}>
                          {item.stockStatus}
                        </span>
                      </td>
                    );
                  })}
                  {Array.from({ length: Math.max(0, 4 - compareItems.length) }).map((_, idx) => (
                    <td key={`stock-empty-${idx}`} className="p-4 sm:p-5 border-r border-gray-100 last:border-r-0 bg-slate-50/20"></td>
                  ))}
                </tr>
                {/* Sizes row */}
                <tr className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-4 sm:p-5 border-r border-gray-100 font-bold bg-slate-50/50 text-gray-500 uppercase tracking-wider">Sizes</td>
                  {compareItems.map((item) => (
                    <td key={`sizes-${item.id}`} className="p-4 sm:p-5 border-r border-gray-100 last:border-r-0 text-center text-gray-500">{item.sizes}</td>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - compareItems.length) }).map((_, idx) => (
                    <td key={`sizes-empty-${idx}`} className="p-4 sm:p-5 border-r border-gray-100 last:border-r-0 bg-slate-50/20"></td>
                  ))}
                </tr>
                {/* Colors row */}
                <tr className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-4 sm:p-5 border-r border-gray-100 font-bold bg-slate-50/50 text-gray-500 uppercase tracking-wider">Colors</td>
                  {compareItems.map((item) => (
                    <td key={`colors-${item.id}`} className="p-4 sm:p-5 border-r border-gray-100 last:border-r-0 text-center text-gray-500">{item.colors}</td>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - compareItems.length) }).map((_, idx) => (
                    <td key={`colors-empty-${idx}`} className="p-4 sm:p-5 border-r border-gray-100 last:border-r-0 bg-slate-50/20"></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
