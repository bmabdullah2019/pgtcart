"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getImageUrl, BACKEND_URL } from "../utils/api";
import { useCart } from "../context/CartContext";

export default function Header({ config, contact, categories }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cartItems, cartCount, cartSubtotal, updateQty, removeFromCart } = useCart();

  const siteName = config?.name || "Aminsuk";
  const headerLogo = config?.white_logo || config?.dark_logo || null;
  const hotline = contact?.hotline || "096 1144 1144";

  // Handle Search Input Change
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setIsSearching(true);
      const results = [];
      if (categories) {
        categories.forEach(cat => {
          if (selectedCategoryId && cat.id.toString() !== selectedCategoryId.toString()) {
            return;
          }
          if (cat.products) {
            cat.products.forEach(prod => {
              if (prod.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                results.push(prod);
              }
            });
          }
        });
      }
      setSearchResults(results.slice(0, 8));
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, selectedCategoryId, categories]);

  return (
    <header className="w-full font-sans sticky top-0 z-50 shadow-md bg-white">
      {/* Yellow Topbar */}
      <div className="bg-[#ffd300] text-black text-[13px] font-medium py-2 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            <a href={`tel:${hotline}`} className="hover:underline">
              {hotline}
            </a>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/wishlist" className="hover:text-gray-200 flex items-center gap-1.5 transition-colors">
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>Wishlist</span>
            </Link>
            <Link href="/compare" className="hover:text-gray-200 flex items-center gap-1.5 transition-colors">
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 3h5v5M4 20h5v-5M21 3L13 11M3 21l8-8" />
              </svg>
              <span>Compare</span>
            </Link>
            <span className="text-gray-400">|</span>
            <a href={`${BACKEND_URL}/customer/login`} className="hover:text-gray-200 flex items-center gap-1.5 transition-colors font-semibold">
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
              </svg>
              <span>Sign In</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Brand Middle Row — Search Left, Logo Center, Cart Right */}
      <div className="bg-white px-4 md:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4 py-2 md:py-4">
          {/* Left: Mobile Menu + Search Bar */}
          <div className="flex items-center gap-1 md:gap-2 flex-1 min-w-0">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-700 hover:text-[#c29900] transition-colors p-1 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search Bar — selalu visible di semua layar */}
            <div className="relative flex-1 max-w-xs md:max-w-sm lg:max-w-md">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm focus-within:border-[#ffd300] focus-within:ring-2 focus-within:ring-[#ffd300]/20 transition-all duration-200 h-9 md:h-10">
                <select
                  className="bg-transparent text-gray-500 text-[10px] md:text-[11px] font-semibold px-2 md:px-3 h-full border-r border-gray-200 outline-none cursor-pointer min-w-0 w-[80px] md:w-[110px] hover:bg-gray-100 transition-colors"
                  value={selectedCategoryId}
                  onChange={(e) => {
                    setSelectedCategoryId(e.target.value);
                    const selectedName = categories?.find(c => c.id.toString() === e.target.value)?.name || "All Categories";
                    setSelectedCategory(selectedName);
                  }}
                >
                  <option value="">All</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-grow px-2 md:px-3 text-[12px] md:text-xs text-gray-800 outline-none h-full bg-transparent placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-[#ffd300] text-black w-8 md:w-9 h-full flex items-center justify-center hover:bg-[#e6be00] transition-colors cursor-pointer flex-shrink-0">
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Search Dropdown Panel */}
              {isSearching && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl rounded-lg z-50 overflow-hidden">
                  {searchResults.length > 0 ? (
                    <div className="flex flex-col divide-y divide-gray-100">
                      {searchResults.map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/product/${prod.slug}`}
                          className="flex items-center gap-3 p-2.5 hover:bg-amber-50 transition-colors"
                          onClick={() => setSearchQuery("")}
                        >
                          <img
                            src={getImageUrl(prod.image?.image)}
                            alt={prod.name}
                            className="w-8 h-8 object-contain bg-gray-50 rounded border border-gray-100"
                          />
                          <div className="flex-grow min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{prod.name}</p>
                            <p className="text-[11px] text-[#c29900] font-bold">BDT {prod.new_price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-400">No products found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="flex items-center justify-center select-none flex-shrink-0">
            <img
              src="/logo.png"
              alt="PGT CART"
              className="h-[90px] md:h-[90px] lg:h-[90px] object-contain"
            />
          </Link>

          {/* Right: Cart Icon */}
          <div className="flex items-center gap-1 md:gap-2 flex-1 justify-end min-w-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-8 h-8 md:w-11 md:h-11 rounded-full text-gray-700 hover:text-[#c29900] hover:bg-amber-50 transition-all cursor-pointer focus:outline-none"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 fill-none stroke-current" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-rose-500 text-white text-[9px] md:text-[10px] min-w-[18px] h-[18px] md:min-w-[20px] md:h-[20px] rounded-full flex items-center justify-center font-bold shadow-sm ring-2 ring-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Nav Row */}
      <div className="bg-[#ffd300] text-black h-12 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center h-full px-4 md:px-8">
          {/* All Categories Trigger */}
          <div className="relative h-full">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="bg-black text-white hover:bg-gray-900 transition-colors px-6 h-full font-bold text-sm flex items-center gap-2.5 uppercase select-none cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>All Categories</span>
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Sidebar dropdown */}
            {isCategoryMenuOpen && (
              <div className="absolute top-full left-0 w-64 bg-white border border-gray-100 shadow-2xl py-2 flex flex-col text-gray-800 z-50">
                {categories?.map((cat) => (
                  <div key={cat.id} className="relative group/sub">
                    <Link
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold hover:bg-amber-50 hover:text-[#c29900] transition-colors"
                      onClick={() => setIsCategoryMenuOpen(false)}
                    >
                      <span className="truncate">{cat.name}</span>
                      {cat.menusubcategories?.length > 0 && (
                        <svg className="w-3 h-3 text-gray-400 group-hover/sub:text-[#c29900]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </Link>

                    {/* Subcategories list */}
                    {cat.menusubcategories?.length > 0 && (
                      <div className="absolute top-0 left-full w-60 bg-white border border-gray-100 shadow-2xl py-2 hidden group-hover/sub:block">
                        {cat.menusubcategories.map((sub) => (
                          <div key={sub.id} className="relative group/child">
                            <Link
                              href={`/subcategory/${sub.slug}`}
                              className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold hover:bg-amber-50 hover:text-[#c29900]"
                              onClick={() => setIsCategoryMenuOpen(false)}
                            >
                              <span className="truncate">{sub.subcategoryName}</span>
                              {sub.menuchildcategories?.length > 0 && (
                                <svg className="w-3 h-3 text-gray-400 group-hover/child:text-[#c29900]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </Link>

                            {/* Child categories list */}
                            {sub.menuchildcategories?.length > 0 && (
                              <div className="absolute top-0 left-full w-56 bg-white border border-gray-100 shadow-2xl py-2 hidden group-hover/child:block">
                                {sub.menuchildcategories.map((child) => (
                                  <Link
                                    key={child.id}
                                    href={`/childcategory/${child.slug}`}
                                    className="block px-4 py-2.5 text-xs font-medium hover:bg-amber-50 hover:text-[#c29900] truncate"
                                    onClick={() => setIsCategoryMenuOpen(false)}
                                  >
                                    {child.childcategoryName}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <nav className="flex items-center h-full gap-1 ml-4 text-xs font-bold uppercase tracking-wider text-black">
            <Link href="/page/about-us" className="px-5 h-full flex items-center hover:bg-[#e6be00] transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="px-5 h-full flex items-center hover:bg-[#e6be00] transition-colors">
              Contact Us
            </Link>
            <Link href="/page/store-location" className="px-5 h-full flex items-center hover:bg-[#e6be00] transition-colors">
              Store Location
            </Link>
            <Link href="/page/dealer-location" className="px-5 h-full flex items-center hover:bg-[#e6be00] transition-colors">
              Dealer Location
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-80 max-w-sm bg-white h-full flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <span className="font-bold text-lg text-black uppercase">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden h-9">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-grow px-3 text-xs outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-[#ffd300] text-black px-3 h-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <nav className="flex flex-col text-sm font-semibold divide-y divide-gray-100">
              <Link href="/" className="px-4 py-3 hover:bg-gray-50 text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/page/about-us" className="px-4 py-3 hover:bg-gray-50 text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                About Us
              </Link>
              <Link href="/contact" className="px-4 py-3 hover:bg-gray-50 text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                Contact Us
              </Link>
              <Link href="/page/store-location" className="px-4 py-3 hover:bg-gray-50 text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                Store Location
              </Link>
              <Link href="/page/dealer-location" className="px-4 py-3 hover:bg-gray-50 text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                Dealer Location
              </Link>
            </nav>

            <div className="mt-auto bg-gray-50 p-4 border-t border-gray-100 text-xs font-semibold flex flex-col gap-3">
              <a href={`tel:${hotline}`} className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4 fill-current text-[#c29900]" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <span>{hotline}</span>
              </a>
              <a href={`${BACKEND_URL}/customer/login`} className="flex items-center gap-2 text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                <svg className="w-4 h-4 fill-none stroke-current text-[#c29900]" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </svg>
                <span>Log In / Sign Up</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Sliding Cart Drawer */}
      <div className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${isCartOpen ? "visible" : "invisible"}`}>
        {/* Backdrop overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsCartOpen(false)}
        />
        
        {/* Drawer container */}
        <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className={`w-screen max-w-md bg-white flex flex-col shadow-2xl transform transition-transform duration-300 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#c29900] fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="font-extrabold text-sm uppercase tracking-wider text-gray-900">
                  Shopping Cart ({cartCount})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-black transition-colors focus:outline-none p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.rowId} className="flex gap-3 items-start border-b border-gray-100 pb-3">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-16 h-16 object-contain bg-gray-50 rounded border border-gray-100 p-1 flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">
                        {item.name}
                      </h4>
                      {(item.product_size || item.product_color) && (
                        <p className="text-[10px] text-gray-400 font-semibold mt-1">
                          {item.product_size && `Size: ${item.product_size}`}
                          {item.product_size && item.product_color && " | "}
                          {item.product_color && `Color: ${item.product_color}`}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-gray-200 rounded-sm">
                          <button
                            onClick={() => updateQty(item.rowId, item.qty - 1)}
                            className="px-2 py-0.5 text-gray-500 hover:bg-gray-100 text-xs font-bold transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-800">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.rowId, item.qty + 1)}
                            className="px-2 py-0.5 text-gray-500 hover:bg-gray-100 text-xs font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs font-extrabold text-[#c29900]">
                          ৳ {(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.rowId)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-12">
                  <svg className="w-16 h-16 text-gray-200 mb-4 fill-none stroke-current" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-sm font-bold text-gray-500 mb-1">Your cart is empty</p>
                  <p className="text-xs">Add products to your cart to see them here.</p>
                </div>
              )}
            </div>

            {/* Footer summary and checkout buttons */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subtotal</span>
                  <span className="text-base font-black text-[#c29900]">
                    ৳ {cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-[#ffd300] text-black text-center py-2.5 rounded text-xs font-extrabold uppercase tracking-widest hover:bg-[#e6be00] transition-colors shadow-sm"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-white border border-gray-200 text-gray-700 text-center py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
