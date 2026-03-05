
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("/react-router-dom/")
            ) {
              return "react-vendor";
            }

            if (id.includes("@tanstack/react-query")) {
              return "query-vendor";
            }

            if (id.includes("@supabase/")) {
              return "supabase-vendor";
            }

            if (
              id.includes("@radix-ui/") ||
              id.includes("lucide-react") ||
              id.includes("class-variance-authority") ||
              id.includes("tailwind-merge") ||
              id.includes("/clsx/")
            ) {
              return "ui-vendor";
            }
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  // Use our custom TypeScript configuration
  root: '.',
}));
