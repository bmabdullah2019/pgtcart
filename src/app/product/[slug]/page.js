import React from "react";
import { notFound } from "next/navigation";
import { API_BASE } from "../../../utils/api";
import ProductDetailsWrapper from "../../../components/ProductDetailsWrapper";

async function getProductData(slug) {
  try {
    const res = await fetch(`${API_BASE}/product/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.status === "success" ? json.data : null;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const data = await getProductData(slug);

  if (!data) {
    notFound();
  }

  const {
    product,
    related_products,
    variant_payload,
    gallery,
    shipping_charges,
  } = data;

  return (
    <ProductDetailsWrapper
      product={product}
      relatedProducts={related_products}
      variantPayload={variant_payload}
      displayGallery={gallery}
      shippingCharges={shipping_charges}
    />
  );
}
