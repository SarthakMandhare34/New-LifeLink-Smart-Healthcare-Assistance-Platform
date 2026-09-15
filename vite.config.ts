import tailwindcss from "@tailwindcss/vite";                   // Vite plugin for compiling Tailwind CSS utility classes
import react from "@vitejs/plugin-react";                        // Official Vite plugin providing React Fast Refresh and JSX support
import path from "node:path";                                    // Node.js built-in module for resolving cross-platform file paths
import { defineConfig } from "vite";                             // Helper function providing full TypeScript type-hinting for Vite config

// --- Cluster: Build Plugins ---
const plugins = [
  react(),                                                       // Enables React 19 JSX compilation and hot module reloading (HMR)
  tailwindcss()                                                  // Processes and bundles modern Tailwind CSS styles automatically
];

// --- Cluster: Dynamic API Port Configuration ---
// In development, scripts/dev.mjs finds an open port and injects VITE_API_PORT.
// If not found, it defaults to the standard Express port (4000).
const API_PORT = process.env.VITE_API_PORT || process.env.PORT || "4000"; // Read backend port from environment or fallback to 4000
const target = `http://127.0.0.1:${API_PORT}`;                           // Direct IPv4 loopback URL for reliable proxy forwarding without IPv6 resolution delays

export default defineConfig({
  plugins,                                                       // Registers our React and Tailwind plugins with Vite
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "frontend", "src"), // "@" maps directly to frontend source code folder
      "@shared": path.resolve(import.meta.dirname, "shared"),    // "@shared" maps to shared constants and validation logic
      "@assets": path.resolve(import.meta.dirname, "attached_assets"), // "@assets" maps to static design assets and icons
    },
  },
  envDir: path.resolve(import.meta.dirname),                      // Look for .env files in the project root directory
  root: path.resolve(import.meta.dirname, "frontend"),            // Set Vite's project root to the frontend folder
  publicDir: path.resolve(import.meta.dirname, "frontend", "public"), // Folder containing static files served directly as-is
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),     // Compile production frontend bundle into dist/public folder
    emptyOutDir: true,                                           // Clean old files in dist/public before starting a new build
    chunkSizeWarningLimit: 600,                                  // Set warning threshold to 600 kB for partitioned vendor modules
    rollupOptions: {
      output: {
        // --- Cluster: Intelligent Vendor Chunk Partitioning ---
        // Instead of downloading one massive bundle, third-party libraries (node_modules)
        // are split into logical groups so browsers can download them in parallel and cache them:
        manualChunks(id) {
          if (id.includes("node_modules")) {
            const normalized = id.replace(/\\/g, "/"); // Normalize Windows backslashes
            
            // 1. Core React runtime (React, ReactDOM, React Router)
            if (
              normalized.includes("/node_modules/react/") ||
              normalized.includes("/node_modules/react-dom/") ||
              normalized.includes("/node_modules/react-router-dom/")
            ) {
              return "vendor-react";
            }
            
            // 2. Charts & Analytics (Recharts)
            if (normalized.includes("/node_modules/recharts/")) {
              return "vendor-charts";
            }
            
            // 3. Interactive Mumbai Rail Maps (Leaflet & OpenStreetMap)
            if (
              normalized.includes("/node_modules/leaflet/") ||
              normalized.includes("/node_modules/react-leaflet/")
            ) {
              return "vendor-maps";
            }
            
            // 4. UI Primitives, Micro-Animations & Icons (Radix, Lucide, Framer Motion, Sonner)
            if (
              normalized.includes("/node_modules/@radix-ui/") ||
              normalized.includes("/node_modules/lucide-react/") ||
              normalized.includes("/node_modules/framer-motion/") ||
              normalized.includes("/node_modules/sonner/")
            ) {
              return "vendor-ui";
            }
            
            // 5. Data Fetching & Type-Safe RPC (TanStack React Query & tRPC)
            if (
              normalized.includes("/node_modules/@tanstack/") ||
              normalized.includes("/node_modules/@trpc/")
            ) {
              return "vendor-query";
            }
          }
        },
      },
    },
  },
  server: {
    port: 5173,                                                  // Run Vite local dev server on standard port 5173
    host: true,                                                  // Listen on all network interfaces (allows mobile / LAN testing)
    open: true,                                                  // Automatically open the app in the default web browser on launch
    fs: {
      strict: true,                                              // Enforce security by restricting file access inside project root
      deny: ["**/.*"],                                           // Prevent serving hidden files (like .env or .git files) to browsers
    },
    // --- Cluster: Reverse Proxy Settings ---
    // Forwards API requests from port 5173 to port 4000 seamlessly to avoid browser CORS errors
    proxy: {
      "/api": {
        target: target,                                          // Forward all /api/trpc calls directly to the Express backend
        changeOrigin: true,                                      // Changes the Host header to match backend target
        ws: true,                                                // Enable WebSocket / SSE forwarding for live event streaming
        configure: (proxy) => {
          proxy.on("error", (err, _req, res) => {
            // Gracefully handle connection attempts during initial Express boot milliseconds
            if (res && "writeHead" in res && !res.headersSent) {
              res.writeHead(503, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Backend server starting up, please refresh in a moment" }));
            }
          });
        },
      },
      "/uploads": {
        target: target,                                          // Forward avatar and document requests to Express static folder
        changeOrigin: true,                                      // Rewrite origin header for static asset access
        configure: (proxy) => {
          proxy.on("error", (err, _req, res) => {
            if (res && "writeHead" in res && !res.headersSent) {
              res.writeHead(503, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Backend server starting up" }));
            }
          });
        },
      },
    },
  },
});
