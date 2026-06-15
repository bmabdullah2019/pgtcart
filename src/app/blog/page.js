"use client";

import React, { useState, useEffect } from "react";
import { API_BASE } from "../../utils/api";

const MOCK_POSTS = [
  {
    id: 1,
    title: "5 Tips for Smart Online Shopping in Bangladesh",
    excerpt: "Learn how to compare prices, check product authenticity, and ensure secure payments while shopping online.",
    content: "<p>Online shopping has grown exponentially in Bangladesh, offering convenience and access to a wide range of goods. However, to get the best value and avoid common pitfalls, smart shoppers follow a few key guidelines:</p><h4 className='text-sm font-bold mt-3 mb-1'>1. Verify the Seller's Reputation</h4><p>Always check customer reviews, seller ratings, and how long they have been in business. Trusted marketplaces like aminsuk.com offer verified products and active customer support.</p><h4 className='text-sm font-bold mt-3 mb-1'>2. Compare Prices & Shipping</h4><p>Make sure to calculate the total price including delivery fees. Look out for flash sales and promotional discount coupons to maximize savings.</p><h4 className='text-sm font-bold mt-3 mb-1'>3. Secure Payment Options</h4><p>Prefer Cash on Delivery (COD) if you are shopping from a new platform, or use trusted, secure digital payment options like bKash and shurjopay for hassle-free refunds.</p>",
    category: "Guides",
    date: "June 15, 2026",
    author: "Fahim Ahmed",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    title: "Why Choose Authentic Japanese Products for E-Commerce",
    excerpt: "Japanese engineering and craftsmanship are globally renowned. Here is why importing authentic goods builds trust.",
    content: "<p>Quality is the cornerstone of customer retention in e-commerce. Japanese brand items, particularly in electronics, home appliances, and lifestyle goods, are highly valued in Bangladesh due to their durability, precision, and state-of-the-art features.</p><p>By offering genuine Japanese products, distributors build long-term relationships with dealers and end consumers. Authentic inventory reduces return rates, maximizes positive reviews, and establishes your brand as a quality leader in the market.</p>",
    category: "Business",
    date: "May 28, 2026",
    author: "M. B. Abdullah",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    title: "E-Commerce Logistics: Optimizing Delivery & Returns",
    excerpt: "How reliable shipping systems and automated courier integrations like Steadfast transform client satisfaction.",
    content: "<p>A smooth delivery experience is crucial for e-commerce growth. Integrating automation directly with top-tier courier services (like Steadfast Courier API) reduces dispatch delays and minimizes transit errors.</p><p>Moreover, establishing a transparent, customer-friendly return policy increases buyers' confidence to shop online, knowing they can easily exchange or return products if needed.</p>",
    category: "Logistics",
    date: "May 10, 2026",
    author: "Logistics Team",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
  },
];

export default function BlogPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`${API_BASE}/page/blog`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json?.status === "success") {
            setPageData(json.data);
          }
        }
      } catch (err) {
        console.error("Error fetching blog page:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ffd300]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-6 px-2 w-full font-sans">
      {/* Title / Hero */}
      <div className="border-b border-gray-100 pb-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <span className="w-2.5 h-6 bg-[#ffd300] rounded-xs inline-block"></span>
          <span>{pageData?.title || "Blog & Articles"}</span>
        </h1>
        {pageData?.description && (
          <div 
            className="text-xs text-gray-500 mt-2 leading-relaxed max-w-3xl prose prose-sm"
            dangerouslySetInnerHTML={{ __html: pageData.description }}
          />
        )}
      </div>

      {selectedPost ? (
        /* Single Post Detail View */
        <article className="bg-white border border-gray-100 rounded-xl p-6 md:p-10 shadow-xs max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black mb-6 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Articles</span>
          </button>

          <span className="bg-amber-50 text-[#c29900] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
            {selectedPost.category}
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mt-3 mb-4 leading-tight">
            {selectedPost.title}
          </h2>

          <div className="flex items-center gap-4 text-gray-400 text-[11px] font-semibold mb-6 border-b border-gray-50 pb-4">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {selectedPost.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {selectedPost.date}
            </span>
            <span>•</span>
            <span>{selectedPost.readTime}</span>
          </div>

          <img
            src={selectedPost.image}
            alt={selectedPost.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-8 shadow-xs"
          />

          <div 
            className="text-xs text-gray-600 leading-relaxed space-y-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
          />
        </article>
      ) : (
        /* Blog Post List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 flex flex-col flex-grow gap-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                  <span className="bg-amber-50 text-[#c29900] uppercase tracking-wider px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 hover:text-[#c29900] transition-colors leading-snug cursor-pointer line-clamp-2" onClick={() => setSelectedPost(post)}>
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center text-[10px] font-semibold text-gray-400">
                  <span>{post.readTime}</span>
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="text-xs font-bold text-gray-800 hover:text-[#c29900] flex items-center gap-0.5 cursor-pointer focus:outline-none"
                  >
                    <span>Read More</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
