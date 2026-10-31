import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The browser always calls "/api/...". In dev, Vite forwards it to the local API;
// in production, Netlify forwards it to the Vercel API (see netlify.toml).
// That keeps the login cookie first-party, so it works in Safari and with strict privacy settings.
const apiTarget = process.env.VITE_DEV_API_TARGET || "http://localhost:5000";
const proxy = {
  "/api": {
    target: apiTarget,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ""),
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, proxy },
  preview: { proxy },
  build: { sourcemap: false },
});
