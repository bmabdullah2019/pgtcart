"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function LoginSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get("status");
    const name = searchParams.get("name");
    const phone = searchParams.get("phone");
    const redirectTo = searchParams.get("redirect_to") || "/";

    if (status === "success" && name && phone) {
      localStorage.setItem(
        "customer",
        JSON.stringify({
          name: decodeURIComponent(name),
          phone: decodeURIComponent(phone),
        })
      );
      
      // Redirect to target page or home after a brief delay
      const timer = setTimeout(() => {
        router.push(redirectTo);
        // Force refresh header / state
        router.refresh();
        if (typeof window !== "undefined") {
          window.location.href = redirectTo; // Force full reload to update header state completely
        }
      }, 800);

      return () => clearTimeout(timer);
    } else {
      // Something went wrong, redirect to login
      router.push("/customer/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-gray-50/50">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center">
        {/* Animated green checkmark circle */}
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500 animate-bounce">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">
          Authentication Successful
        </h2>
        <p className="text-sm font-semibold text-gray-500 mb-6">
          Welcome back! Logging you in...
        </p>
        <div className="flex gap-1.5 justify-center">
          <span className="w-2.5 h-2.5 bg-[#ffd300] rounded-full animate-bounce"></span>
          <span className="w-2.5 h-2.5 bg-[#ffd300] rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-2.5 h-2.5 bg-[#ffd300] rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
      </div>
    </div>
  );
}

export default function LoginSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ffd300] mb-4"></div>
        <p className="text-xs font-bold uppercase tracking-wider">Processing login...</p>
      </div>
    }>
      <LoginSuccessContent />
    </Suspense>
  );
}
