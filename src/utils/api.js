export const BACKEND_URL = typeof window === "undefined"
  ? (process.env.BACKEND_URL || "http://localhost/react%20ecom/aminreact")
  : (window.location.origin.includes("localhost")
      ? "http://localhost/react%20ecom/aminreact"
      : "https://admin.pgtcart.com");
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
  if (BACKEND_URL.includes("localhost") && !BACKEND_URL.includes("localhost:8000")) {
    if (!cleanPath.startsWith("public/")) {
      cleanPath = "public/" + cleanPath;
    }
  } else {
    if (cleanPath.startsWith("public/")) {
      cleanPath = cleanPath.substring(7);
    }
  }
  return `${BACKEND_URL}/${cleanPath}`;
}
