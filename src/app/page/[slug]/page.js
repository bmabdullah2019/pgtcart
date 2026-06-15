import React from "react";
import { API_BASE } from "../../../utils/api";
import { notFound } from "next/navigation";

async function getPageData(slug) {
  try {
    const res = await fetch(`${API_BASE}/page/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.status === "success" ? json.data : null;
  } catch (err) {
    console.error("Error fetching page data:", err);
    return null;
  }
}

export default async function Page({ params }) {
  const { slug } = await params;
  const page = await getPageData(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-xs p-6 md:p-10 max-w-4xl mx-auto my-6 w-full font-sans">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 border-b border-gray-100 pb-4 mb-6 uppercase tracking-wide flex items-center gap-2">
        <span className="w-2.5 h-6 bg-[#ffd300] rounded-xs inline-block"></span>
        <span>{page.title || page.name}</span>
      </h1>
      <div 
        className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: page.description }}
      />
    </div>
  );
}
