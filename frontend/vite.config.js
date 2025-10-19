import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     port: 5173,
//     proxy: {
//       "/api": {
//         target: "http://localhost:5198",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//     host: true,
//     watch: { usePolling: true },
//     hmr: { clientPort: 5173 },
//   },
// });  dev-only

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    
    server: {
      host: true, // Listen on all addresses
      port: 3002,
      proxy: {
        '/api': {
          target: 'http://localhost:5198',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path
        }
      }
    },
    
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development', // Enable sourcemaps only in development
    },
    
    // Define global constants
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        mode === 'production' ? '/api' : 'http://localhost:5198/api'
      ),
      'import.meta.env.VITE_APP_MODE': JSON.stringify(mode)
    },
    
    // Base path for production
    base: './'
  }
})
