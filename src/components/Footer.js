"use client";

import React from "react";
import Link from "next/link";
import { getImageUrl, BACKEND_URL } from "../utils/api";

export default function Footer({ config, contact, leftMenu, rightMenu, socialLinks }) {
  const siteName = config?.name || "Aminsuk";
  const footerLogo = config?.white_logo || config?.dark_logo || null;
  const address = contact?.address || "";
  const email = contact?.email || "";
  const whatsapp = contact?.whatsapp || "";
  const hotline = contact?.hotline || "096 1144 1144";
  const desc = config?.description || config?.meta_description || "Stay connected with us for quality products, updates, and reliable support.";

  return (
    <footer className="bg-[#1a1a1a] text-white pt-10 pb-6 font-sans">
      {/* Newsletter Strip */}
      <div className="bg-[#ffd300] text-black py-6 px-4 -mt-10 mb-10 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <p className="font-semibold text-sm sm:text-base">
            Stay updated! Subscribe to our mailing list for news, updates, and exclusive offers.
          </p>
          <form className="flex items-center bg-white rounded-md overflow-hidden w-full max-w-md h-10 px-3">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow bg-transparent text-gray-800 outline-none text-xs sm:text-sm"
              required
            />
            <button
              type="submit"
              className="bg-black text-[#ffd300] px-4 py-1.5 rounded text-xs sm:text-sm font-bold hover:bg-gray-900 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {/* Column 1: About */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 select-none">
            <img
              src={footerLogo ? getImageUrl(footerLogo) : "/logo.png"}
              alt={siteName}
              className="h-12 md:h-16 object-contain"
            />
          </Link>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-sm">
            {desc}
          </p>
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#ffd300] hover:text-black flex items-center justify-center text-white transition-colors"
                >
                  {/* Clean fallback text indicator if font-awesome is missing */}
                  <span className="text-[10px] uppercase font-bold">{social.name || "S"}</span>
                </a>
              ))}
            </div>
          )}
          <div className="mt-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2">Download Our App</h4>
            <img
              src={getImageUrl("public/frontEnd/images/app-download.png")}
              alt="Download app"
              className="max-h-8 object-contain"
            />
          </div>
        </div>

        {/* Column 2: About Pages */}
        <div>
          <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider border-b-2 border-[#ffd300] pb-2 mb-4">
            About
          </h3>
          <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-gray-300">
            <li>
              <Link href="/page/about-us" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            {leftMenu?.map((page) => (
              <li key={page.id}>
                <Link href={`/page/${page.slug}`} className="hover:text-white transition-colors">
                  {page.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: My Account */}
        <div>
          <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider border-b-2 border-[#ffd300] pb-2 mb-4">
            My Account
          </h3>
          <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-gray-300">
            <li>
              <a href={`${BACKEND_URL}/customer/login`} className="hover:text-white transition-colors">
                Your Account
              </a>
            </li>
            <li>
              <Link href="/order-tracking" className="hover:text-white transition-colors">
                Order Tracking
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-white transition-colors">
                Wishlist
              </Link>
            </li>
            {rightMenu?.map((page) => (
              <li key={page.id}>
                <Link href={`/page/${page.slug}`} className="hover:text-white transition-colors">
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider border-b-2 border-[#ffd300] pb-2 mb-4">
            Contact
          </h3>
          <ul className="flex flex-col gap-3 text-xs sm:text-sm text-gray-300">
            {address && (
              <li className="flex gap-2 items-start">
                <svg className="w-4 h-4 text-[#c29900] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{address}</span>
              </li>
            )}
            {hotline && (
              <li className="flex gap-2 items-center">
                <svg className="w-4 h-4 text-[#c29900] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${hotline}`} className="hover:text-white transition-colors">
                  Hotline: {hotline}
                </a>
              </li>
            )}
            {email && (
              <li className="flex gap-2 items-center">
                <svg className="w-4 h-4 text-[#c29900] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
            )}
            {whatsapp && (
              <li className="flex gap-2 items-center">
                <svg className="w-4 h-4 text-[#c29900] flex-shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.511 0 9.997-4.486 10-10 0-2.673-1.04-5.185-2.929-7.076C16.455 1.636 13.945.596 11.272.596 5.761.596 1.274 5.082 1.271 10.594c0 1.54.407 3.04 1.179 4.347l-.993 3.63 3.73-.978c1.258.68 2.517 1.059 2.87 1.061zM17.47 14.397c-.3-.149-1.777-.878-2.046-.977-.27-.1-.466-.149-.662.15-.197.297-.76.759-.93.948-.17.19-.34.21-.64.06-2.584-1.288-4.227-4.78-4.524-5.292-.06-.1-.13-.17-.23-.23-.1-.06-.2-.1-.3-.15-.3-.15-1.776-.879-2.046-.978-.27-.1-.466-.15-.662.15-.196.297-.759.759-.929.948-.17.19-.34.21-.64.06-1.5-.75-2.62-1.39-3.73-3.32-.24-.43.24-.4.68-.88.19-.2.3-.3.45-.45.15-.15.22-.25.3-.4.08-.15.04-.28-.02-.43-.06-.15-.662-1.6-.906-2.18-.24-.58-.5-1.05-.662-1.05h-.66c-.23 0-.6.08-.91.43-.31.35-1.2 1.17-1.2 2.86s1.24 3.32 1.41 3.56c.18.23 2.43 3.71 5.89 5.2 2.87 1.24 3.46 1 4.67.88 1.21-.12 2.72-.82 3.1-1.61.38-.79.38-1.47.26-1.61-.12-.13-.42-.23-.72-.38z" />
                </svg>
                <a href={`https://api.whatsapp.com/send?phone=${whatsapp}`} className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  WhatsApp Chat
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Footer Bottom Payment strip */}
      <div className="border-t border-white/10 pt-6 px-4 md:px-8 text-center flex flex-col items-center gap-4">
        <div className="w-full flex justify-center px-2">
          <img
            src="/payment-gateways.jpg"
            alt="Payment methods"
            className="w-full max-w-5xl h-auto object-contain bg-white rounded-md p-2"
          />
        </div>
        <p className="text-gray-400 text-xs tracking-wider">
          &copy; {new Date().getFullYear()} {config?.copyright || `Copyright By ${siteName}`}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
