"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "./ProductCard";

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

  // Local state for interactive price inputs
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");

  // Synced states for checkboxes and sorting from URL
  const selectedItems = searchParams.getAll(filterKey);
  const currentSort = searchParams.get("sort") || "";

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
        <aside className="bg-white border border-gray-100 rounded-lg p-5 shadow-xs flex flex-col gap-6 lg:sticky lg:top-24">
          
          {/* Subcategories/Childcategories list */}
          {filterItems.length > 0 && (
            <div>
              <h3 className="text-xs uppercase font-extrabold text-gray-900 tracking-wider mb-4 border-b border-gray-50 pb-2">
                Filter by Category
              </h3>
              <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                {filterItems.map((item) => {
                  const itemId = item.id.toString();
                  const itemName = item.subcategoryName || item.childcategoryName || item.name;
                  const isChecked = selectedItems.includes(itemId);

                  return (
                    <label key={item.id} className="flex items-center gap-2.5 text-xs font-semibold text-gray-600 hover:text-black cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(item.id)}
                        className="rounded text-[#c29900] focus:ring-[#ffd300] border-gray-300 w-4 h-4 cursor-pointer"
                      />
                      <span>{itemName}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div>
            <h3 className="text-xs uppercase font-extrabold text-gray-900 tracking-wider mb-4 border-b border-gray-50 pb-2">
              Filter by Price (BDT)
            </h3>
            <form onSubmit={handlePriceSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Min Price</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder={minPriceBound}
                    className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold px-2 py-1.5 rounded outline-none focus:border-[#ffd300]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Max Price</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder={maxPriceBound}
                    className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold px-2 py-1.5 rounded outline-none focus:border-[#ffd300]"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-grow bg-[#ffd300] text-black py-1.5 text-xs font-bold rounded uppercase tracking-wider hover:bg-[#e6be00] transition-colors"
                >
                  Apply
                </button>
                {(searchParams.get("min_price") || searchParams.get("max_price")) && (
                  <button
                    type="button"
                    onClick={handlePriceClear}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-3 text-xs font-bold rounded"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
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
