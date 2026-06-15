import React from "react";
import { notFound } from "next/navigation";
import { API_BASE } from "../../../utils/api";
import ProductListingWrapper from "../../../components/ProductListingWrapper";

async function getSubcategoryData(slug, searchParams) {
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
    const res = await fetch(`${API_BASE}/subcategory-details/${slug}?${query.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.status === "success" ? json.data : null;
  } catch (error) {
    console.error("Error fetching subcategory details:", error);
    return null;
  }
}

export default async function SubcategoryPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { slug } = resolvedParams;

  const data = await getSubcategoryData(slug, resolvedSearchParams);

  if (!data) {
    notFound();
  }

  const { subcategory, childcategories, products, min_price, max_price } = data;

  return (
    <ProductListingWrapper
      title={subcategory.subcategoryName}
      type="Subcategory"
      filterItems={childcategories}
      filterKey="childcategory"
      products={products}
      minPriceBound={min_price}
      maxPriceBound={max_price}
    />
  );
}
