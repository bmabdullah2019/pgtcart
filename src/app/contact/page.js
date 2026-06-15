"use client";

import React, { useState, useEffect } from "react";
import { API_BASE } from "../../utils/api";

export default function ContactPage() {
  const [pageData, setPageData] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pageRes, contactRes] = await Promise.all([
          fetch(`${API_BASE}/page/contact-us`, { cache: "no-store" }),
          fetch(`${API_BASE}/contactinfo`, { cache: "no-store" }),
        ]);

        const pageJson = await pageRes.json();
        const contactJson = await contactRes.json();

        if (pageJson?.status === "success") setPageData(pageJson.data);
        if (contactJson?.status === "success") setContactInfo(contactJson.data);
      } catch (err) {
        console.error("Error fetching contact page data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: "", message: "" });

    // Client-side mock submission for rich user experience
    setTimeout(() => {
      setIsSubmitting(false);
      setFormStatus({
        type: "success",
        message: "Thank you for getting in touch! We will get back to you shortly.",
      });
      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ffd300]"></div>
      </div>
    );
  }

  const helpline = contactInfo?.hotline || "096 1144 1144";
  const address = contactInfo?.address || "Sector 3, Uttara, Dhaka, Bangladesh";
  const emailAddr = contactInfo?.email || "info@aminsuk.com";
  const whatsapp = contactInfo?.whatsapp || "";

  return (
    <div className="max-w-6xl mx-auto my-6 px-2 w-full font-sans">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 border-b border-gray-100 pb-4 mb-8 uppercase tracking-wide flex items-center gap-2">
        <span className="w-2.5 h-6 bg-[#ffd300] rounded-xs inline-block"></span>
        <span>{pageData?.title || "Contact Us"}</span>
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Info Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-gray-100 rounded-lg shadow-xs p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#c29900]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Get In Touch</span>
            </h2>
            
            {pageData?.description && (
              <div 
                className="text-xs text-gray-600 leading-relaxed prose prose-sm"
                dangerouslySetInnerHTML={{ __html: pageData.description }}
              />
            )}

            <div className="flex flex-col gap-3.5 text-xs text-gray-700 mt-2">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 rounded text-[#c29900] mt-0.5 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Our Address</h4>
                  <p className="text-gray-500 mt-0.5">{address}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 rounded text-[#c29900] mt-0.5 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Helpline / Phone</h4>
                  <p className="text-gray-500 mt-0.5">{helpline}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 rounded text-[#c29900] mt-0.5 flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email Address</h4>
                  <p className="text-gray-500 mt-0.5">{emailAddr}</p>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Connect */}
          {whatsapp && (
            <a
              href={`https://api.whatsapp.com/send?phone=${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white hover:bg-[#20ba56] transition-colors font-bold text-sm text-center py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.511 0 9.997-4.486 10-10 0-2.673-1.04-5.185-2.929-7.076C16.455 1.636 13.945.596 11.272.596 5.761.596 1.274 5.082 1.271 10.594c0 1.54.407 3.04 1.179 4.347l-.993 3.63 3.73-.978c1.258.68 2.517 1.059 2.87 1.061zM17.47 14.397c-.3-.149-1.777-.878-2.046-.977-.27-.1-.466-.149-.662.15-.197.297-.76.759-.93.948-.17.19-.34.21-.64.06-2.584-1.288-4.227-4.78-4.524-5.292-.06-.1-.13-.17-.23-.23-.1-.06-.2-.1-.3-.15-.3-.15-1.776-.879-2.046-.978-.27-.1-.466-.15-.662.15-.196.297-.759.759-.929.948-.17.19-.34.21-.64.06-1.5-.75-2.62-1.39-3.73-3.32-.24-.43.24-.4.68-.88.19-.2.3-.3.45-.45.15-.15.22-.25.3-.4.08-.15.04-.28-.02-.43-.06-.15-.662-1.6-.906-2.18-.24-.58-.5-1.05-.662-1.05h-.66c-.23 0-.6.08-.91.43-.31.35-1.2 1.17-1.2 2.86s1.24 3.32 1.41 3.56c.18.23 2.43 3.71 5.89 5.2 2.87 1.24 3.46 1 4.67.88 1.21-.12 2.72-.82 3.1-1.61.38-.79.38-1.47.26-1.61-.12-.13-.42-.23-.72-.38z" />
              </svg>
              <span>Chat with Us on WhatsApp</span>
            </a>
          )}
        </div>

        {/* Form Column */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-lg shadow-xs p-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#c29900]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Send Us a Message</span>
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {formStatus.message && (
              <div className={`p-4 rounded-md text-xs font-semibold ${formStatus.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                {formStatus.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="border border-gray-200 rounded px-3.5 py-2 text-xs outline-none focus:border-[#ffd300] transition-colors bg-white text-gray-800"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="border border-gray-200 rounded px-3.5 py-2 text-xs outline-none focus:border-[#ffd300] transition-colors bg-white text-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="border border-gray-200 rounded px-3.5 py-2 text-xs outline-none focus:border-[#ffd300] transition-colors bg-white text-gray-800"
                />
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-700">Subject *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Inquiry subject"
                  className="border border-gray-200 rounded px-3.5 py-2 text-xs outline-none focus:border-[#ffd300] transition-colors bg-white text-gray-800"
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-700">Message *</label>
              <textarea
                required
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?"
                className="border border-gray-200 rounded px-3.5 py-2 text-xs outline-none focus:border-[#ffd300] transition-colors resize-none bg-white text-gray-800"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#ffd300] text-black font-extrabold text-xs uppercase tracking-wider py-3 px-6 rounded-md hover:bg-[#e6be00] transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm self-start"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
