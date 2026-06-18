import React from "react";
import Link from "next/link";
import { API_BASE, getImageUrl } from "../utils/api";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import ProductSlider from "../components/ProductSlider";
import ColumnProductRow from "../components/ColumnProductRow";

// Server side data fetching function
async function getStorefrontData() {
  const fetchAPI = async (endpoint) => {
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        cache: "no-store", // dynamic rendering, no caching for live ERP sync
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      return json?.status === "success" ? json.data : null;
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      return null;
    }
  };

  const [
    slides,
    categories,
    hotdeals,
    categoryProducts,
  ] = await Promise.all([
    fetchAPI("slider"),
    fetchAPI("category-menu"),
    fetchAPI("hotdeal-product"),
    fetchAPI("homepage-product"),
  ]);

  return {
    slides,
    categories,
    hotdeals,
    categoryProducts,
  };
}

export default async function Home() {
  const {
    slides,
    categories,
    hotdeals,
    categoryProducts,
  } = await getStorefrontData();

  // Divide hot deals / homepage products for 4-columns
  const bestSellers = hotdeals?.slice(0, 5) || [];
  const trends = hotdeals?.slice(5, 10) || [];
  
  // Flatten category products to display under columns
  const allFlattenedProducts = categoryProducts
    ? categoryProducts.flatMap((cat) => cat.products || [])
    : [];

  const mostPopular = allFlattenedProducts.slice(0, 5);
  const hotProducts = allFlattenedProducts.slice(5, 10);

  // Client brands list mock or fetch - let's extract brands if present or mock for high-end look
  const clientBrands = [
    { name: "Sakura", image: "public/frontEnd/images/brand1.png" },
    { name: "Honda", image: "public/frontEnd/images/brand2.png" },
    { name: "Yamaha", image: "public/frontEnd/images/brand3.png" },
    { name: "Hyundai", image: "public/frontEnd/images/brand4.png" },
    { name: "Suzuki", image: "public/frontEnd/images/brand5.png" },
    { name: "Kipor", image: "public/frontEnd/images/brand6.png" },
  ];

  return (
    <>
        
        {/* Hero Section Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Categories Sidebar Navigation - Hidden on Mobile */}
          <div className="bg-white border border-gray-100 rounded-lg shadow-xs p-4 hidden lg:block divide-y divide-gray-50">
            <h3 className="text-xs uppercase font-extrabold text-gray-900 tracking-wider mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#ffd300]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Categories</span>
            </h3>
            <div className="flex flex-col pt-2 divide-y divide-gray-100 text-xs">
              {categories?.slice(0, 11).map((cat) => (
                <div key={cat.id} className="relative group/side font-semibold text-gray-700 hover:text-[#c29900] py-0.5">
                  <Link
                    href={`/category/${cat.slug}`}
                    className="flex justify-between items-center py-2 px-1 hover:bg-amber-50 rounded transition-colors"
                  >
                    <span>{cat.name}</span>
                    {cat.menusubcategories?.length > 0 && (
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </Link>

                  {/* Subcategories sidebar floating menu */}
                  {cat.menusubcategories?.length > 0 && (
                    <div className="absolute top-0 left-full ml-1 w-56 bg-white border border-gray-100 shadow-xl rounded-lg py-2 text-gray-800 hidden group-hover/side:block z-20">
                      {cat.menusubcategories.map((sub) => (
                        <div key={sub.id} className="relative group/side-child px-2">
                          <Link
                            href={`/subcategory/${sub.slug}`}
                            className="flex justify-between items-center py-2 px-2 text-xs hover:bg-amber-50 rounded hover:text-[#c29900]"
                          >
                            <span>{sub.subcategoryName}</span>
                            {sub.menuchildcategories?.length > 0 && (
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </Link>

                          {/* Child categories sidebar floating menu */}
                          {sub.menuchildcategories?.length > 0 && (
                            <div className="absolute top-0 left-full ml-1 w-52 bg-white border border-gray-100 shadow-xl rounded-lg py-2 text-gray-800 hidden group-hover/side-child:block z-30">
                              {sub.menuchildcategories.map((child) => (
                                <Link
                                  key={child.id}
                                  href={`/childcategory/${child.slug}`}
                                  className="block py-2 px-4 text-xs hover:bg-amber-50 rounded hover:text-[#c29900]"
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
          </div>

          {/* Hero Slide Panel */}
          <div className="lg:col-span-3">
            <HeroSlider slides={slides} />
          </div>
        </section>

        {/* Category Icons Grid Strip */}
        {categories && categories.length > 0 && (
          <section className="bg-white border border-gray-100 rounded-lg p-4 shadow-xs">
            <div className="flex gap-4 overflow-x-auto scrollbar-none justify-between">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="flex flex-col items-center justify-center p-3 border border-gray-50 rounded-lg w-28 flex-shrink-0 hover:bg-amber-50 hover:text-[#c29900] transition-all duration-200 group text-center"
                >
                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    className="h-10 w-10 object-contain mb-2 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-800 group-hover:text-[#c29900]">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Hot Deal / Best Seller Slider */}
        {hotdeals && hotdeals.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex justify-between items-end border-b-2 border-gray-100 pb-2">
              <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-gray-900 flex items-center gap-2">
                <span className="w-2.5 h-6 bg-[#ffd300] rounded-xs inline-block"></span>
                <span>Hot Deals</span>
              </h2>
              <Link
                href="/hot-deals"
                className="text-xs font-bold text-[#c29900] hover:underline uppercase tracking-wider"
              >
                View More
              </Link>
            </div>
            <ProductSlider products={hotdeals} />
          </section>
        )}

        {/* Category Specific Products */}
        {categoryProducts?.map(
          (cat) =>
            cat.products?.length > 0 && (
              <section key={cat.id} className="flex flex-col gap-4">
                {/* Section Header */}
                <div className="flex justify-between items-end border-b-2 border-gray-100 pb-2">
                  <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-6 bg-[#ffd300] rounded-xs inline-block"></span>
                    <span>{cat.name}</span>
                  </h2>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-xs font-bold text-gray-800 hover:text-[#c29900] hover:underline uppercase tracking-wider"
                  >
                    View All
                  </Link>
                </div>

                {/* Section Layout: Products Left, Banner Right */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
                  {/* Products Grid (Takes 4/5 columns on desktop) */}
                  <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {cat.products.slice(0, 8).map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>

                  {/* Category Banner Card (Takes 1/5 columns on desktop, hidden on mobile) */}
                  <div className="hidden lg:flex lg:col-span-1 relative rounded-lg overflow-hidden border border-gray-100 group shadow-xs bg-gray-50 flex-col justify-end min-h-[350px]">
                    <Link href={`/category/${cat.slug}`} className="absolute inset-0 z-0">
                      <img
                        src={getImageUrl(cat.home_banner || cat.image)}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />
                    </Link>

                    {/* Brand-colored Banner Overlay at Bottom */}
                    <div className="relative z-10 w-full p-4 mt-auto">
                      <div className="bg-black/90 backdrop-blur-xs rounded-xl p-3 flex flex-col items-center justify-center border border-white/10 shadow-lg text-center">
                        <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest mb-2">
                          {cat.name}
                        </span>
                        <Link
                          href={`/category/${cat.slug}`}
                          className="w-full py-2 bg-[#ffd300] hover:bg-white text-black font-extrabold text-[11px] uppercase tracking-widest rounded-full text-center transition-all duration-300 transform group-hover:scale-[1.03] shadow-md flex items-center justify-center gap-1"
                        >
                          <span>Shop Now</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )
        )}

        {/* Dynamic 4-Column Widgets Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
          {/* Best Seller column */}
          <div>
            <h3 className="text-sm font-extrabold uppercase text-gray-950 border-b-2 border-[#ffd300] pb-2 mb-4 tracking-wider">
              Best Seller
            </h3>
            <div className="flex flex-col gap-3">
              {bestSellers.map((prod) => (
                <ColumnProductRow key={prod.id} product={prod} />
              ))}
            </div>
          </div>

          {/* Trends column */}
          <div>
            <h3 className="text-sm font-extrabold uppercase text-gray-950 border-b-2 border-[#ffd300] pb-2 mb-4 tracking-wider">
              Trends
            </h3>
            <div className="flex flex-col gap-3">
              {trends.map((prod) => (
                <ColumnProductRow key={prod.id} product={prod} />
              ))}
            </div>
          </div>

          {/* Most Popular column */}
          <div>
            <h3 className="text-sm font-extrabold uppercase text-gray-950 border-b-2 border-[#ffd300] pb-2 mb-4 tracking-wider">
              Most Popular
            </h3>
            <div className="flex flex-col gap-3">
              {mostPopular.map((prod) => (
                <ColumnProductRow key={prod.id} product={prod} />
              ))}
            </div>
          </div>

          {/* Hot Products column */}
          <div>
            <h3 className="text-sm font-extrabold uppercase text-gray-950 border-b-2 border-[#ffd300] pb-2 mb-4 tracking-wider">
              Hot Products
            </h3>
            <div className="flex flex-col gap-3">
              {hotProducts.map((prod) => (
                <ColumnProductRow key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>

        {/* Our Clients / Brands Banner Strip */}
        <section className="border-t border-b border-gray-100 py-6 my-4 bg-white rounded-lg px-4 shadow-xs">
          <h3 className="text-xs uppercase font-extrabold text-gray-400 tracking-widest mb-4">
            Our Brands / Clients
          </h3>
          <div className="flex flex-wrap items-center justify-around gap-6">
            {clientBrands.map((brand, idx) => (
              <div
                key={idx}
                className="h-10 w-24 flex items-center justify-center border border-gray-50 bg-gray-50/50 rounded-md p-1.5 grayscale hover:grayscale-0 transition-all cursor-pointer"
              >
                {/* Fallback label if image is not ready */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{brand.name}</span>
              </div>
            ))}
          </div>
        </section>

    </>
  );
}
