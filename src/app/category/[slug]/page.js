import React from "react";
import { notFound } from "next/navigation";
import { API_BASE } from "../../../utils/api";
import ProductListingWrapper from "../../../components/ProductListingWrapper";

async function getCategoryData(slug, searchParams) {
  const query = new URLSearchParams();
  
  // Forward searchParams to backend API
  Object.entries(searchParams).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      val.forEach((v) => query.append(`${key}[]`, v));
    } else if (val) {
      query.set(key, val);
    }
  });

  try {
    const res = await fetch(`${API_BASE}/category-details/${slug}?${query.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.status === "success" ? json.data : null;
  } catch (error) {
    console.error("Error fetching category details:", error);
    return null;
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { slug } = resolvedParams;

  const data = await getCategoryData(slug, resolvedSearchParams);

  if (!data) {
    notFound();
  }

  const { category, subcategories, products, min_price, max_price } = data;

  return (
    <ProductListingWrapper
      title={category.name}
      type="Category"
      filterItems={subcategories}
      filterKey="subcategory"
      products={products}
      minPriceBound={min_price}
      maxPriceBound={max_price}
    />
  );
}
