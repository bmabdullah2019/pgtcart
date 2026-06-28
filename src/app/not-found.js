import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
      {/* Decorative Glow and Illustration */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#ffd300]/25 blur-3xl rounded-full w-52 h-52 -translate-x-1/4 -translate-y-1/4 select-none pointer-events-none"></div>
        <h1 className="relative text-8xl md:text-9xl font-black tracking-widest text-[#ffd300] drop-shadow-md select-none animate-pulse">
          404
        </h1>
      </div>

      <div className="max-w-md mx-auto z-10">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 uppercase tracking-wider">
          Oops! Page Not Found / পেজটি পাওয়া যায়নি
        </h2>
        
        <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-8 px-2">
          দুঃখিত, আপনি যে প্রোডাক্ট, ক্যাটাগরি বা পেজটি খুঁজছেন তা খুঁজে পাওয়া যায়নি। এটি হয়তো মুছে ফেলা হয়েছে, নাম পরিবর্তন করা হয়েছে অথবা লিংকটি ভুল ছিল।
          <span className="block mt-3 text-[11px] md:text-xs text-gray-400 font-medium">
            The page, category, or product you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 px-4">
          <Link
            href="/"
            className="bg-[#ffd300] text-black hover:bg-[#e6be00] px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
          >
            <svg className="w-4 h-4 stroke-current transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back Home
          </Link>
          <Link
            href="/contact"
            className="bg-white border-2 border-gray-200 text-gray-800 hover:border-[#ffd300] hover:bg-amber-50/10 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
