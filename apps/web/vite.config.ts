import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? "/haii/",
  plugins: [react()],
  server: {
    proxy: {
      '/haii/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/haii\/api/, ''),
      },
    },
  },
});
