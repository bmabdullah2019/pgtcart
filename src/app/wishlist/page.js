"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../utils/api";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();

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
      <div className="border-b border-gray-200 pb-4 mb-8">
        <h1 className="text-2xl font-black uppercase tracking-wider text-gray-900 flex items-center gap-3">
          <span className="w-3 h-7 bg-[#ffd300] rounded-sm"></span>
          My Wishlist ({wishlistItems.length})
        </h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-lg p-12 text-center shadow-xs flex flex-col items-center justify-center">
          <svg className="w-20 h-20 text-gray-200 mb-6 fill-none stroke-current" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h2 className="text-lg font-bold text-gray-700 mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md">
            Explore our categories and add your favorite items to your wishlist to keep track of them.
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <th className="p-4 sm:p-5">Product Details</th>
                  <th className="p-4 sm:p-5">Price</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {wishlistItems.map((item) => {
                  const hasDiscount = item.old_price > item.price;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 sm:p-5">
                        <div className="flex gap-4 items-center">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-16 h-16 object-contain bg-gray-50 rounded border border-gray-100 p-1 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/product/${item.slug}`}
                              className="font-bold text-gray-800 hover:text-[#c29900] text-sm sm:text-base transition-colors line-clamp-2"
                            >
                              {item.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 align-middle">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
                          <span className="font-extrabold text-[#c29900] text-sm sm:text-base">
                            ৳ {item.price.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <del className="text-xs text-gray-400 font-semibold">
                              ৳ {item.old_price.toLocaleString()}
                            </del>
                          )}
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-right align-middle">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-[#ffd300] hover:bg-[#e6be00] text-black font-extrabold text-xs uppercase tracking-widest px-4 py-2 rounded transition-colors shadow-xs"
                          >
                            Add To Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="border border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-600 hover:bg-red-50 font-bold text-xs uppercase tracking-wider px-4 py-2 rounded transition-all"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
