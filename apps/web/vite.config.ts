import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? "/haii/",
  plugins: [react()],
  server: {
    // During local development, forward API requests under /haii/api to the
    // backend running on localhost:8000 so the frontend can call
    // /haii/api/v1/... without hitting the Vite dev server.
    proxy: {
      '/haii/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/haii\/api/, ''),
      },
    },
  },
});
