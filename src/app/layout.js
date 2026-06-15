import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { API_BASE } from "../utils/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "../context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sakura e-Commerce Store",
  description: "Next.js-powered public storefront connected to Laravel admin backend",
};

async function getGlobalData() {
  const fetchAPI = async (endpoint) => {
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      return json?.status === "success" ? json.data : null;
    } catch (err) {
      console.error(`Error fetching global data from ${endpoint}:`, err);
      return null;
    }
  };

  const [
    config,
    categories,
    contact,
    footerLeft,
    footerRight,
    socialLinks,
  ] = await Promise.all([
    fetchAPI("app-config"),
    fetchAPI("category-menu"),
    fetchAPI("contactinfo"),
    fetchAPI("footer-menu-left"),
    fetchAPI("footer-menu-right"),
    fetchAPI("social-media"),
  ]);

  return {
    config,
    categories,
    contact,
    footerLeft,
    footerRight,
    socialLinks,
  };
}

export default async function RootLayout({ children }) {
  const {
    config,
    categories,
    contact,
    footerLeft,
    footerRight,
    socialLinks,
  } = await getGlobalData();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 font-sans">
        <CartProvider>
          <Header config={config} contact={contact} categories={categories} />
          <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-6 flex flex-col gap-8">
            {children}
          </main>
          <Footer
            config={config}
            contact={contact}
            leftMenu={footerLeft || []}
            rightMenu={footerRight || []}
            socialLinks={socialLinks}
          />
        </CartProvider>
      </body>
    </html>
  );
}
