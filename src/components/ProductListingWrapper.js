"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";

export default function ProductListingWrapper({
  title,
  type,
  filterItems = [],
  filterKey = "subcategory",
  products = {},
  minPriceBound = 0,
  maxPriceBound = 100000,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { compareItems, removeFromCompare, clearCompare } = useCart();

  const [isCategoryCollapseOpen, setIsCategoryCollapseOpen] = useState(true);
  const [isPriceCollapseOpen, setIsPriceCollapseOpen] = useState(true);
  const [isRatingCollapseOpen, setIsRatingCollapseOpen] = useState(true);

  // Local state for interactive price inputs
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");

  // Synced states for checkboxes and sorting from URL
  const selectedItems = searchParams.getAll(filterKey);
  const currentSort = searchParams.get("sort") || "";
  const currentRating = searchParams.get("rating") || "";

  // Synchronize local price inputs if URL searchParams change
  useEffect(() => {
    setMinPrice(searchParams.get("min_price") || "");
    setMaxPrice(searchParams.get("max_price") || "");
  }, [searchParams]);

  // Helper to build URL search parameters
  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page to 1 on filter change
    params.delete("page");

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((val) => params.append(key, val));
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCheckboxChange = (id) => {
    const stringId = id.toString();
    const updated = selectedItems.includes(stringId)
      ? selectedItems.filter((x) => x !== stringId)
      : [...selectedItems, stringId];
    
    updateFilters({ [filterKey]: updated });
  };

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    updateFilters({
      min_price: minPrice,
      max_price: maxPrice,
    });
  };

  const handlePriceClear = () => {
    setMinPrice("");
    setMaxPrice("");
    updateFilters({
      min_price: "",
      max_price: "",
    });
  };

  const handleSortChange = (e) => {
    updateFilters({ sort: e.target.value });
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleRatingChange = (ratingVal) => {
    const valString = ratingVal.toString();
    const newRating = currentRating === valString ? "" : valString;
    updateFilters({ rating: newRating });
  };

  // Generate 6 price range checkboxes dynamically
  const minPriceBoundNum = parseFloat(minPriceBound) || 0;
  const maxPriceBoundNum = parseFloat(maxPriceBound) || 100000;
  const priceRanges = [];
  
  if (maxPriceBoundNum > minPriceBoundNum) {
    const steps = 6;
    const rawStep = (maxPriceBoundNum - minPriceBoundNum) / steps;
    
    // Round step to nice round numbers depending on scale
    let step = 100;
    if (rawStep > 10000) {
      step = Math.ceil(rawStep / 10000) * 10000;
    } else if (rawStep > 5000) {
      step = Math.ceil(rawStep / 5000) * 5000;
    } else if (rawStep > 1000) {
      step = Math.ceil(rawStep / 1000) * 1000;
    } else if (rawStep > 500) {
      step = Math.ceil(rawStep / 500) * 500;
    } else if (rawStep > 100) {
      step = Math.ceil(rawStep / 100) * 100;
    } else if (rawStep > 50) {
      step = Math.ceil(rawStep / 50) * 50;
    } else {
      step = Math.ceil(rawStep / 10) * 10;
    }
    
    for (let i = 0; i < steps; i++) {
      const start = minPriceBoundNum + i * step;
      if (start >= maxPriceBoundNum) break;
      const end = Math.min(start + step, maxPriceBoundNum);
      priceRanges.push({
        start: Math.round(start),
        end: Math.round(end),
      });
    }
  }

  const productList = products.data || [];
  const currentPage = products.current_page || 1;
  const lastPage = products.last_page || 1;
  const totalProducts = products.total || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb Header */}
      <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#c29900]">Home</Link>
            <span>/</span>
            <span className="text-gray-500">{type}</span>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[200px]">{title}</span>
          </nav>
          <h1 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#ffd300] rounded-xs inline-block"></span>
            <span>{title}</span>
            <span className="text-xs font-semibold text-gray-400 lowercase tracking-normal">
              ({totalProducts} products)
            </span>
          </h1>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Sort By:
          </label>
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 px-3 py-2 rounded-md outline-none cursor-pointer w-full md:w-48 focus:border-[#ffd300]"
          >
            <option value="">Default Sorting</option>
            <option value="1">Newest Arrivals</option>
            <option value="2">Oldest Products</option>
            <option value="3">Price: High to Low</option>
            <option value="4">Price: Low to High</option>
            <option value="5">Name: A to Z</option>
            <option value="6">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Main Filter + Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Filters Sidebar */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
          {/* Main Title Heading (SHOP BY) */}
          <div className="bg-[#ffd300] text-black font-extrabold text-xs px-4 py-3 uppercase tracking-wider rounded-t-lg select-none">
            Shop By
          </div>

          {/* Collapsible Category Section */}
          <div className="border border-gray-100 rounded-lg overflow-hidden shadow-xs bg-white">
            <button
              onClick={() => setIsCategoryCollapseOpen(!isCategoryCollapseOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 font-extrabold text-xs text-gray-800 uppercase tracking-wider select-none cursor-pointer"
            >
              <span>Category</span>
              <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isCategoryCollapseOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {isCategoryCollapseOpen && (
              <div className="p-4 flex flex-col gap-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin">
                {/* Current Parent Category Node */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-900">
                    <svg className="w-3 h-3 text-gray-400 rotate-90" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                    <span className="truncate">{title}</span>
                  </div>
                  {/* Child Nodes (Subcategories / Childcategories) */}
                  {filterItems.length > 0 && (
                    <div className="pl-4 flex flex-col gap-2 border-l border-gray-100 ml-1.5 pt-1">
                      {filterItems.map((item) => {
                        const itemId = item.id.toString();
                        const itemName = item.subcategoryName || item.childcategoryName || item.name;
                        const isChecked = selectedItems.includes(itemId);

                        return (
                          <label key={item.id} className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-[#c29900] cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCheckboxChange(item.id)}
                              className="rounded text-[#c29900] focus:ring-[#ffd300] border-gray-300 w-3.5 h-3.5 cursor-pointer"
                            />
                            <span className="truncate">{itemName}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Price Section */}
          <div className="border border-gray-100 rounded-lg overflow-hidden shadow-xs bg-white">
            <button
              onClick={() => setIsPriceCollapseOpen(!isPriceCollapseOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 font-extrabold text-xs text-gray-800 uppercase tracking-wider select-none cursor-pointer"
            >
              <span>Price</span>
              <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isPriceCollapseOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {isPriceCollapseOpen && (
              <div className="p-4 flex flex-col gap-3">
                {priceRanges.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {priceRanges.map((range, idx) => {
                      const rangeMinStr = range.start.toString();
                      const rangeMaxStr = range.end.toString();
                      const isChecked = searchParams.get("min_price") === rangeMinStr && searchParams.get("max_price") === rangeMaxStr;
                      const label = `BDT ${range.start.toLocaleString()} - BDT ${range.end.toLocaleString()}`;

                      return (
                        <label key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-gray-600 hover:text-[#c29900] cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                updateFilters({ min_price: "", max_price: "" });
                              } else {
                                updateFilters({ min_price: rangeMinStr, max_price: rangeMaxStr });
                              }
                            }}
                            className="rounded text-[#c29900] focus:ring-[#ffd300] border-gray-300 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 font-medium">No price range available</span>
                )}
              </div>
            )}
          </div>

          {/* Collapsible Rating Section */}
          <div className="border border-gray-100 rounded-lg overflow-hidden shadow-xs bg-white">
            <button
              onClick={() => setIsRatingCollapseOpen(!isRatingCollapseOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 font-extrabold text-xs text-gray-800 uppercase tracking-wider select-none cursor-pointer"
            >
              <span>Rating</span>
              <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isRatingCollapseOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {isRatingCollapseOpen && (
              <div className="p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-2.5">
                  {[4, 3, 2, 1].map((ratingVal) => {
                    const isChecked = currentRating === ratingVal.toString();
                    return (
                      <label key={ratingVal} className="flex items-center gap-2.5 text-xs font-semibold text-gray-600 hover:text-[#c29900] cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleRatingChange(ratingVal)}
                          className="rounded text-[#c29900] focus:ring-[#ffd300] border-gray-300 w-3.5 h-3.5 cursor-pointer"
                        />
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, starIdx) => {
                              const isFilled = starIdx < ratingVal;
                              return (
                                <svg
                                  key={starIdx}
                                  className={`w-3.5 h-3.5 ${isFilled ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                                  fill={isFilled ? "currentColor" : "none"}
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.195-.39.75-.39.945 0l2.32 4.675 5.158.749c.433.063.606.592.293.898l-3.733 3.633.882 5.138c.078.455-.401.8-.802.585l-4.618-2.428-4.618 2.428c-.4.215-.88-.13-.802-.585l.882-5.138-3.733-3.633c-.313-.306-.14-.835.293-.898l5.158-.75 2.32-4.675z" />
                                </svg>
                              );
                            })}
                          </div>
                          <span className="ml-1 text-gray-500 font-medium">and above</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Compare Products Section */}
          <div className="border border-gray-100 rounded-lg overflow-hidden shadow-xs bg-white flex flex-col">
            <div className="w-full px-4 py-3 bg-[#ffd300] font-extrabold text-xs text-black uppercase tracking-wider select-none">
              Compare Products
            </div>
            <div className="p-4 flex flex-col gap-3">
              {compareItems.length > 0 ? (
                <div className="flex flex-col gap-2.5">
                  {compareItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center gap-2 text-xs border-b border-gray-50 pb-2">
                      <span className="truncate text-gray-700 font-semibold max-w-[150px]">{item.name}</span>
                      <button
                        onClick={() => removeFromCompare(item.id)}
                        className="text-gray-400 hover:text-[#c29900] transition-colors p-0.5 cursor-pointer"
                        title="Remove"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <Link
                      href="/compare"
                      className="flex-grow text-center bg-gray-900 text-white text-[11px] font-bold py-1.5 rounded uppercase hover:bg-gray-800 transition-colors"
                    >
                      Compare
                    </Link>
                    <button
                      onClick={clearCompare}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold py-1.5 px-3 rounded uppercase transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-gray-400 font-semibold">No products to compare.</span>
              )}
            </div>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {productList.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {productList.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Dynamic Pagination Controls */}
              {lastPage > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6 border-t border-gray-100 mt-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-200 text-xs font-bold rounded hover:bg-[#ffd300] hover:text-black disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
                  >
                    Prev
                  </button>
                  
                  {Array.from({ length: lastPage }, (_, idx) => {
                    const pageNum = idx + 1;
                    const isCurrent = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1.5 text-xs font-bold rounded border transition-colors ${
                          isCurrent
                            ? "bg-[#ffd300] border-[#ffd300] text-black"
                            : "border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    className="px-3 py-1.5 border border-gray-200 text-xs font-bold rounded hover:bg-[#ffd300] hover:text-black disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-gray-100 rounded-lg p-12 text-center text-gray-400 shadow-xs">
              <svg className="w-16 h-16 text-gray-200 mb-4 mx-auto fill-none stroke-current" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25-2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <h3 className="text-sm font-bold text-gray-500 mb-1">No products found</h3>
              <p className="text-xs">Try clearing some filters or search for another category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
