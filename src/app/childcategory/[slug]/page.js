import React from "react";
import { notFound } from "next/navigation";
import { API_BASE } from "../../../utils/api";
import ProductListingWrapper from "../../../components/ProductListingWrapper";

async function getChildcategoryData(slug, searchParams) {
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
    const res = await fetch(`${API_BASE}/childcategory-details/${slug}?${query.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.status === "success" ? json.data : null;
  } catch (error) {
    console.error("Error fetching childcategory details:", error);
    return null;
  }
}

export default async function ChildcategoryPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { slug } = resolvedParams;

  const data = await getChildcategoryData(slug, resolvedSearchParams);

  if (!data) {
    notFound();
  }

  const { childcategory, childcategories, products, min_price, max_price } = data;

  return (
    <ProductListingWrapper
      title={childcategory.childcategoryName}
      type="Child Category"
      filterItems={childcategories}
      filterKey="childcategory"
      products={products}
      minPriceBound={min_price}
      maxPriceBound={max_price}
    />
  );
}
