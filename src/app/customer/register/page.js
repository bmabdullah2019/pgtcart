"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BACKEND_URL } from "../../../utils/api";

function RegisterContent() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");
    if (status === "error" && message) {
      setErrorMsg(decodeURIComponent(message));
    }
  }, [searchParams]);

  const redirectTo = searchParams.get("redirect_to") || "/";
  const successUrl = typeof window !== "undefined"
    ? `${window.location.origin}/customer/login-success?redirect_to=${encodeURIComponent(redirectTo)}`
    : "";

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-semibold">
            Register to join and start managing your orders today
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs font-bold text-rose-800">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-4" action={`${BACKEND_URL}/customer/store`} method="POST">
          {/* Success redirect URI */}
          <input type="hidden" name="redirect" value={successUrl} />

          <div>
            <label htmlFor="name" className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ffd300]/40 focus:border-[#ffd300] text-sm font-semibold transition-all"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="e.g. 017XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ffd300]/40 focus:border-[#ffd300] text-sm font-semibold transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address (Optional)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="yourname@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ffd300]/40 focus:border-[#ffd300] text-sm font-semibold transition-all"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ffd300]/40 focus:border-[#ffd300] text-sm font-semibold pr-12 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 bottom-3.5 text-gray-400 hover:text-gray-600 focus:outline-none text-xs font-extrabold px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-black rounded-xl text-black bg-[#ffd300] hover:bg-[#e6be00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffd300]/40 shadow-md hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider"
            >
              Register & Sign In
            </button>
          </div>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-extrabold uppercase tracking-widest">Already have an account?</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div>
          <Link
            href={`/customer/login?redirect_to=${encodeURIComponent(redirectTo)}`}
            className="w-full flex justify-center py-3.5 px-4 border border-gray-200 text-sm font-black rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none shadow-sm transition-all cursor-pointer uppercase tracking-wider"
          >
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CustomerRegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ffd300] mb-4"></div>
        <p className="text-xs font-bold uppercase tracking-wider">Loading Register...</p>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
