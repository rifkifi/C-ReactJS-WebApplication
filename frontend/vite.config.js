import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5198",
        changeOrigin: true,
        secure: false,
      },
    },
    host: true,
    watch: { usePolling: true },
    hmr: { clientPort: 5173 },
  },
}); 