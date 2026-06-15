"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { API_BASE, getImageUrl } from "../../utils/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartSubtotal, cartCount, clearCart, isLoaded } = useCart();

  // Load state for gateway config & shipping charges
  const [shippingCharges, setShippingCharges] = useState([]);
  const [gateways, setGateways] = useState({ bkash: false, shurjopay: false });
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Interaction States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Fetch Checkout Configuration details from API
  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`${API_BASE}/checkout-details`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load checkout details");
        const json = await res.json();
        if (json.status === "success") {
          setShippingCharges(json.data.shipping_charges || []);
          setGateways(json.data.gateways || { bkash: false, shurjopay: false });
          // Automatically select first area if available
          if (json.data.shipping_charges?.length > 0) {
            setSelectedAreaId(json.data.shipping_charges[0].id.toString());
          }
        }
      } catch (err) {
        console.error("Checkout details load error:", err);
      } finally {
        setIsLoadingDetails(false);
      }
    }
    fetchDetails();
  }, []);

  // Compute selected shipping charge
  const selectedArea = shippingCharges.find((sc) => sc.id.toString() === selectedAreaId);
  const shippingCost = selectedArea ? parseFloat(selectedArea.amount) : 0;
  const orderTotal = cartSubtotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (cartItems.length === 0) {
      setSubmitError("Your shopping cart is empty.");
      return;
    }

    if (!name.trim()) return setSubmitError("Full Name is required.");
    if (!phone.trim()) return setSubmitError("Phone number is required.");
    if (!address.trim()) return setSubmitError("Delivery Address is required.");
    if (!selectedAreaId) return setSubmitError("Please select a delivery area.");

    setIsSubmitting(true);

    // Format item payload matching PHP backend expectations
    const payloadItems = cartItems.map((item) => ({
      id: item.id,
      qty: item.qty,
      rowId: item.rowId,
      variant_id: item.variant_id,
      purchase_price: item.old_price || item.price,
      product_size: item.product_size,
      product_color: item.product_color,
    }));

    const orderPayload = {
      name,
      phone,
      address,
      area: parseInt(selectedAreaId),
      payment_method: paymentMethod,
      note,
      items: payloadItems,
    };

    try {
      const res = await fetch(`${API_BASE}/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const json = await res.json();

      if (res.status === 422) {
        // Stock error or validation error
        throw new Error(json.message || "Invalid order inputs or insufficient stock.");
      } else if (!res.ok) {
        throw new Error(json.message || "Something went wrong. Order placement failed.");
      }

      if (json.status === "success") {
        clearCart();
        
        // Handle Payment Gateways Redirection
        if (json.data.redirect_url) {
          window.location.href = json.data.redirect_url;
        } else {
          setOrderSuccess(json.data);
        }
      } else {
        throw new Error(json.message || "Failed to place order.");
      }
    } catch (err) {
      setSubmitError(err.message || "Internal server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guard: Cart Loaded Check
  if (!isLoaded || isLoadingDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <svg className="animate-spin h-8 w-8 text-[#ffd300] mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest">Loading checkout details...</span>
      </div>
    );
  }

  // Success Confirmation Screen
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white border border-gray-100 rounded-lg p-8 shadow-md text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-gray-950 uppercase tracking-wide mb-2">Order Confirmed!</h1>
        <p className="text-sm font-semibold text-gray-600 mb-6">
          Thank you for your purchase. Your invoice ID is{" "}
          <span className="text-black font-extrabold">{orderSuccess.invoice_id}</span>. We will contact you shortly to confirm details.
        </p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="bg-[#ffd300] text-black py-2 px-6 rounded text-xs font-extrabold uppercase tracking-widest hover:bg-[#e6be00] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div>
        <nav className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#c29900]">Home</Link>
          <span>/</span>
          <span className="text-gray-900">Checkout</span>
        </nav>
        <h1 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <span className="w-2.5 h-6 bg-[#ffd300] rounded-xs inline-block"></span>
          <span>Order Checkout</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Input Form (Takes 2 Cols on Large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Shipping Form Card */}
          <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-xs flex flex-col gap-4">
            <h3 className="text-xs uppercase font-extrabold text-gray-900 tracking-wider mb-2 border-b border-gray-50 pb-2">
              1. Shipping Information
            </h3>

            {submitError && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-3 rounded-md">
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-extrabold text-gray-400 block mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold px-3 py-2.5 rounded outline-none focus:border-[#ffd300]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-extrabold text-gray-400 block mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Enter contact phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold px-3 py-2.5 rounded outline-none focus:border-[#ffd300]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-extrabold text-gray-400 block mb-1.5">
                Delivery Area <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={selectedAreaId}
                onChange={(e) => setSelectedAreaId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold px-3 py-2.5 rounded outline-none cursor-pointer focus:border-[#ffd300]"
              >
                <option value="">Select Region/Area</option>
                {shippingCharges.map((charge) => (
                  <option key={charge.id} value={charge.id}>
                    {charge.name} (৳ {parseFloat(charge.amount).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-extrabold text-gray-400 block mb-1.5">
                Detailed Delivery Address <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows="3"
                placeholder="Enter street name, house number, area details"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold px-3 py-2.5 rounded outline-none focus:border-[#ffd300] resize-none"
              ></textarea>
            </div>

            <div>
              <label className="text-[10px] uppercase font-extrabold text-gray-400 block mb-1.5">
                Order Note (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="Any instructions for delivery..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold px-3 py-2.5 rounded outline-none focus:border-[#ffd300] resize-none"
              ></textarea>
            </div>
          </div>

          {/* Payment Gateway Select Card */}
          <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-xs flex flex-col gap-4">
            <h3 className="text-xs uppercase font-extrabold text-gray-900 tracking-wider mb-2 border-b border-gray-50 pb-2">
              2. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Cash On Delivery */}
              <label
                className={`border p-4 rounded-lg flex flex-col items-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-[#ffd300] bg-yellow-50/20 text-[#c29900]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="sr-only"
                />
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h.007v.008H3.75V4.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3 13.5h.008v.008H3v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider">Cash on Delivery</span>
              </label>

              {/* bKash Payment */}
              {gateways.bkash && (
                <label
                  className={`border p-4 rounded-lg flex flex-col items-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === "bkash"
                      ? "border-[#ffd300] bg-yellow-50/20 text-[#c29900]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "bkash"}
                    onChange={() => setPaymentMethod("bkash")}
                    className="sr-only"
                  />
                  {/* Mock icon/logo for bKash */}
                  <span className="text-lg font-black text-pink-500">bKash</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Mobile Banking</span>
                </label>
              )}

              {/* Shurjopay Card Payment */}
              {gateways.shurjopay && (
                <label
                  className={`border p-4 rounded-lg flex flex-col items-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === "shurjopay"
                      ? "border-[#ffd300] bg-yellow-50/20 text-[#c29900]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "shurjopay"}
                    onChange={() => setPaymentMethod("shurjopay")}
                    className="sr-only"
                  />
                  <span className="text-lg font-black text-blue-600">Online</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Cards / Net Banking</span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (Sidebar) */}
        <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-xs flex flex-col gap-4 lg:sticky lg:top-24">
          <h3 className="text-xs uppercase font-extrabold text-gray-900 tracking-wider mb-2 border-b border-gray-50 pb-2">
            Order Summary
          </h3>

          {/* Cart Item Row List */}
          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.rowId} className="flex gap-2 items-center text-xs border-b border-gray-50 pb-2">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-10 h-10 object-contain rounded bg-gray-50 border p-0.5"
                  />
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-gray-800 truncate leading-none mb-1">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      Qty: {item.qty}
                      {(item.product_size || item.product_color) && " | "}
                      {item.product_size} {item.product_color}
                    </p>
                  </div>
                  <span className="font-extrabold text-gray-900 whitespace-nowrap">
                    ৳ {(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">No items in your cart.</p>
            )}
          </div>

          {/* Total Cost Calculations */}
          <div className="flex flex-col gap-2 border-t border-gray-100 pt-3 text-xs font-semibold text-gray-600">
            <div className="flex justify-between">
              <span>Items Total ({cartCount})</span>
              <span className="text-gray-950 font-bold">৳ {cartSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Charge</span>
              <span className="text-gray-950 font-bold">
                {shippingCost > 0 ? `৳ ${shippingCost.toLocaleString()}` : "Select area"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-extrabold border-t border-gray-100 pt-2 text-gray-950">
              <span className="uppercase text-xs text-gray-400 tracking-wider">Grand Total</span>
              <span className="text-base text-[#c29900] font-black">৳ {orderTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Submission Action Button */}
          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0}
            className="w-full bg-[#ffd300] hover:bg-[#e6be00] text-black py-3 rounded text-xs font-extrabold uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:hover:bg-[#ffd300] disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>Confirm Order</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
