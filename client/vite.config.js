import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const configDirectory = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const { VITE_API_URL } = loadEnv(mode, configDirectory, "VITE_");
  if (!VITE_API_URL) {
    throw new Error("Missing VITE_API_URL. Set it in client/.env or the deployment environment.");
  }

  let apiUrl;
  try {
    apiUrl = new URL(VITE_API_URL);
  } catch {
    throw new Error("VITE_API_URL must be an absolute HTTP or HTTPS URL ending in /api/v1.");
  }

  if (
    !["http:", "https:"].includes(apiUrl.protocol) ||
    !apiUrl.pathname.replace(/\/+$/, "").endsWith("/api/v1") ||
    apiUrl.username ||
    apiUrl.password
  ) {
    throw new Error("VITE_API_URL must be an absolute HTTP or HTTPS URL ending in /api/v1.");
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Matches the backend's default FRONTEND_ORIGIN (http://localhost:3000)
      port: 3000,
      // Fail instead of silently moving to another port (which CORS would block)
      strictPort: true,
    },
    preview: {
      // Same port as dev so `npm run preview` also passes the backend's CORS check
      port: 3000,
      strictPort: true,
    },
  };
});
