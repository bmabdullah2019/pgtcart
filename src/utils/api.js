const IS_SERVER = typeof window === "undefined";

export const BACKEND_URL = (() => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) return process.env.NEXT_PUBLIC_BACKEND_URL;
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL;

  if (!IS_SERVER) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost/react%20ecom/aminreact";
    }
    return "https://admin.pgtcart.com";
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost/react%20ecom/aminreact";
  }
  return "https://admin.pgtcart.com";
})();

export const API_BASE = `${BACKEND_URL}/api/v1`;

export function getImageUrl(path) {
  if (!path) return "/no-image.jpg";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  // Remove leading slashes and format slashes
  let cleanPath = path.replace(/\\/g, "/").replace(/^\/+/, "");
  
  // For local development on Laragon (port 80/443), we need the "public/" prefix to access assets 
  // since the local root URL maps to the project root, not the public/ folder.
  // For production or php artisan serve, the URL maps directly to the public folder, so we strip "public/".
  // Note: On production (https://admin.pgtcart.com), the server maps to the project root, so it also needs the "public/" prefix.
  const mapsToPublicFolder = BACKEND_URL.includes("localhost:8000") || BACKEND_URL.includes("127.0.0.1:8000");

  if (mapsToPublicFolder) {
    if (cleanPath.startsWith("public/")) {
      cleanPath = cleanPath.substring(7);
    }
  } else {
    if (!cleanPath.startsWith("public/")) {
      cleanPath = "public/" + cleanPath;
    }
  }
  return `${BACKEND_URL}/${cleanPath}`;
}
