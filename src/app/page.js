import React from "react";
import Link from "next/link";
import { API_BASE, getImageUrl } from "../utils/api";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import ProductSlider from "../components/ProductSlider";
import ColumnProductRow from "../components/ColumnProductRow";

// Server side data fetching function
async function getStorefrontData() {
  const fetchAPI = async (endpoint, revalidate = 60) => {
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        next: { revalidate },
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
    fetchAPI("slider", 300),        // sliders rarely change
    fetchAPI("category-menu", 300), // categories are stable
    fetchAPI("hotdeal-product", 60), // deals update frequently
    fetchAPI("homepage-product", 60), // products change often
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
        
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row gap-4 items-stretch lg:-mt-4">
          {/* Categories Sidebar Navigation - Hidden on Mobile */}
          <div className="w-full lg:w-[270px] flex-shrink-0 hidden lg:block bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
            <div className="flex flex-col divide-y divide-gray-100 text-xs">
              {categories?.slice(0, 10).map((cat, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === Math.min(categories.length, 10) - 1;
                return (
                  <div 
                    key={cat.id} 
                    className={`relative group/side font-semibold text-gray-700 hover:text-black ${isFirst ? 'rounded-t-lg' : ''} ${isLast ? 'rounded-b-lg' : ''}`}
                  >
                    <Link
                      href={`/category/${cat.slug}`}
                      className={`flex justify-between items-center py-3.5 px-4 hover:bg-[#ffd300] transition-colors ${isFirst ? 'rounded-t-lg' : ''} ${isLast ? 'rounded-b-lg' : ''}`}
                    >
                      <span>{cat.name}</span>
                      {cat.menusubcategories?.length > 0 && (
                        <svg className="w-3 h-3 text-gray-400 group-hover/side:text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
                            className="flex justify-between items-center py-2.5 px-2 text-xs hover:bg-[#ffd300] rounded hover:text-black transition-colors"
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
                                  className="block py-2 px-4 text-xs hover:bg-[#ffd300] rounded hover:text-black transition-colors"
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
                );
              })}
            </div>
          </div>

          {/* Hero Slide Panel */}
          <div className="flex-grow w-full lg:w-auto">
            <HeroSlider slides={slides} />
          </div>
        </section>

        {/* Category Icons Grid Strip */}
        {categories && categories.length > 0 && (() => {
          const displayCategories = [...categories.slice(0, 8)];
          while (displayCategories.length < 8) {
            displayCategories.push({
              id: `empty-placeholder-${displayCategories.length}`,
              isEmpty: true
            });
          }
          return (
            <section className="bg-white border border-gray-200 md:rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-4 md:flex md:overflow-x-auto md:scrollbar-none">
                {displayCategories.map((cat) => {
                  if (cat.isEmpty) {
                    return (
                      <div
                        key={cat.id}
                        className="border-r border-b border-gray-200 md:hidden"
                      />
                    );
                  }
                  return (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex flex-col items-center justify-center p-3 md:p-4 text-center hover:bg-amber-50/30 transition-all duration-200 group w-full border-r border-b border-gray-200 md:border-r md:border-b-0 md:border-gray-200 md:min-w-[125px] md:flex-1 last:border-r-0"
                    >
                      <img
                        src={getImageUrl(cat.image)}
                        alt={cat.name}
                        className="h-8 w-8 md:h-10 md:w-10 object-contain mb-2 md:mb-3 group-hover:scale-105 transition-transform duration-200"
                      />
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#c29900] leading-tight group-hover:text-[#b08b00]">
                        {cat.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })()}

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
              <section key={cat.id} className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden flex flex-col">
                {/* Section Header */}
                <div className="flex justify-between items-center px-4 py-3 bg-white">
                  <h2 className="text-sm sm:text-base font-bold text-gray-950 tracking-wide">
                    {cat.name}
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer" title="Previous">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer" title="Next">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Brand Color Horizontal Separator Line */}
                <div className="h-[3px] bg-[#ffd300] w-full" />

                {/* Section Content Layout: Left Products Grid, Right Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-5 items-stretch">
                  {/* Products Grid (4/5 width on desktop, full width on mobile) */}
                  <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0 bg-white">
                    {cat.products.slice(0, 8).map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>

                  {/* Category Banner Column (1/5 width on desktop, hidden on mobile) */}
                  <div className="hidden lg:flex lg:col-span-1 relative bg-white flex-col justify-between overflow-hidden border-l border-gray-100 min-h-[350px]">
                    <Link href={`/category/${cat.slug}`} className="relative block w-full h-full flex-grow group overflow-hidden">
                      <img
                        src={getImageUrl(cat.home_banner || cat.image)}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                    </Link>

                    {/* Brand-colored Banner Bar at Bottom */}
                    <div className="h-[12px] bg-[#ffd300] w-full" />
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
